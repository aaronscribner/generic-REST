import { Serializable } from '@rest/common';

export abstract class Resource<T, IdType extends number | string = number | string> extends Serializable<T> {
  public abstract get id(): IdType;
  constructor(object?: Partial<T>) {
    super(object);
  }

  public hasSameId?(item: Resource<T>): boolean {
    return item && item.id === this.id;
  }
}
