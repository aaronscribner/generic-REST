import { Endpoint } from './endpoint.model';
import { Environment } from './environment.model';

export class RestResourceConfig {
  environments: Environment[];
  endpoints: Endpoint[];
}
