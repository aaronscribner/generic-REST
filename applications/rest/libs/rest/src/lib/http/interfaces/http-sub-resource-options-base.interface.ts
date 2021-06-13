import { Injector } from '@angular/core';
import { Resource } from '@framework/resources/resource.model';
import { ObservableDataSource } from '@framework/core/types/observable-data-source.type';

export interface ObservableUrlParams {
  [param: string]: ObservableDataSource<string | number>;
}
export interface HttpSubResourceServiceOptionsBase<
  T,
  TParent extends Resource<TParent, IdType>,
  IdType extends number | string = number
> {
  parentType: new (object?: TParent) => TParent;
  type: new (object?: T) => T;
  injector?: Injector;
  urlParams?: { [param: string]: ObservableDataSource<string | number> };
}
