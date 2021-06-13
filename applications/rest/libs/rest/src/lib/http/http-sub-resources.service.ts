import { CommonService } from '@framework/core/services/common/common.service';
import { ObservableDataSource } from '@framework/core/types/observable-data-source.type';
import { Resource } from '@framework/resources/resource.model';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpHelperService } from './http-helper.service';
import { HttpResourcesService } from './http-resources.service';
import { HttpRequestOptions } from './interfaces/http-request-options.interface';
import { HttpSubResourceServiceOptions } from './interfaces/http-sub-resource-options.interface';
import { ObservableHelper } from '@framework/observables/observable-helper.class';

export class HttpSubResourcesService<
  T extends Resource<T, IdType>,
  TParent extends Resource<TParent, ParentIdType>,
  IdType extends number | string = number,
  ParentIdType extends number | string = number
> {
  public httpResource: HttpResourcesService<T, IdType>;
  private urlParams: { [param: string]: ObservableDataSource<string | number> };
  private httpHelperService: HttpHelperService;

  constructor(options: HttpSubResourceServiceOptions<T, TParent, ParentIdType>) {
    this.urlParams = options.urlParams;
    this.httpResource = new HttpResourcesService<T, IdType>(options.type, options.injector);
    this.httpHelperService = options.injector.get(HttpHelperService);
  }

  public add<R>(
    parent: ObservableDataSource<TParent>,
    item: ObservableDataSource<R>,
    options: HttpRequestOptions<T> = {}
  ): Observable<T> {
    return this.httpHelperService.prepareChildRequest(parent, options.urlParams, this.urlParams).pipe(
      flatMap(request => {
        options.urlParams = request && request.urlParams;
        return this.httpResource.add<R>(item, options);
      })
    );
  }

  public delete(
    parent: ObservableDataSource<TParent>,
    id: ObservableDataSource<IdType>,
    options: HttpRequestOptions<T> = {}
  ): Observable<void> {
    return this.httpHelperService.prepareChildRequest(parent, options.urlParams, this.urlParams).pipe(
      flatMap(request => {
        if (request && request.urlParams) {
          options.urlParams = request.urlParams;
        }

        return this.httpResource.delete(id, options);
      })
    );
  }

  public get<R extends T | T[]>(
    parent: ObservableDataSource<TParent>,
    config?: {
      id?: ObservableDataSource<IdType>;
      options?: HttpRequestOptions<T>;
    }
  ): Observable<R> {
    if (!config) {
      config = {};
    }
    const id = config.id;
    const options = config.options || {};

    return this.httpHelperService.prepareChildRequest(parent, options.urlParams, this.urlParams).pipe(
      flatMap(request => {
        if (request && request.urlParams) {
          options.urlParams = request.urlParams;
        }

        return this.httpResource.get<R>(id, options);
      })
    );
  }

  public update<R>(
    parent: ObservableDataSource<TParent>,
    item: ObservableDataSource<R>,
    options: HttpRequestOptions<T> = {}
  ): Observable<T> {
    return this.httpHelperService.prepareChildRequest(parent, options.urlParams, this.urlParams).pipe(
      flatMap(request => {
        options.urlParams = request && request.urlParams;
        return this.httpResource.update(item, options);
      })
    );
  }

  public upsert<R>(
    item: ObservableDataSource<R>,
    parent: ObservableDataSource<TParent>,
    options: HttpRequestOptions<T> = {}
  ): Observable<T> {
    return this.getObservableFrom(item).pipe(
      flatMap(object =>
        object && object[this.httpResource.idKey] ? this.update(parent, item, options) : this.add(parent, item, options)
      )
    );
  }

  private getObservableFrom<S>(source: ObservableDataSource<S>): Observable<S> {
    return ObservableHelper.getObservableFrom(source);
  }
}
