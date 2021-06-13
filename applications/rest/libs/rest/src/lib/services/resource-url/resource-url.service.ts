import { RestVerb } from '../../enums/http-verbs.enum';
import { Environment } from './models/environment.model';
import { RestResourceConfig } from './models/rest-resource-config.model';
import { EndpointDetails } from './models/endpoint-details';
import { Injectable } from '@angular/core';
import { RestModule } from '@societal/rest';
import { Endpoint } from './models/endpoint.model';

@Injectable({
  providedIn: RestModule
})
export class ResourceUrlService {
  private endpoints: Endpoint[] = [];
  private environmentEndpoints: Endpoint[] = [];
  private resourceDefaultVersionName = 'default';

  /**
   * Loads the endpoints from the configuration and any
   * environment-specific overrides.
   * @param config
   * @param environment
   */
  public load(config: string, environment: string = ''): void {
    try {
      const resourceConfig = JSON.parse(config) as RestResourceConfig;
      const environmentConfig = resourceConfig.environments.find(x => x.name === environment);

      this.endpoints = resourceConfig.endpoints;
      this.environmentEndpoints = environmentConfig.endpoints;

      if (!environmentConfig && environment !== '') {
        throw new Error('Invalid environment specified');
      }
    }
    catch(error) {
      throw new Error(`Failed loading resource URL config: ${error}`);
    }
  }

  public resourceUrl(resource: string, verb: RestVerb): EndpointDetails {
    if (this.endpoints?.length === 0 && this.environmentEndpoints?.length === 0) {
      throw new Error('Resource URL Config must be loaded');
    }

    try {
      const endpointConfig: Endpoint =
        this.environmentEndpoints.find(x => x.resource === resource) ||
        this.endpoints.find(x => x.resource === resource);

      const version =
        endpointConfig.versions.find(
          x => x.verb.toLowerCase() === verb.toLowerCase()
        ) ||
        endpointConfig.versions.find(
          x => x.verb.toLowerCase() === this.resourceDefaultVersionName
        );

      return new EndpointDetails(
        `${endpointConfig.baseUrl}/${endpointConfig.url}`,
        version.value
      );
    } catch (exception) {
      // TODO: Log a configuration mismatch error.
      return undefined;
    }
  }
}
