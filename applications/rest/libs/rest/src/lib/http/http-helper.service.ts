import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, OperatorFunction } from 'rxjs';
import { map, first, flatMap } from 'rxjs/operators';
import { HttpResourceResponse } from './interfaces/http-resource-response.interface';
import { HttpRequestOptions } from './interfaces/http-request-options.interface';
import { ObservableDataSource } from '../core/types/observable-data-source.type';
import { ObservableHelper } from '../observables/observable-helper.class';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {
  public prepareRequest(
    urlParams: {
      [param: string]: ObservableDataSource<string | number>;
    },
    serviceUrlParams?: {
      [param: string]: ObservableDataSource<string | number>;
    }
  ): Observable<{
    urlParams: {
      [param: string]: string | number;
    };
  }> {
    if ((!urlParams || urlParams === {}) && (!serviceUrlParams || serviceUrlParams === {})) {
      return of({ urlParams: undefined });
    }
    if (serviceUrlParams) {
      if (!urlParams) {
        urlParams = {};
      }
      Object.keys(serviceUrlParams).forEach(key => {
        urlParams[key] = urlParams[key] || serviceUrlParams[key];
      });
    }
    return forkJoin(
      Object.keys(urlParams).map(key =>
        ObservableHelper.getObservableFrom(urlParams[key])
          .pipe(
            map(value => {
              return { key, value };
            })
          )
          .pipe(first())
      )
    )
      .pipe(
        map(list => {
          const flattened: {
            [param: string]: string | number;
          } = {};
          list.forEach(item => (flattened[item.key] = item.value));
          return flattened;
        })
      )
      .pipe(
        map(mergedParams => {
          return { urlParams: mergedParams };
        })
      );
  }

  public prepareChildRequest<TParent>(
    parent: ObservableDataSource<TParent>,
    urlParams: { [param: string]: ObservableDataSource<string | number> } = {},

    serviceUrlParams: {
      [param: string]: ObservableDataSource<string | number>;
    }
  ): Observable<{
    urlParams: {
      [param: string]: ObservableDataSource<string | number>;
    };
  }> {
    return ObservableHelper.getObservableFrom(parent).pipe(
      flatMap(parentObject => {
        if (serviceUrlParams) {
          Object.keys(serviceUrlParams).forEach(key => {
            urlParams[key] = serviceUrlParams[key] || `${parentObject[key]}`;
          });
        }
        return of({ urlParams });
      })
    );
  }

  public mapResponse<R, T>(
    response: HttpResourceResponse<unknown>,
    options?: HttpRequestOptions<T> & { ignoreEmpty?: boolean }
  ): R {
    if (options.mapResponseFn) {
      return (options.mapResponseFn(response) as unknown) as R;
    }

    // TODO: Fix this bug
    if (response) {
      return (response as unknown) as R;
    } else if (response && response.data) {
      return (response.data as unknown) as R;
    } else if (response && response.error) {
      throw response.error;
    } else {
      if (options && options.ignoreEmpty) {
        return (response as unknown) as R;
      } else {
        throw { status: 404, message: 'Empty result' };
      }
    }
  }

  public createInstance<R extends T | T[], T>(type: new (object?: T) => T): OperatorFunction<T | T[], R> {
    return map((response: T | T[]) =>
      Array.isArray(response) ? (response.map(i => new type(i)) as R) : (new type(response) as R)
    );
  }
}
