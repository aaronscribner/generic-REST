import { Resource } from './base-classes/resource.model';
import { RootChild } from './root-child.model';

export class RootParent extends Resource<RootParent> {
  public id: string;
  public rootChild: RootChild[];

  constructor(id: string, rootChild: RootChild[]) {
    super();
    this.id = id;
    this.rootChild = rootChild;
  }
}
