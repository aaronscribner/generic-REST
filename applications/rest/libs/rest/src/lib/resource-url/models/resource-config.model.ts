import { Endpoint } from './endpoint.model';
import { Environment } from './environment.model';

export class ResourceConfig {
  public environments: Environment[];
  public endpoints: Endpoint[];
}
