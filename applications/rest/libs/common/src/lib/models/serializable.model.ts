export abstract class Serializable<T> {
  protected constructor(object?: Partial<T> | string) {
    if (typeof object === 'object') {
      this.fromJson(object as T);
    }
  }
  public fromJson?(json: T | T[] | string): T | T[] {
    if (typeof json === 'string') {
      json = JSON.parse(json) as T | T[];
    }
    if (Array.isArray(json)) {
      return json.map((i) => this.fromJson(i) as T);
    } else {
      return Object.assign(this, json);
    }
  }
  public toJson?(object?: Partial<T> | Partial<T>[]): string {
    return JSON.stringify(object || this);
  }
}
