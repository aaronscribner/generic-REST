import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Injector } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { first, flatMap } from 'rxjs/operators';
import { HttpPermission } from '../resource-url/enums/http-permissions.enum';
import { HttpVerb } from '../resource-url/enums/http-verbs.enum';
import { ResourceUrlService } from '../resource-url/resource-url.service';
import {
  EndpointOptions,
  HttpRequestOptions,
  HttpRequestOptionsPlain
} from './interfaces/http-request-options.interface';
import { HttpHelperService } from './http-helper.service';
import { ObservableDataSource } from '../core/types/observable-data-source.type';
import { HttpRequestInformation } from './interfaces/http-request-information.interface';
import { ResourcesConfiguration } from '../resources/decorators/resources-configuration.container';
import { ObservableHelper } from '../observables/observable-helper.class';

export class HttpServiceBase {
  protected httpHelperService: HttpHelperService;
  private httpClient: HttpClient;
  private resourceUrlService: ResourceUrlService;

  private endpointOptions: EndpointOptions;

  private _resourceName: string; // tslint:disable-line: variable-name

  public get idKey(): string {
    return this.endpointOptions && this.endpointOptions.idKey;
  }

  protected get resourceName(): string {
    return this._resourceName;
  }

  protected set resourceName(value: string) {
    this._resourceName = value;
    this.endpointOptions = this.initializeResource(value);
  }

  // TODO: resource => endpoint
  constructor(injector: Injector) {
    this.httpClient = injector.get(HttpClient);
    this.resourceUrlService = injector.get(ResourceUrlService);
    this.httpHelperService = injector.get(HttpHelperService);
  }

  protected initializeResource(resourceName: string): EndpointOptions {
    const resource = ResourcesConfiguration.resources.find((r) => r.resourceName === resourceName);
    const endpoint = this.resourceUrlService.getEndpoint(resourceName);

    return {
      idKey: (resource.options && resource.options.idKey) || 'id',
      dontAppendId: endpoint && endpoint.dontAppendId,
      allow: endpoint && endpoint.allowOnly,
      deny: endpoint && endpoint.deny,
    };
  }

  protected httpDelete<IdType, T = {}, OptionsType = {}>(
    id: ObservableDataSource<IdType>,
    options: HttpRequestOptionsPlain<OptionsType> = {}
  ): Observable<T> {
    const requestInformation = this.getRequestTypeInformation(HttpVerb.DELETE, options);

    return this.getObservableFrom(id)
      .pipe(first())
      .pipe(
        flatMap((itemId) =>
          this.httpClient.delete<T>(
            this.formatUrl(`${requestInformation.endpoint}/${itemId}`, requestInformation),
            requestInformation.httpOptions
          )
        )
      );
  }

  protected httpGet<IdType, T = {}, OptionsType = {}>(
    id?: ObservableDataSource<IdType>,
    options: HttpRequestOptionsPlain<OptionsType> = {}
  ): Observable<T> {

    const requestInformation = this.getRequestTypeInformation(HttpVerb.GET, options);

    // TODO: HTTP: remove dontAppendId, find a better solution.
    return this.getObservableFrom(!this.getEndpointOptions(options).dontAppendId ? id : null)
      .pipe(first())
      .pipe(
        flatMap((itemId) =>
          this.httpClient.get<T>(
            this.formatUrl(`${requestInformation.endpoint}${itemId ? '/' + itemId : ''}`, requestInformation),
            requestInformation.httpOptions
          )
        )
      );
  }

  protected httpPost<RequestType, ResponseType, OptionsType = unknown>(
    item: ObservableDataSource<RequestType>,
    options: HttpRequestOptionsPlain<OptionsType> = {}
  ): Observable<ResponseType> {

    const requestInformation = this.getRequestTypeInformation(HttpVerb.POST, options);
    return this.getObservableFrom(item).pipe(
      flatMap((itemObject) =>
        this.httpClient.post<ResponseType>(
          this.formatUrl(requestInformation.endpoint, requestInformation),
          itemObject,
          requestInformation.httpOptions
        )
      )
    );
  }

  protected httpPut<RequestType, ResponseType, OptionsType = unknown>(
    item: ObservableDataSource<RequestType>,
    options: HttpRequestOptionsPlain<OptionsType> = {}
  ): Observable<ResponseType> {

    const requestInformation = this.getRequestTypeInformation(HttpVerb.PUT, options);
    const idKey = this.getEndpointOptions(options).idKey;

    return this.getObservableFrom(item)
      .pipe(first())
      .pipe(
        flatMap((object) =>
          this.httpClient.put<ResponseType>(
            this.formatUrl(`${requestInformation.endpoint}/${object[idKey]}`, requestInformation),
            item,
            requestInformation.httpOptions
          )
        )
      );
  }

  protected getObservableFrom<S>(source: ObservableDataSource<S>): Observable<S> {
    return ObservableHelper.getObservableFrom(source);
  }

  protected getRequestTypeInformation<T>(
    verb: HttpVerb,
    options: HttpRequestOptionsPlain<T> = {}
  ): HttpRequestInformation {
    const endpoint = this.getEndpointOptions(options).endpoint || this.resourceName;
    const endpointDetails = this.resourceUrlService.resourceUrl(endpoint, verb, options.urlParams);
    const headers = this.getHeaders(endpointDetails.version, options.headers);
    const httpOptions: any = options.params ? { headers, params: options.params } : { headers };
    if (options.body) {
      httpOptions.body = options.body;
    }

    return {
      endpoint: endpointDetails.endpoint,
      httpOptions
    };
  }

  private formatUrl(url: string, requestInformation: HttpRequestInformation): string {
    return url.endsWith('//') ? url.slice(0, url.length - 1) : url;
  }

  private getEndpointOptions(options: HttpRequestOptions<unknown>): EndpointOptions {
    if (!options?.endpointOptions) {
      return this.endpointOptions || {};
    } else {
      const serviceEndpointOptions = this.endpointOptions || {};
      return {
        idKey: options.endpointOptions.idKey || serviceEndpointOptions.idKey || 'id',
        allow: options.endpointOptions.allow || serviceEndpointOptions.allow,
        deny: options.endpointOptions.deny || serviceEndpointOptions.deny,
        dontAppendId: options.endpointOptions.dontAppendId || serviceEndpointOptions.dontAppendId,
        endpoint: options.endpointOptions.endpoint || serviceEndpointOptions.endpoint,
      };
    }
  }

  private getHeaders(version: string, headers = new HttpHeaders()): HttpHeaders {
    headers.append('version', version);
    return headers;
  }
}
