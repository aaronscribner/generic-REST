import { IHttpResourceError } from './http-resource-error.interface';

export interface IHttpResourceResponse<T> {
  data: T;
  error: IHttpResourceError;
}
