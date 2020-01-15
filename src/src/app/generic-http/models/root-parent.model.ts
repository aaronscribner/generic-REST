import { Resource } from '../../shared/models/base-classes/resource.model';
import { RootChild } from './root-child.model';

export class RootParent extends Resource<RootParent> {
  public id: number;
  public rootChildren: RootChild[];
}
