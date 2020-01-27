import { SubResource } from '../../shared/models/base-classes/sub-resource.model';
import { Grandchild } from './grandchild.model';
import { Contact } from './contact.model';

export class Child extends SubResource {
  public grandchildren: Grandchild[];
  public contact: Contact;

  public static fromJson(json: any): Child | Child[] {
    if (Array.isArray(json)) {
      return  json.map(Child.fromJson) as Child[];
    }

    const result = new Child();
    const { grandchildren } = json;
    const { contact } = json;
    json.grandchildren = Grandchild.fromJson(grandchildren);
    json.contact = Contact.fromJson(contact);
    Object.assign(result, json);
    return result;
  }
}
