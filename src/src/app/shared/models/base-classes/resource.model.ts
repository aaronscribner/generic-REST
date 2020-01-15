import { Serializable } from './base-classes/serializable.model';

export abstract class Resource<T> extends Serializable<T> {
  public abstract id: number;

  constructor(object?: T) {
    super(object);
  }
}
