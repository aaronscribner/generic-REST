import { Endpoint } from './endpoint.model';
import { Version } from './version.model';

export class Context {
  public name: string;
  public domain: string;
  public versions?: Version[];
  public endpoints: Endpoint[];
}
