import { SubResource } from '../../shared/models/base-classes/sub-resource.model';

export class Grandchild extends SubResource {
  public name: string;

  public static fromJson(json: any): Grandchild | Grandchild[] {
    if (Array.isArray(json)) {
      return  json.map(Grandchild.fromJson) as Grandchild[];
    }

    const result = new Grandchild();
    Object.assign(result, json);
    return result;
  }
}
