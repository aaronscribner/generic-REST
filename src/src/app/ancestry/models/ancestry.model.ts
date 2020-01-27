
import { Resource } from '../../shared/models/base-classes/resource.model';
import { Parent } from './parent.model';

export class Ancestry extends Resource {
  public name: string;
  public parents: Parent[];

  public static fromJson(json: any): Ancestry | Ancestry[] {
    if (Array.isArray(json)) {
      return  json.map(Ancestry.fromJson) as Ancestry[];
    }

    const result = new Ancestry();
    const { parents } = json;
    json.parents = Parent.fromJson(parents);
    Object.assign(result, json);
    console.table(result);
    return result;
  }
}
