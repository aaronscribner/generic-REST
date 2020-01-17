import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Resource } from '../../../../shared/models/base-classes/resource.model';
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

  public list(): Observable<U[]> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient
      .get<U[]>(endpointDetails.endpoint, {
        headers
      })
      .pipe(map((data: U[]) => this.responseHandler(data, HttpVerb.GET, ResourceAction.List) as U[]));
  }

  public create(item: T): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.POST
    );
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient
      .post<T>(endpointDetails.endpoint, item)
      .pipe(
        map((data: T) => this.responseHandler(data, HttpVerb.POST, ResourceAction.Create) as T)
        // catchError(data => this.handleError(data))
      );
  }

  public read(id: number | string): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient.get<T>(`${endpointDetails.endpoint}/${id}`)
      .pipe(
        map((data: T) => this.responseHandler(data, HttpVerb.GET, ResourceAction.Read) as T)
      );
  }

  public query(urlParameters: any = {}): Observable<T> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.GET
    );
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
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient.put<T>(`${endpointDetails.endpoint}/${item.id}`, item)
      .pipe(
        map((data: T) => this.responseHandler(data, HttpVerb.PUT, ResourceAction.Update) as T)
      );
  }

  public delete(id: number | string): Observable<object> {
    const endpointDetails = this.resourceUrlService.resourceUrl(
      this.resourceName,
      HttpVerb.DELETE
    );
    const headers = this.getHeaders(endpointDetails.version);
    return this.httpClient.delete(`${endpointDetails.endpoint}/${id}`)
      .pipe(
        map((data: T) => this.responseHandler(data, HttpVerb.DELETE, ResourceAction.Delete) as T)
      );
  }

  private getHeaders(version: string): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('version', version);
    return headers;
  }

  // private handleError(response: T | U): void {
  //   throw response && response.error
  //     ? response.error
  //     : { status: 404, message: 'Empty result' };
  // }

  protected abstract responseHandler(response: any, verb: HttpVerb, action: ResourceAction): T | T[] | U | U[];
}
