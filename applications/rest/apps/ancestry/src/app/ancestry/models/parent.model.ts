import { Child } from './child.model';
import { Contact } from './contact.model';
import { Resource } from '@shared/models/base-classes/resource.model';

export class Parent extends Resource {
  public children: Child[];
  public contact: Contact;

  public static fromJson(json: any): Parent | Parent[] {
    if (Array.isArray(json)) {
      return json.map(Parent.fromJson) as Parent[];
    }

    const result = new Parent();
    const { children } = json;
    const { contact } = json;
    json.children = Child.fromJson(children);
    json.contact = Contact.fromJson(contact);

    Object.assign(result, json);
    return result;
  }
}
