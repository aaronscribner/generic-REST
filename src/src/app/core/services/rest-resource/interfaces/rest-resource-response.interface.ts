import { IRestResourceError } from './resource-resource-error.interface';

export interface IRestResourceResponse<T> {
  data: T;
  error: IRestResourceError;
}
