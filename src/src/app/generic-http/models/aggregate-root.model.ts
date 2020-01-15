
import { Resource } from '../../shared/models/base-classes/resource.model';
import { RootParent } from './root-parent.model';

export class AggregateRoot extends Resource<AggregateRoot> {
  public id: number;
  public rootParents: RootParent[];
}
