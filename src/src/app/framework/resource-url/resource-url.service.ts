import { Injectable } from '@angular/core';
import { HttpVerb } from './enums/http-verbs.enum';
import { EndpointDetails } from './models/endpoint-details';
import { Endpoint } from './models/endpoint.model';
import { Environment } from './models/environment.model';
import { ResourceConfig } from './models/resource-config.model';
import * as EndpointsFile from '@assets/config/resource-endpoints.json';

@Injectable({
  providedIn: 'root',
})
export class ResourceUrlService {
  // TODO: we might want to add this config file retrieval to be somewhere else, so we can easily change the config to ts if we want
  private resourceConfig = (EndpointsFile as any).default as ResourceConfig;

  private resourceDefaultVersionName = 'default';

  // Remarks: For unit testing ONLY
  public set config(config: string) {
    this.resourceConfig = JSON.parse(config);
  }

  // TODO: Pass in the environment config from the application.
  public getEndpoint(resource): Endpoint {
    const runningEnvironment = this.resourceConfig.environments.find(
      (x) => x.name === environment.resourceEnvironment
    ) as Environment;

    return this.resourceConfig.endpoints.find((x) => x.resource === resource) as Endpoint;
  }

  public resourceUrl(resource: string, verb: HttpVerb, params?: { [param: string]: string | number }): EndpointDetails {
    try {
      const runningEnvironment = this.resourceConfig.environments.find(
        (x) => x.name === environment.resourceEnvironment
      ) as Environment;

      let endpointConfig = this.resourceConfig.endpoints.find((x) => x.resource === resource) as Endpoint;

      if (runningEnvironment.endpoints) {
        const envEndpointConfig = runningEnvironment.endpoints.find((x) => x.resource === resource) as Endpoint;
        if (envEndpointConfig) {
          endpointConfig = envEndpointConfig;
        }
      }

      const baseUrl = endpointConfig.baseUrl || runningEnvironment.baseUrl;
      const versions = endpointConfig.versions || runningEnvironment.versions;
      let url = endpointConfig.url;

      const version =
        versions.find((x) => x.verb.toLowerCase() === verb.toLowerCase()) ||
        versions.find((x) => x.verb.toLowerCase() === this.resourceDefaultVersionName);

      if (params) {
        for (const key of Object.keys(params)) {
          url = url.replace(':' + key.replace(':', ''), `${params[key]}`);
        }
      }

      if (url.includes(':')) {
        const missing = url.split('/').filter((part) => part && part.includes(':'));
        throw new Error(
          `Url parameters mismatch. \n Missing: ${missing.join(', ')} \n Sent: ${JSON.stringify(params)}`
        );
      }
      return new EndpointDetails(`${baseUrl}/${url}`, version.value);
    } catch (exception) {
      throw new Error(`Configuration mismatch: ${resource} ${verb} \n${params}`);
    }
  }
}
