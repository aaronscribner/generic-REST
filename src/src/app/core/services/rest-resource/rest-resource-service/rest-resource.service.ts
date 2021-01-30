import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Resource } from '@shared/models/base-classes/resource.model';
import { HttpVerb } from '../../resource-url/enums/http-verbs.enum';
import { ResourceUrlService } from '../../resource-url/resource-url.service';
import { ResourceAction } from '../enums/resource-action.enum';
import { HttpCodeMessageService } from '@core/services/http-code-message/http-code-message.service';

@Injectable({
  providedIn: 'root'
})
export abstract class RestResourceService<T extends Resource> {
  private readonly httpCodeMessageService = new HttpCodeMessageService();

  protected constructor(
    @Inject('string') private resourceName: string,
    private httpClient: HttpClient,
    private resourceUrlService: ResourceUrlService,
  ) {
  }

  public list(item: T = null): Observable<T[]> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );
    const headers = this.getHeaders(endpointDetails.version);
    const endpointUri = this.buildUrl(endpointDetails.endpoint, item, true);
    return this.httpClient
      .get<T[]>(endpointUri, {
        headers
      })
      .pipe(
        catchError((error: any, object: Observable<T[]>) => {
          return of(this.httpCodeMessageService.getErrorMessage(error.status, HttpVerb.GET, this.resourceName));
        }),
        map((data: T[]) => this.responseHandler(data, HttpVerb.GET, ResourceAction.List) as T[])
      );
  }

  public create(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.POST
    );

    const endpointUri = this.buildUrl(endpointDetails.endpoint, item);
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient
      .post<T>(endpointUri, item, {
        headers
      })
      .pipe(
        catchError((error: any, object: Observable<T>) => {
          return of(this.httpCodeMessageService.getErrorMessage(error.status, HttpVerb.POST, this.resourceName));
        }),
        map((data: T) => this.responseHandler(data, HttpVerb.POST, ResourceAction.Create) as T)
      );
  }

  public read(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );

    const endpointUri = this.buildUrl(endpointDetails.endpoint, item);
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient.get<T>(`${endpointDetails.endpoint}/${item.id}`, {
        headers
      })
      .pipe(
        map((data: T) => this.responseHandler(data, HttpVerb.GET, ResourceAction.Read) as T)
      );
  }

  public query(item: T, urlParameters: any = {}): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );

    const endpointUri = this.buildUrl(endpointDetails.endpoint, item);
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient.get<T>(`${endpointUri}/${urlParameters}`, { headers })
      .pipe(
        map((data: T) => this.responseHandler(data, HttpVerb.GET, ResourceAction.Query) as T)
      );
  }

  public update(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.PUT
    );

    const endpointUri = this.buildUrl(endpointDetails.endpoint, item);
    const headers = this.getHeaders(endpointDetails.version);
    const itemCopy = { ...item };
    this.removeIdentifierHierarchy(itemCopy);
    return this.httpClient.put<T>(`${endpointUri}/${itemCopy.id}`, itemCopy)
      .pipe(
        catchError((error: any) => {
          return throwError(this.httpCodeMessageService.getErrorMessage(error.status, HttpVerb.PUT, this.resourceName));
        }),
        map((data: T) => this.responseHandler(data, HttpVerb.PUT, ResourceAction.Update) as T)
      );
  }

  public delete(item: T): Observable<object> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.DELETE
    );

    const endpointUri = this.buildUrl(endpointDetails.endpoint, item);

    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient.delete(`${endpointUri}/${item.id}`)
      .pipe(
        map((data: T) => this.responseHandler(data, HttpVerb.DELETE, ResourceAction.Delete) as T)
      );
  }

  private getHeaders(version: string): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('version', version);
    return headers;
  }

  private buildUrl(endpoint: string, item: Resource, isList: boolean = false) {
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

  private removeIdentifierHierarchy(item: Resource): void {
    delete item.identifierHierarchy;
    const itemProperties = Object.getOwnPropertyNames(item);
    itemProperties.forEach(p => {
      if (Array.isArray(item[p])) {
        item[p].forEach(arrayItem => {
          if (arrayItem.hasOwnProperty('identifierHierarchy')) {
            delete arrayItem.identifierHierarchy;
          }

          const arrayItemProperties = Object.getOwnPropertyNames(arrayItem);

          arrayItemProperties.forEach(arp => {
            if (arrayItem[arp].hasOwnProperty('identifierHierarchy')) {
              this.removeIdentifierHierarchy(arrayItem[arp]);
            }
          });
        });
      }
      else if (item[p].hasOwnProperty('identifierHierarchy')) {
        this.removeIdentifierHierarchy(item[p]);
      }
    });
  }

  protected abstract responseHandler(response: any, verb: HttpVerb, action: ResourceAction): T | T[];
}
