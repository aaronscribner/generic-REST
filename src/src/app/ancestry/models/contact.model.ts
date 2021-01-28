import { Resource } from '@shared/models/base-classes/resource.model';

export class Contact extends Resource {
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
