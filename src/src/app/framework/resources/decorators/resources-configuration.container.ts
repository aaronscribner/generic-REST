import 'reflect-metadata';
import { ResourceConfigurationOptions } from '@framework/resources/interfaces/resource-configuration-options.interface';

export interface ResourceConfiguration {
  resourceName: string;
  type: new () => unknown;
  name: string;
  parent?: string;
  array?: boolean;
  options?: ResourceConfigurationOptions;
}

export const ResourcesConfiguration: { resources: ResourceConfiguration[] } = {
  resources: [],
};
