import { ObservableDataSource } from '@framework/core/types/observable-data-source.type';
import { HttpRequestOptions } from './http-request-options.interface';
import { EntityState, getIDType } from '@datorama/akita';

export interface ResourceGetConfig<T, IdType = number> {
  id?: ObservableDataSource<getIDType<EntityState<T, IdType>>>;
  options?: HttpRequestOptions<T>;
  reset?: boolean;
  skipExisting?: boolean;
  setActive?: boolean;
}
