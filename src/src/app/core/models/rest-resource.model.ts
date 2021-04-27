import { Serializable } from './serializable.model';

export abstract class RestResource<T, IdType extends number | string = number | string> extends Serializable<T> {
  public abstract get id(): IdType;
  constructor(object?: Partial<T>) {
    super(object);
  }

  public hasSameId?(item: RestResource<T>): boolean {
    return item && item.id === this.id;
  }
}
