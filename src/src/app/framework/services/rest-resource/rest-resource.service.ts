import { HttpClient, HttpHeaders, HttpResponseBase } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RestVerb, ResourceAction } from '../../enums';
import { ResourceUrlService } from '../resource-url/resource-url.service';
import { HttpCodeMessageService } from '../http-code-message/http-code-message.service';
import { RestResource, RestUrlOptions } from '../../models';

@Injectable({
  providedIn: 'root'
})
export abstract class RestResourceService<T extends RestResource<T>> {
  private readonly httpCodeMessageService = new HttpCodeMessageService();

  public constructor(
    private resourceName: string,
    private httpClient: HttpClient,
    @Inject(ResourceUrlService) private resourceUrlService: ResourceUrlService,
  ) {
  }

  public list(item: T = null): Observable<T[]> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      RestVerb.GET
    );
    const headers = this.getHeaders(endpointDetails.version);
    const endpointUri = this.buildUrl(endpointDetails.endpoint, item, true);
    return this.httpClient
      .get<T[]>(endpointUri, {
        headers
      })
      .pipe(
        catchError((error: HttpResponseBase) => {
          return of(this.httpCodeMessageService.errorMessage(error.status, RestVerb.GET, this.resourceName));
        }),
        map((data: T[]) => this.responseHandler(data, RestVerb.GET, ResourceAction.List) as T[])
      );
  }

  public create(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      RestVerb.POST
    );

    const endpointUri = this.buildUrl(endpointDetails.endpoint, item);
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient
      .post<T>(endpointUri, item, {
        headers
      })
      .pipe(
        catchError((error: HttpResponseBase) => {
          return of(this.httpCodeMessageService.errorMessage(error.status, RestVerb.POST, this.resourceName));
        }),
        map((data: T) => this.responseHandler(data, RestVerb.POST, ResourceAction.Create) as T)
      );
  }

  public read(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      RestVerb.GET
    );

    const endpointUri = this.buildUrl(endpointDetails.endpoint, item);
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient.get<T>(`${endpointUri}/${item.id}`, { headers })
      .pipe(
        map((data: T) => this.responseHandler(data, RestVerb.GET, ResourceAction.Read) as T)
      );
  }

  public query(item: T, urlOptions?: RestUrlOptions): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      RestVerb.GET
    );

    const endpointUri = this.buildUrl(endpointDetails.endpoint, item);
    const headers = this.getHeaders(endpointDetails.version);

    return this.httpClient.get<T>(`${endpointUri}${urlOptions?.queryString}`, { headers })
      .pipe(
        map((data: T) => this.responseHandler(data, RestVerb.GET, ResourceAction.Query) as T)
      );
  }

  public update(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      RestVerb.PUT
    );

    const endpointUri = this.buildUrl(endpointDetails.endpoint, item);
    const headers = this.getHeaders(endpointDetails.version);
    const itemCopy = { ...item };
    this.removeIdentifierHierarchy(itemCopy);
    return this.httpClient.put<T>(`${endpointUri}/${itemCopy.id}`, itemCopy, { headers })
      .pipe(
        catchError((error: any) => {
          return throwError(this.httpCodeMessageService.errorMessage(error.status, RestVerb.PUT, this.resourceName));
        }),
        map((data: T) => this.responseHandler(data, RestVerb.PUT, ResourceAction.Update) as T)
      );
  }

  public delete(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      RestVerb.DELETE
    );

    const endpointUri = this.buildUrl(endpointDetails.endpoint, item);

    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient.delete(`${endpointUri}/${item.id}`, { headers })
      .pipe(
        map((data: T) => this.responseHandler(data, RestVerb.DELETE, ResourceAction.Delete) as T)
      );
  }

  private getHeaders(version: string): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('version', version);
    return headers;
  }

  private buildUrl(endpoint: string, item: T, isList: boolean = false) {
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

  private removeIdentifierHierarchy(item: T): void {
    delete item.identifierHierarchy;
    const itemProperties = Object.getOwnPropertyNames(item);
    const idProperty = 'identifierHierarchy';

    itemProperties.forEach(p => {
      if (Array.isArray(item[p])) {
        item[p].forEach(arrayItem => {
          // eslint-disable-next-line no-prototype-builtins
          if (arrayItem.hasOwnProperty(idProperty)) {
            delete arrayItem.identifierHierarchy;
          }

          const arrayItemProperties = Object.getOwnPropertyNames(arrayItem);

          arrayItemProperties.forEach(arp => {
            // eslint-disable-next-line no-prototype-builtins
            if (arrayItem[arp].hasOwnProperty(idProperty)) {
              this.removeIdentifierHierarchy(arrayItem[arp]);
            }
          });
        });
      }
      // eslint-disable-next-line no-prototype-builtins
      else if (item[p].hasOwnProperty(idProperty)) {
        this.removeIdentifierHierarchy(item[p]);
      }
    });
  }

  protected abstract responseHandler(response: any, verb: RestVerb, action: ResourceAction): T | T[];
}
