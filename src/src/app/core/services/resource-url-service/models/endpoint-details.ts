export class EndpointDetails {
  public endpoint: string;
  public version: string;

  constructor(url: string, version = '') {
    this.endpoint = url;
    this.version = version;
  }
}
