import { Parent } from './parent.model';
import { Resource } from '@rest/rest';

export class Ancestry extends Resource<Ancestry> {
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
    return result;
  }
}
