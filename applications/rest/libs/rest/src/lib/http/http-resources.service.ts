import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { HttpRequestOptions, HttpRequestOptionsPlain } from './interfaces/http-request-options.interface';
import { HttpResourceResponse } from './interfaces/http-resource-response.interface';
import { Resource } from '../resources/resource.model';
import { HttpServiceBase } from './http-base.service';
import { ObservableDataSource } from '../core/types/observable-data-source.type';
import { ResourcesConfiguration } from '../resources/decorators/resources-configuration.container';

export class HttpResourcesService<
  T extends Resource<T, IdType>,
  IdType extends number | string = number
> extends HttpServiceBase {
  constructor(
    private type: new (object?: T) => T,
    injector: Injector,
    private urlParams?: {
      [param: string]: ObservableDataSource<string | number>;
    }
  ) {
    super(injector);

    const resource = ResourcesConfiguration.resources.find(r => r.type.name === this.type.name);
    this.resourceName = resource && resource.resourceName;
  }

  // TODO: FRAMEWORK: standardize type param names
  public add<RequestType>(item: ObservableDataSource<RequestType>, options: HttpRequestOptions<T> = {}): Observable<T> {
    return this.httpHelperService.prepareRequest(options.urlParams, this.urlParams).pipe(
      flatMap(request => {
        const unwrappedOptions = options as HttpRequestOptionsPlain<T>;
        unwrappedOptions.urlParams = request && request.urlParams;
        return this.httpPost<RequestType, HttpResourceResponse<T>, T>(item, unwrappedOptions)
          .pipe(map(response => this.httpHelperService.mapResponse<T, T>(response, unwrappedOptions)))
          .pipe(this.httpHelperService.createInstance<T, T>(this.type));
      })
    );
  }

  public delete(id: ObservableDataSource<IdType>, options: HttpRequestOptions<T> = {}): Observable<void> {
    return this.httpHelperService.prepareRequest(options.urlParams, this.urlParams).pipe(
      flatMap(request => {
        const unwrappedOptions = options as HttpRequestOptionsPlain<T>;
        unwrappedOptions.urlParams = request && request.urlParams;

        return this.httpDelete<IdType, HttpResourceResponse<{}>, {}>(id, unwrappedOptions).pipe(
          map(response =>
            this.httpHelperService.mapResponse<void, T>(response, { ...unwrappedOptions, ignoreEmpty: true })
          )
        );
      })
    );
  }

  public get<R extends T | T[]>(id?: ObservableDataSource<IdType>, options: HttpRequestOptions<T> = {}): Observable<R> {
    return this.httpHelperService.prepareRequest(options.urlParams, this.urlParams).pipe(
      flatMap(request => {
        const unwrappedOptions = options as HttpRequestOptionsPlain<T>;
        unwrappedOptions.urlParams = request && request.urlParams;
        return this.httpGet<IdType, HttpResourceResponse<R>, T>(id, unwrappedOptions)
          .pipe(map(response => this.httpHelperService.mapResponse(response, unwrappedOptions)))
          .pipe(this.httpHelperService.createInstance<R, T>(this.type));
      })
    );
  }

  public upsert<RequestType>(
    item: ObservableDataSource<RequestType>,
    options: HttpRequestOptions<T> = {}
  ): Observable<T> {
    return this.getObservableFrom(item).pipe(
      flatMap(object =>
        object && object[this.idKey] ? this.update<RequestType>(item, options) : this.add<RequestType>(item, options)
      )
    );
  }

  public update<RequestType>(
    item: ObservableDataSource<RequestType>,
    options: HttpRequestOptions<T> = {}
  ): Observable<T> {
    return this.httpHelperService.prepareRequest(options.urlParams, this.urlParams).pipe(
      flatMap(request => {
        const unwrappedOptions = options as HttpRequestOptionsPlain<T>;
        unwrappedOptions.urlParams = request && request.urlParams;
        return this.httpPut<RequestType, HttpResourceResponse<T>, T>(item, unwrappedOptions)
          .pipe(map(response => this.httpHelperService.mapResponse<T, T>(response, unwrappedOptions)))
          .pipe(this.httpHelperService.createInstance<T, T>(this.type));
      })
    );
  }
}
