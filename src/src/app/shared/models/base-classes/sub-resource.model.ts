import { Resource } from './resource.model';
import { Serializable } from './serializable.model';

export abstract class SubResource extends Resource {
  public identifierHierarchy: any = [];
}
