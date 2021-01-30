import { environment } from '../../../../environments/environment';
import { HttpVerb } from './enums/http-verbs.enum';
import { Environment } from './models/environment.model';
import { ResourceConfig } from './models/resource-config.model';
import { EndpointDetails } from './models/endpoint-details';
import { Injectable } from '@angular/core';
import * as EndpointsFile from '@assets/config/resource-endpoints.json';
import { Endpoint } from '@core/services/resource-url/models/endpoint.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceUrlService {
  // tslint:disable-next-line: no-any
  private resourceConfig = (EndpointsFile as any).default as ResourceConfig;
  private resourceDefaultVersionName = 'default';

  // Remarks: For unit testing ONLY
  public set config(config: string) {
    this.resourceConfig = JSON.parse(config);
  }

  public resourceUrl(resource: string, verb: HttpVerb): EndpointDetails {
    try {
      const runningEnvironment = this.resourceConfig.environments.find(
        x => x.name === environment.resourceEnvironment
      ) as Environment;

      let endpointConfig: Endpoint;
      if (runningEnvironment.endpoints) {
        endpointConfig = runningEnvironment.endpoints.find(x => x.resource === resource) ||
          this.resourceConfig.endpoints.find(x => x.resource === resource);
      }
      else {
        endpointConfig = this.resourceConfig.endpoints.find(x => x.resource === resource);
      }

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
