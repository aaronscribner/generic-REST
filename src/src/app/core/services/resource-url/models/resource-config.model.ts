import { Environment } from './environment.model';
import { Endpoint } from '@core/services/resource-url/models/endpoint.model';

export class ResourceConfig {
  environments: Environment[];
  endpoints: Endpoint[];
}
