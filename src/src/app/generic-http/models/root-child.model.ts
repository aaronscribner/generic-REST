import { Resource } from './base-classes/resource.model';
import { RootGrandchild } from './root-grandchild.model';

export class RootChild extends Resource<RootChild> {
  public id: number;
  public rootGrandchild: RootGrandchild[];

  constructor(id: number, rootGrandchild: RootGrandchild[]) {
    super();
    this.id = id;
    this.rootGrandchild = rootGrandchild;
  }
}
