import { HttpHeaders } from '@angular/common/http';
import { ObservableDataSource } from '@framework/core/types/observable-data-source.type';
import { HttpPermission } from '@framework/resource-url/enums/http-permissions.enum';

export interface EndpointOptions {
  endpoint?: string;
  idKey?: string;
  dontAppendId?: boolean;
  allow?: HttpPermission[];
  deny?: HttpPermission[];
}

export interface HttpRequestOptionsBase<T> {
  params?: {
    [param: string]: string | string[];
  };
  mapResponseFn?: (res) => T | T[];
  headers?: HttpHeaders;
  endpointOptions?: EndpointOptions;
  body?: T | T[];
}

export interface HttpRequestOptions<T> extends HttpRequestOptionsBase<T> {
  urlParams?: { [param: string]: ObservableDataSource<string | number> };
}

export interface HttpRequestOptionsPlain<T> extends HttpRequestOptionsBase<T> {
  urlParams?: { [param: string]: string | number };
}
