import { Resource } from './base-classes/resource.model';
import { RootParent } from './root-parent.model';

export class AggregateRoot extends Resource<AggregateRoot> {
  public id: number;
  public rootParent: RootParent[];

  constructor(id: number, rootParent: RootParent[]) {
    super();
    this.id = id;
    this.rootParent = rootParent;
  }
}
