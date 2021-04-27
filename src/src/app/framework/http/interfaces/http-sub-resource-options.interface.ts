import { Injector } from '@angular/core';
import { HttpSubResourceServiceOptionsBase } from '@framework/http/interfaces/http-sub-resource-options-base.interface';
import { Resource } from '@framework/resources/resource.model';

export interface HttpSubResourceServiceOptions<
  T,
  TParent extends Resource<TParent, IdType>,
  IdType extends number | string = number
> extends HttpSubResourceServiceOptionsBase<T, TParent, IdType> {
  injector: Injector;
}
