import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { Resource } from '../../../../shared/models/base-classes/resource.model';
import { HttpVerb } from '../../resource-url-service/enums/http-verbs.enum';
import { ResourceUrlService } from '../../resource-url-service/resource-url.service';
import { IHttpResourceResponse } from '../interfaces/http-resource-response.interface';

export class HttpResourceService<T extends Resource<T>, U extends Resource<U>> {
  constructor(
    private resourceName: string,
    private httpClient: HttpClient,
    private resourceUrlService: ResourceUrlService,
    private type: new (object?: T) => T,
    private listType: new (object?: U) => U
  ) {}

  public list(): Observable<U[]> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient
      .get<IHttpResourceResponse<U[]>>(endpointDetails.endpoint, {
        headers
      })
      .pipe(
        map(response => {
          if (response && response.data) {
            return response.data.map(item => new this.listType(item));
          } else {
            this.handleError(response);
          }
        })
      );
  }

  public create(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.POST
    );
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient
      .post<IHttpResourceResponse<T>>(endpointDetails.endpoint, item, {
        headers
      })
      .pipe(
        map(response => {
          if (response && response.data) {
            return new this.type(response.data);
          } else {
            this.handleError(response);
          }
        })
      );
  }

  public read(id: number | string): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient
      .get<IHttpResourceResponse<T>>(`${endpointDetails.endpoint}/${id}`, {
        headers
      })
      .pipe(this.mapResponse());
  }

  public query(): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient
      .get<IHttpResourceResponse<T>>(`${endpointDetails.endpoint}`, {
        headers
      })
      .pipe(this.mapResponse());
  }

  public update(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.PUT
    );
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient
      .put<IHttpResourceResponse<T>>(
        `${endpointDetails.endpoint}/${item.id}`,
        item,
        { headers }
      )
      .pipe(this.mapResponse());
  }

  public delete(id: number | string): Observable<object> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.DELETE
    );
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient
      .delete<IHttpResourceResponse<{}>>(`${endpointDetails.endpoint}/${id}`, {
        headers
      })
      .pipe(
        map(response => {
          if (response && response.error) {
            this.handleError(response);
          } else {
            return response;
          }
        })
      );
  }

  private getHeaders(version: string): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('version', version);
    return headers;
  }

  private handleError<V>(response: IHttpResourceResponse<V>): void {
    throw response && response.error
      ? response.error
      : { status: 404, message: 'Empty result' };
  }

  private mapResponse(): OperatorFunction<IHttpResourceResponse<T>, T> {
    return map((response: IHttpResourceResponse<T>) => {
      if (response && response.data) {
        return new this.type(response.data);
      } else {
        this.handleError(response);
      }
    });
  }
}
