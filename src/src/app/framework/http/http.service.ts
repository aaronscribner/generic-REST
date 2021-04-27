import { Injector, Injectable } from '@angular/core';
import { ObservableDataSource } from './core/types/observable-data-source.type';
import { HttpServiceBase } from './http-base.service';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { HttpRequestOptions, HttpRequestOptionsPlain } from './interfaces/http-request-options.interface';
import { HttpResourceResponse } from './interfaces/http-resource-response.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService extends HttpServiceBase {
  constructor(injector: Injector) {
    super(injector);
  }

  public delete<IdType, T>(id: ObservableDataSource<IdType>, options: HttpRequestOptions<T> = {}): Observable<void> {
    return this.httpHelperService.prepareRequest(options.urlParams).pipe(
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

  public get<IdType, T>(id?: ObservableDataSource<IdType>, options: HttpRequestOptions<T> = {}): Observable<T> {
    return this.httpHelperService.prepareRequest(options.urlParams).pipe(
      flatMap(request => {
        const unwrappedOptions = options as HttpRequestOptionsPlain<T>;
        unwrappedOptions.urlParams = request && request.urlParams;
        return this.httpGet<IdType, HttpResourceResponse<T>, T>(id, unwrappedOptions).pipe(
          map(response => this.httpHelperService.mapResponse<T, T>(response, unwrappedOptions))
        );
      })
    );
  }

  public post<RequestType, T>(
    item: ObservableDataSource<RequestType>,
    options: HttpRequestOptions<T> = {}
  ): Observable<T> {
    return this.httpHelperService.prepareRequest(options.urlParams).pipe(
      flatMap(request => {
        const unwrappedOptions = options as HttpRequestOptionsPlain<T>;
        unwrappedOptions.urlParams = request && request.urlParams;
        return this.httpPost<RequestType, HttpResourceResponse<T>, T>(item, unwrappedOptions).pipe(
          map(response => this.httpHelperService.mapResponse<T, T>(response, unwrappedOptions))
        );
      })
    );
  }

  public put<RequestType, T>(
    item: ObservableDataSource<RequestType>,
    options: HttpRequestOptions<T> = {}
  ): Observable<T> {
    return this.httpHelperService.prepareRequest(options.urlParams).pipe(
      flatMap(request => {
        const unwrappedOptions = options as HttpRequestOptionsPlain<T>;
        unwrappedOptions.urlParams = request && request.urlParams;
        return this.httpPut<RequestType, HttpResourceResponse<T>, T>(item, unwrappedOptions).pipe(
          map(response => this.httpHelperService.mapResponse<T, T>(response, unwrappedOptions))
        );
      })
    );
  }
}
