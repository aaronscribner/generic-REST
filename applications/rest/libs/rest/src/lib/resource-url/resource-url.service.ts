import { Injectable } from '@angular/core';
import { HttpVerb } from './enums/http-verbs.enum';
import { EndpointDetails } from './models/endpoint-details';
import { Endpoint } from './models/endpoint.model';
import { Environment } from './models/environment.model';
import { ResourceConfig } from './models/resource-config.model';
import * as EndpointsFile from '@assets/config/resource-endpoints.json';
import { environment } from '../../../environments/environment';
import { Context } from './models/context.model';

@Injectable({
  providedIn: 'root',
})
export class ResourceUrlService {
  private resourceConfig = (EndpointsFile as any).default as ResourceConfig;
  private resourceDefaultVersionName = 'default';
  private runningEnvironment: Environment;
  private endpointConfigs: Endpoint[];

  constructor() {
    this.runningEnvironment = this.resourceConfig.environments.find(
      (x) => x.name === environment.resourceEnvironment.name
    );

    if (environment.resourceEnvironment.inMemory) {
      this.loadConfig();
    }
  }

  /**
   * For unit testing ONLY
   */
  public set config(config: string) {
    this.resourceConfig = JSON.parse(config);
  }

  public getEndpoint(resource): Endpoint {
    return this.resourceConfig.endpoints.find((x) => x.resource === resource) as Endpoint;
  }

  // public resourceUrl(resource: string, verb: HttpVerb, params?: { [param: string]: string | number }): EndpointDetails {
  //   try {
  //     let endpointConfig = this.resourceConfig.endpoints.find((x) => x.resource === resource) as Endpoint;
  //
  //     if (this.runningEnvironment.endpoints) {
  //       const envEndpointConfig = this.runningEnvironment.endpoints.find(
  //         (x) => x.resource === resource && x.) as Endpoint;
  //       if (envEndpointConfig) {
  //         endpointConfig = envEndpointConfig;
  //       }
  //     }
  //
  //     const baseUrl = endpointConfig.baseUrl || this.runningEnvironment.baseUrl;
  //     const versions = endpointConfig.versions || this.runningEnvironment.versions;
  //     let url = endpointConfig.url;
  //
  //     const version =
  //       versions.find((x) => x.verb.toLowerCase() === verb.toLowerCase()) ||
  //       versions.find((x) => x.verb.toLowerCase() === this.resourceDefaultVersionName);
  //
  //     if (params) {
  //       for (const key of Object.keys(params)) {
  //         url = url.replace(':' + key.replace(':', ''), `${params[key]}`);
  //       }
  //     }
  //
  //     if (url.includes(':')) {
  //       const missing = url.split('/').filter((part) => part && part.includes(':'));
  //       throw new Error(
  //         `Url parameters mismatch. \n Missing: ${missing.join(', ')} \n Sent: ${JSON.stringify(params)}`
  //       );
  //     }
  //
  //     return new EndpointDetails(`${baseUrl}/${url}`, version.value);
  //   } catch (exception) {
  //     throw new Error(`Configuration mismatch: ${resource} ${verb} \n${params} \n Inner Exception ${exception}`);
  //   }
  // }

  private loadConfig(): void {
    const baseEnvironmentDomain = this.runningEnvironment.domain;
    const baseEnvironmentVersions = this.runningEnvironment.versions;
    const configLoadErrors: string[] = [];

    this.endpointConfigs = [];
    this.runningEnvironment.contexts.forEach((context: Context) => {
      let isContextError = false;

      if (!context.domain && !baseEnvironmentDomain) {
        configLoadErrors.push(
          `Context ${context.name} must set the domain if no domain is set for the Environment`);
        isContextError = true;
      }

      if (isContextError) {
        continue;
      }

      context.endpoints.forEach((endpoint: Endpoint) => {
        // TODO: test file parsing of json if this is ctor only params.
        let isEndpointError = false;

        if (endpoint.versions.length === 0
          && context.versions.length === 0
          && baseEnvironmentVersions.length === 0) {
          configLoadErrors.push(
            `No versions are defined for the Endpoint, Context or Environment`);
          isEndpointError = true;
        }

        if (!endpoint.resource) {
          configLoadErrors.push(`Resource is undefined for endpoint in Context ${context.name}`);
          isEndpointError = true;
        }

        if (!endpoint.url) {
          configLoadErrors.push(`Url is undefined for endpoint in Context ${context.name}`);
          isEndpointError = true;
        }

        if (isEndpointError) {
          continue;
        }

        this.endpointConfigs.push({
          resource: endpoint.resource,
          url: `${(context.domain || baseEnvironmentDomain)}/${endpoint.url}`,
          versions: endpoint.versions || context.versions || baseEnvironmentVersions
        });
      });
    });

    if (configLoadErrors.length > 0) {
      throw new Error(`Resource Config Loading Exception \n ${configLoadErrors.toString().replace(',', '\n')}`);
    }
  }

  private validateUrlParams() {

  }
}

// export class InMemoryConfig {
//   public resource: string;
//   public url: string;
//   public version: string | number;
// }
