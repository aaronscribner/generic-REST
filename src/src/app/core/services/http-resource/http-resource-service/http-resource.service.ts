import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Resource } from '../../../../shared/models/base-classes/resource.model';
import { SubResource } from '../../../../shared/models/base-classes/sub-resource.model';
import { HttpVerb } from '../../resource-url-service/enums/http-verbs.enum';
import { ResourceUrlService } from '../../resource-url-service/resource-url.service';
import { ResourceAction } from '../enums/resource-action.enum';
import { IHttpResourceResponse } from '../interfaces/http-resource-response.interface';

@Injectable({
  providedIn: 'root'
})
export abstract class HttpResourceService<T extends Resource, U extends Resource> {
  protected constructor(
    private resourceName: string,
    private httpClient: HttpClient,
    private resourceUrlService: ResourceUrlService
  ) {
  }

  public list(item: T = null): Observable<U[]> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );
    const headers = this.getHeaders(endpointDetails.version);
    const endpointUri = (item && item instanceof SubResource)
      ? this.buildUrl(endpointDetails.endpoint, item, true)
      : endpointDetails.endpoint;

    console.table({endpointUri});
    return of(null);
    // return this.httpClient
    //   .get<U[]>(endpointUri, {
    //     headers
    //   })
    //   .pipe(map((data: U[]) => this.responseHandler(data, HttpVerb.GET, ResourceAction.List) as U[]));
  }

  public create(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.POST
    );

    const endpointUri = (item instanceof SubResource)
      ? this.buildUrl(endpointDetails.endpoint, item)
      : endpointDetails.endpoint;

    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient
      .post<T>(endpointDetails.endpoint, item)
      .pipe(
        map((data: T) => this.responseHandler(data, HttpVerb.POST, ResourceAction.Create) as T)
        // catchError(data => this.handleError(data))
      );
  }

  public read(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );

    const endpointUri = (item instanceof SubResource)
      ? this.buildUrl(endpointDetails.endpoint, item)
      : endpointDetails.endpoint;

    const headers = this.getHeaders(endpointDetails.version);
    console.table({ uri: `${endpointUri}/${item.id}`, item});
    return this.httpClient.get<T>(`${endpointDetails.endpoint}/${item.id}`)
      .pipe(
        map((data: T) => this.responseHandler(data, HttpVerb.GET, ResourceAction.Read) as T)
      );
  }

  public query(item: T, urlParameters: any = {}): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );

    const endpointUri = (item instanceof SubResource)
      ? this.buildUrl(endpointDetails.endpoint, item)
      : endpointDetails.endpoint;

    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient.get<T>(`${endpointDetails.endpoint}/${urlParameters}`)
      .pipe(
        map((data: T) => this.responseHandler(data, HttpVerb.GET, ResourceAction.Query) as T)
      );
  }

  public update(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.PUT
    );

    const endpointUri = (item instanceof SubResource)
      ? this.buildUrl(endpointDetails.endpoint, item)
      : endpointDetails.endpoint;

    const headers = this.getHeaders(endpointDetails.version);
    console.table({ uri: `${endpointUri}/${item.id}`, item});
    return of(item);
    // return this.httpClient.put<T>(`${endpointDetails.endpoint}/${item.id}`, item)
    //   .pipe(
    //     map((data: T) => this.responseHandler(data, HttpVerb.PUT, ResourceAction.Update) as T)
    //   );
  }

  public delete(item: T): Observable<object> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.DELETE
    );

    const endpointUri = (item instanceof SubResource)
      ? this.buildUrl(endpointDetails.endpoint, item)
      : endpointDetails.endpoint;

    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient.delete(`${endpointDetails.endpoint}/${item.id}`)
      .pipe(
        map((data: T) => this.responseHandler(data, HttpVerb.DELETE, ResourceAction.Delete) as T)
      );
  }

  private getHeaders(version: string): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('version', version);
    return headers;
  }

  private buildUrl(endpoint: string, item: SubResource, isList: boolean = false) {
    // TODO: check that the occurrences of :id match the length of identifiers.
    let url = '';
    const urlIdentifiers = [...item.identifierHierarchy];
    if (isList) {
      urlIdentifiers.push(item.id);
    }

    endpoint.split('/').forEach(x => {
      if (x.search(':id') !== -1) {
        const identifier = urlIdentifiers.shift();
        url = url.concat(x.replace(':id', identifier.toString()), '/');
      } else {
        url = url.concat(`${x}/`);
      }
    });

    return url;
  }

  // private handleError(response: T | U): void {
  //   throw response && response.error
  //     ? response.error
  //     : { status: 404, message: 'Empty result' };
  // }

  protected abstract responseHandler(response: any, verb: HttpVerb, action: ResourceAction): T | T[] | U | U[];
}
