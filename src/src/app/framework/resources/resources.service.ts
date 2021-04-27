import { Injector } from '@angular/core';
import { ObservableDataSource } from './core/types/observable-data-source.type';
import { HttpSubResourceServiceOptionsBase } from '@framework/http/interfaces/http-sub-resource-options-base.interface';
import { HttpSubResourceServiceOptions } from '@framework/http/interfaces/http-sub-resource-options.interface';
import { ObservableHelper } from '@framework/observables/observable-helper.class';
import {
  ResourceConfiguration,
  ResourcesConfiguration,
} from '@framework/resources/decorators/resources-configuration.container';
import { Resource } from '@framework/resources/resource.model';
import { AkitaFilter, AkitaFiltersPlugin } from 'akita-filters-plugin';
import { Observable } from 'rxjs';
import { first, flatMap, map, tap } from 'rxjs/operators';
import { HttpResourcesService } from '../http/http-resources.service';
import { HttpRequestOptions } from '../http/interfaces/http-request-options.interface';
import { ResourceGetConfig } from './interfaces/resources-get-config.interface';
import { SubResourcesService } from './sub-resources.service';

export class ResourcesService<T extends Resource<T, IdType>, IdType extends number | string = number | string> {
  public get filter(): AkitaFiltersPlugin<EntityState<T, IdType>> {
    if (!this._filter && this.query) {
      this._filter = new AkitaFiltersPlugin<EntityState<T, IdType>>(this.query);
    }
    return this._filter;
  }
  public get filtered$(): Observable<T[]> {
    if (!this._filtered$) {
      if (!this._filter && this.query) {
        this._filter = new AkitaFiltersPlugin<EntityState<T, IdType>>(this.query);
      }
      this._filtered$ = this._filter
        .selectAllByFilters()
        .pipe(map((result) => (Array.isArray(result) ? result : Object.values(result))));
    }
    return this._filtered$;
  }
  public query: QueryEntity<EntityState<T, IdType>, T, IdType>;

  public active$: Observable<T>;
  public activeId$: Observable<IdType>;
  public loading$: Observable<boolean>;
  public all$: Observable<T[]>;
  public onUpdate: (object?: T) => void;
  public onAdd: (object?: T) => void;
  public onDelete: (id?: IdType) => void;
  public onChange: (object?: T) => void;
  public onDataLoad?: (object?: T | T[]) => void;

  protected store: EntityStore<EntityState<T, IdType>, T, IdType>;

  private idKey: string;
  private resource: ResourceConfiguration;
  private httpResourceService: HttpResourcesService<T, IdType>;
  private skipGetExisting: boolean;

  // tslint:disable: variable-name
  private _filter: AkitaFiltersPlugin<EntityState<T, IdType>>;
  private _filtered$: Observable<T[]>;
  // tslint:enable: variable-name

  constructor(
    private type: new (object?: T) => T,
    private injector: Injector,
    options?: {
      urlParams?: {
        [param: string]: ObservableDataSource<string | number>;
      };
      onUpdate?: (object?: T) => void;
      onAdd?: (object?: T) => void;
      onDelete?: (id?: IdType) => void;
      onChange?: (object?: T) => void;
      onDataLoad?: (object?: T | T[]) => void;
    }
  ) {
    if (!options) {
      options = {};
    }
    this.onUpdate = options.onUpdate || options.onChange;
    this.onAdd = options.onAdd || options.onChange;
    this.onDelete = options.onDelete || options.onChange ? () => options.onChange() : undefined;
    this.onDataLoad = options.onDataLoad;

    this.resource = ResourcesConfiguration.resources.find((r) => r.type.name === this.type.name && !r.parent);
    if (!this.resource.options) {
      this.resource.options = {};
    }
    this.injector = injector;
    this.idKey = this.resource.options.idKey || 'id';
    this.skipGetExisting = !!this.resource.options.skipGetExisting;

    // TODO: FRAMEWORK: CACHE - ttl goes here
    this.store = new EntityStore<EntityState<T, IdType>>(
      {},
      {
        name: this.resource.name,
        idKey: this.idKey,
      }
    );
    this.store.setLoading(true);
    this.query = new QueryEntity(this.store);
    if (this.query) {
      this.active$ = this.query && (this.query.selectActive() as Observable<T>);
      this.activeId$ = this.query && (this.query.selectActiveId() as Observable<IdType>);
      this.loading$ = this.query.selectLoading();
      this.all$ = this.query.selectAll();
    }

    this.httpResourceService = new HttpResourcesService<T, IdType>(type, this.injector, options.urlParams);
  }

  public get<R extends T | T[]>(config?: ResourceGetConfig<T, IdType>): Observable<R> {
    if (!config) {
      config = {};
    }

    const options = config.options;
    const id = config.id;
    this.setLoading(true);
    config.reset = config.reset || (!config.id && this.resource.options.autoReset);
    if (typeof config.skipExisting !== 'boolean') {
      config.skipExisting = this.skipGetExisting;
    }

    let observable: Observable<R>;
    let skipStore = false;
    const request = this.httpResourceService.get<R>(id, options);
    if (id) {
      if (config.skipExisting) {
        observable = this.getObservableFrom(id).pipe(
          flatMap((idObject) => {
            if (this.query.hasEntity(idObject)) {
              skipStore = true;
              return this.query.selectEntity(idObject);
            } else {
              if (config.reset) {
                this.clearState();
              }
              return request;
            }
          })
        ) as Observable<R>;
      } else {
        observable = request;
      }
    } else {
      if (config.skipExisting && this.query.hasEntity()) {
        skipStore = true;
        observable = this.all$ as Observable<R>;
      } else {
        if (config.reset) {
          this.clearState();
        }
        observable = request;
      }
    }
    return observable.pipe(
      tap(
        (result) => {
          applyTransaction(() => {
            if (!skipStore) {
              const valid = Array.isArray(result)
                ? result && result[0] && result[0][this.idKey]
                : result && result[this.idKey];
              if (!valid) {
                return;
              }
              if (Array.isArray(result)) {
                if (config.setActive) {
                  this.setActive(result[0][this.idKey]);
                }
                this.store.upsertMany(result, { baseClass: this.type });
              } else {
                if (config.setActive) {
                  this.setActive(result[this.idKey]);
                }
                this.store.upsert(result[this.idKey], result, {
                  baseClass: this.type,
                });
              }
            }
            this.setLoading(false);
          });
          if (typeof this.onDataLoad === 'function') {
            this.onDataLoad(result);
          }
        },
        () => this.setLoading(false)
      )
    );
  }

  public load(config?: ResourceGetConfig<T, IdType>): void {
    this.get(config).pipe(first()).subscribe();
  }

  public add(entity: ObservableDataSource<T>, options?: HttpRequestOptions<T>): Observable<T> {
    if (!options) {
      options = {};
    }
    this.setLoading(true);

    return this.httpResourceService.add(entity, options).pipe(
      tap(
        (result) => {
          applyTransaction(() => {
            this.setLoading(false);
            this.store.add(result);
          });
          if (typeof this.onAdd === 'function') {
            this.onAdd(result);
          }
        },
        () => this.setLoading(false)
      )
    );
  }

  public update(entity: Partial<T>, options?: HttpRequestOptions<T>): Observable<T> {
    if (!options) {
      options = {};
    }
    this.setLoading(true);

    return this.httpResourceService.update(entity, options).pipe(
      tap(
        (result) => {
          applyTransaction(() => {
            this.setLoading(false);
            this.store.update(entity[this.idKey], result);
          });
          if (typeof this.onUpdate === 'function') {
            this.onUpdate(result);
          }
        },
        () => this.setLoading(false)
      )
    );
  }
  public updateMultiple(entity: ObservableDataSource<T>, options?: HttpRequestOptions<T>): Observable<T> {
    if (!options) {
      options = {};
    }
    this.setLoading(true);

    return this.httpResourceService.update(entity, options).pipe(
      tap(
        (result) => {
          applyTransaction(() => {
            this.setLoading(false);
            this.store.update(entity[this.idKey], result);
          });
          if (typeof this.onUpdate === 'function') {
            this.onUpdate(result);
          }
        },
        () => this.setLoading(false)
      )
    );
  }
  public upsert(item: ObservableDataSource<T>, options?: HttpRequestOptions<T>): Observable<T> {
    return this.getObservableFrom(item).pipe(
      flatMap((object) => (object[this.idKey] ? this.update(object, options) : this.add(object, options)))
    );
  }

  public delete(
    id: ObservableDataSource<getIDType<EntityState<T, IdType>>>,
    options?: HttpRequestOptions<T>
  ): Observable<void> {
    if (!options) {
      options = {};
    }

    this.setLoading(true);

    return this.getObservableFrom(id)
      .pipe(first())
      .pipe(
        flatMap((idObject) => {
          return this.httpResourceService.delete(id, options).pipe(
            tap(
              () => {
                applyTransaction(() => {
                  this.store.remove(idObject);
                  this.setLoading(false);
                });
                if (typeof this.onDelete === 'function') {
                  this.onDelete(idObject);
                }
              },
              () => this.setLoading(false)
            )
          );
        })
      );
  }

  public clearState(): void {
    if (!this.store) {
      throw new Error('method only enabled if resource has state.');
    }
    this.store.set([]);
  }

  public setActive(id?: getIDType<EntityState<T, IdType>>): void {
    if (!this.store) {
      throw new Error('method only enabled if resource has state.');
    }
    if (id) {
      this.store.setActive(id);
    } else {
      this.store.setActive(null);
    }
  }

  public setFilter(
    filter: Partial<AkitaFilter<EntityState<T, IdType>>>,
    options: { allowEmtpy: boolean } = { allowEmtpy: false }
  ): void {
    if (filter.value || (options && options.allowEmtpy)) {
      this.filter.setFilter(filter);
    } else if (filter.id) {
      this.filter.removeFilter(filter.id);
    }
  }

  public setLoading(loading: boolean): void {
    this.store.setLoading(loading);
  }

  protected newSubResource<TChild extends Resource<TChild, TChildId>, TChildId extends number | string = number>(
    type: new (object?: TChild) => TChild,
    options: Partial<HttpSubResourceServiceOptionsBase<TChild, T, IdType>> = {}
  ): SubResourcesService<TChild, T, TChildId, IdType> {
    options.injector = this.injector;
    if (!options.urlParams) {
      options.urlParams = {};
    }
    options.urlParams[this.idKey] = options.urlParams[this.idKey] || this.idKey;

    options.parentType = this.type;
    options.type = type;

    return new SubResourcesService<TChild, T, TChildId, IdType>(
      options as HttpSubResourceServiceOptions<TChild, T, IdType>,
      this.store,
      this.query
    );
  }

  protected getObservableFrom<S>(source: ObservableDataSource<S>): Observable<S> {
    return ObservableHelper.getObservableFrom(source);
  }
}
