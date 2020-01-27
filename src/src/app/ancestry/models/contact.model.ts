import { SubResource } from '../../shared/models/base-classes/sub-resource.model';

export class Contact extends SubResource {
  public firstName: string;
  public lastName: string;

  public static fromJson(json: any): Contact | Contact[] {
    if (Array.isArray(json)) {
      return  json.map(Contact.fromJson) as Contact[];
    }

    const result = new Contact();
    Object.assign(result, json);
    return result;
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public set name(fullName: string) {
    const names = fullName.split(' ');
    this.firstName = names[0];
    this.lastName = names[1];
  }
}
