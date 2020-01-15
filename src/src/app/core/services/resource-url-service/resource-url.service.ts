import { environment } from '../../../../environments/environment';
import { HttpVerb } from './enums/http-verbs.enum';
import { Endpoint } from './models/endpoint.model';
import { Environment } from './models/environment.model';
import { ResourceConfig } from './models/resource-config.model';
import { EndpointDetails } from './models/endpoint-details';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResourceUrlService {
  private resourceConfig: ResourceConfig = require('../../../../assets/config/resource-endpoints.json');
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
      const endpointConfig = runningEnvironment.endpoints.find(
        x => x.resource === resource
      ) as Endpoint;
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
