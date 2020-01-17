import { Serializable } from './serializable.model';

export abstract class SubResource {
  public id: number | string;
  public identifierHierarchy: any = [];
}
