import { Serializable } from './serializable.model';

export abstract class Resource<T> extends Serializable<T> {
  public id: number;

  constructor(object?: T) {
    super(object);
  }
}
