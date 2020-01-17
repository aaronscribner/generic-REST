import { SubResource } from '../../shared/models/base-classes/sub-resource.model';
import { Child } from './child.model';

export class Parent extends SubResource {
  public children: Child[];

  public static fromJson(json: any): Parent | Parent[] {
    if (Array.isArray(json)) {
      return json.map(Parent.fromJson) as Parent[];
    }

    const result = new Parent();
    const { children } = json;
    json.children = Child.fromJson(children);
    Object.assign(result, json);
    // result.children.forEach(x => x.parentId = [result.id]);
    return result;
  }
}
