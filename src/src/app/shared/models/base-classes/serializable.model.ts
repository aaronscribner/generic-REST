export abstract class Serializable<T> {
  public constructor(object?: T | string) {
    if (object) {
      this.fromJson(object);
    }
  }
  public fromJson(json: T | T[] | string): T | T[] {
    if (typeof json === 'string') {
      json = JSON.parse(json) as T | T[];
    }
    if (Array.isArray(json)) {
      return json.map(i => this.fromJson(i) as T);
    } else {
      return Object.assign(this, json);
    }
  }
  public toJson(object?: T | T[]): string {
    return JSON.stringify(object || this);
  }
}
