import { Endpoint } from './endpoint.model';
import { Version } from './version.model';

export class Environment {
  public name: string;
  public baseUrl?: string;
  public endpoints?: Endpoint[];
  public versions?: Version[]
}
