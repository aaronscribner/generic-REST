import { CommonService } from '@framework/core/services/common/common.service';
import { ObservableDataSource } from '@framework/core/types/observable-data-source.type';
import {
  applyTransaction,
  arrayRemove,
  arrayUpsert,
  EntityState,
  EntityStore,
  getIDType,
  QueryEntity
} from '@datorama/akita';
import { Resource } from '@framework/resources/resource.model';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { distinctUntilChanged, first, flatMap, map, tap } from 'rxjs/operators';
import { HttpSubResourceServiceOptions } from '@framework/http/interfaces/http-sub-resource-options.interface';
import { ObservableWrapper } from '@framework/observables/observable-wrapper.class';
import {
  ResourceConfiguration,
  ResourcesConfiguration
} from '@framework/resources/decorators/resources-configuration.container';
import { HttpSubResourcesService } from '../http/http-sub-resources.service';
import { HttpRequestOptions } from '../http/interfaces/http-request-options.interface';
import { ObservableHelper } from '@framework/observables/observable-helper.class';

export class SubResourcesService<
  T extends Resource<T, IdType>,
  TParent extends Resource<TParent, TParentId>,
  IdType extends number | string = number,
  TParentId extends number | string = number
> {
  private idKey: string;
  private readonly httpSubResourceService: HttpSubResourcesService<T, TParent, IdType, TParentId>;
  private readonly propertyName: string;
  private readonly parentType: new (object?: TParent) => TParent;
  private loading = new ObservableWrapper({
    subject: new BehaviorSubject<boolean>(false)
  });

  private type: new (object?: T) => T;
  private resource: ResourceConfiguration;
  private activeItem = new ObservableWrapper({
    subject: new BehaviorSubject<T>(null)
  });
  private activeItemId = new ObservableWrapper({
    subject: new BehaviorSubject<IdType>(null)
  });
  public get active$(): Observable<T> {
    return this.activeItem.data$;
  }

  public get activeId$(): Observable<IdType> {
    return this.activeItemId.data$;
  }

  public get loading$(): Observable<boolean> {
    return this.loading.data$;
  }

  constructor(
    options: HttpSubResourceServiceOptions<T, TParent, TParentId>,
    private store?: EntityStore<EntityState<TParent, TParentId>, TParent, TParentId>,
    private parentQuery?: QueryEntity<EntityState<TParent, TParentId>, TParent, TParentId>
  ) {
    this.type = options.type;
    this.parentType = options.parentType;

    this.resource = ResourcesConfiguration.resources.find(
      r => r.type.name === this.type.name && r.parent === this.parentType.name
    );

    if (!this.resource) {
      throw new Error(`@child not defined for type - ${this.type.name}`);
    }
    this.propertyName = this.resource.options.childName;
    this.idKey = this.resource.options.idKey;

    this.httpSubResourceService = new HttpSubResourcesService<T, TParent, IdType, TParentId>(options);
  }

  public add<R>(
    parent: ObservableDataSource<TParent>,
    item: ObservableDataSource<R>,
    options: HttpRequestOptions<T> = {}
  ): Observable<T> {
    this.setLoading(true);
    return forkJoin([
      this.httpSubResourceService.add(parent, item, options),
      this.getObservableFrom(parent).pipe(first()),
      this.getObservableFrom(item).pipe(first())
    ])
      .pipe(
        tap(
          ([response, parentObj, itemObj]) => {
            if (this.store) {
              this.store.update(parentObj[this.idKey], entity => {
                const properties: Partial<TParent> = {};
                properties[this.propertyName] = this.resource.array
                  ? arrayUpsert(entity[this.propertyName], itemObj[this.idKey], response, this.idKey)
                  : response;
                return properties;
              });
            }
            this.setLoading(false);
          },
          () => this.setLoading(false)
        )
      )
      .pipe(map(([response]) => response));
  }

  public delete(
    parent: ObservableDataSource<TParent>,
    id: ObservableDataSource<IdType>,
    options: HttpRequestOptions<T> = {}
  ): Observable<void> {
    this.setLoading(true);
    return forkJoin([
      this.httpSubResourceService.delete(parent, id, options),
      this.getObservableFrom(parent).pipe(first()),
      this.getObservableFrom(id).pipe(first())
    ])
      .pipe(
        tap(
          ([response, parentObj, idObject]) => {
            if (this.store) {
              if (this.resource.array) {
                this.store.update(parentObj[this.idKey], entity => {
                  const properties: Partial<TParent> = {};
                  properties[this.propertyName] = arrayRemove(entity[this.propertyName], idObject);
                  return properties;
                });
              } else {
                delete parentObj[this.propertyName];
                this.store.replace(idObject, parentObj);
              }
            }
            this.setLoading(false);
          },
          () => this.setLoading(false)
        )
      )
      .pipe(map(([response]) => response));
  }

  public query<R extends T | T[]>(parent: ObservableDataSource<TParent>): Observable<R> {
    if (this.parentQuery) {
      return this.getObservableFrom(parent).pipe(
        flatMap(parentObj => {
          return this.parentQuery
            .selectEntity(parentObj[this.idKey])
            .pipe(map(i => i[this.propertyName] as R))
            .pipe(distinctUntilChanged());
        })
      );
    }
  }

  public get<R>(
    parent: ObservableDataSource<TParent>,
    config?: {
      id?: ObservableDataSource<IdType>;
      options?: HttpRequestOptions<T>;
    }
  ): Observable<R> {
    if (!config) {
      config = {};
    }
    this.setLoading(true);

    const id = config.id;
    const options = config.options || {};

    if (id) {
      return forkJoin([
        this.httpSubResourceService.get<T>(parent, { id, options }),
        this.getObservableFrom(parent).pipe(first()),
        this.getObservableFrom(id).pipe(first())
      ])
        .pipe(first())
        .pipe(
          tap(
            ([response, parentObj, idObject]) => {
              if (this.store) {
                this.store.update(parentObj[this.idKey], entity => {
                  const properties: Partial<TParent> = {};
                  properties[this.propertyName] = this.resource.array
                    ? arrayUpsert(entity[this.propertyName], idObject, response, this.idKey)
                    : response;
                  return properties;
                });
              }
              this.setLoading(false);
            },
            () => this.setLoading(false)
          )
        )
        .pipe(map(([response]) => (response as unknown) as R));
    } else {
      return forkJoin([
        this.httpSubResourceService.get<T[]>(parent, { options }),
        this.getObservableFrom(parent).pipe(first())
      ])
        .pipe(first())
        .pipe(
          tap(([response, parentObj]) => {
            if (this.store) {
              applyTransaction(() => {
                response.forEach(item => {
                  this.store.update(parentObj[this.idKey], entity => {
                    const properties: Partial<TParent> = {};
                    properties[this.propertyName] = this.resource.array
                      ? arrayUpsert(entity[this.propertyName], item[this.idKey], item, this.idKey)
                      : response;
                    return properties;
                  });
                });
              });
            }
          })
        )
        .pipe(map(([response]) => (response as unknown) as R));
    }
  }

  public setActive<R>(parent: TParent, id?: getIDType<EntityState<T, IdType>>): Observable<void> {
    if (id) {
      return this.query(parent).pipe(
        map(item => {
          if (Array.isArray(item)) {
            this.activeItem.next(item.find(i => i[this.idKey] === id));
          } else {
            this.activeItem.next(item as T);
          }
          this.activeItemId.next(id);
        })
      );
    } else {
      this.store.setActive(null);
      return of(null);
    }
  }

  public setLoading(loading: boolean): void {
    this.loading.next(loading);
  }

  public update<R>(
    parent: ObservableDataSource<TParent>,
    item: ObservableDataSource<R>,
    options: HttpRequestOptions<T> = {}
  ): Observable<T> {
    this.setLoading(true);
    return forkJoin([
      this.httpSubResourceService.update(parent, item, options),
      this.getObservableFrom(parent).pipe(first()),
      this.getObservableFrom(item).pipe(first())
    ])
      .pipe(
        tap(
          ([response, parentObj, itemObj]) => {
            if (this.store) {
              this.store.update(parentObj[this.idKey], entity => {
                const properties: Partial<TParent> = {};
                properties[this.propertyName] = this.resource.array
                  ? arrayUpsert(entity[this.propertyName], itemObj[this.idKey], response, this.idKey)
                  : response;
                return properties;
              });
            }
            this.setLoading(false);
          },
          () => this.setLoading(false)
        )
      )
      .pipe(map(([response]) => response));
  }

  public upsert<R>(
    parent: ObservableDataSource<TParent>,
    item: ObservableDataSource<R>,
    options: HttpRequestOptions<T> = {}
  ): Observable<T> {
    return this.getObservableFrom(item).pipe(
      flatMap(object =>
        object && object[this.idKey] ? this.update(parent, item, options) : this.add(parent, item, options)
      )
    );
  }

  private getObservableFrom<S>(source: ObservableDataSource<S>): Observable<S> {
    return ObservableHelper.getObservableFrom(source);
  }
}
