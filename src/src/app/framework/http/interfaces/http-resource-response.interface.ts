import { HttpResourceError } from './http-resource-error.interface';

export interface HttpResourceResponse<T> {
  data: T;
  error: HttpResourceError;
}
