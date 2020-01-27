import { SubResource } from '../../shared/models/base-classes/sub-resource.model';
import { Contact } from './contact.model';

export class Grandchild extends SubResource {
  public contact: Contact;

  public static fromJson(json: any): Grandchild | Grandchild[] {
    if (Array.isArray(json)) {
      return  json.map(Grandchild.fromJson) as Grandchild[];
    }

    const result = new Grandchild();
    const { contact } = json;
    json.contact = Contact.fromJson(contact);
    Object.assign(result, json);
    return result;
  }
}
