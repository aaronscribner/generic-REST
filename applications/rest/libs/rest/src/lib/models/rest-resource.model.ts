import { Serializable } from '@societal/universal';

export abstract class RestResource<T> extends Serializable<T> {
  public id: string | number;
  public identifierHierarchy: string[] | number[] = [];
}
