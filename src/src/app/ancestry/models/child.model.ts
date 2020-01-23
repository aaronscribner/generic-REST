import { SubResource } from '../../shared/models/base-classes/sub-resource.model';
import { Grandchild } from './grandchild.model';

export class Child extends SubResource {
  public grandchildren: Grandchild[];
  public name: string;

  public static fromJson(json: any): Child | Child[] {
    if (Array.isArray(json)) {
      return  json.map(Child.fromJson) as Child[];
    }

    const result = new Child();
    const { grandchildren } = json;
    json.grandchildren = Grandchild.fromJson(grandchildren);
    Object.assign(result, json);
    return result;
  }
}
