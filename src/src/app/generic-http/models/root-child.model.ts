import { Resource } from '../../shared/models/base-classes/resource.model';
import { RootGrandchild } from './root-grandchild.model';

export class RootChild extends Resource<RootChild> {
  public id: number;
  // public rootGrandchildren: RootGrandchild[];
}
