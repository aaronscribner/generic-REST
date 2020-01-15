import { Resource } from './base-classes/resource.model';

export class RootGrandchild extends Resource<RootGrandchild> {
  public id: number;

  constructor(id: number) {
    super();
    this.id = id;
  }
}
