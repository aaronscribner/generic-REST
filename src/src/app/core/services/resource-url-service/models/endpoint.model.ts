import { Version } from './version.model';

export class Endpoint {
  resource: string;
  baseUrl: string;
  url: string;
  versions: Version[];
}
