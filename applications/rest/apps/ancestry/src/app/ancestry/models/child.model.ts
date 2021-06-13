import { Grandchild } from './grandchild.model';
import { Contact } from './contact.model';
import { Resource } from '@shared/models/base-classes/resource.model';

export class Child extends Resource {
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
