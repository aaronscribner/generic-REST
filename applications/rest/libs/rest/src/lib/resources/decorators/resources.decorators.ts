import { ResourcesConfiguration } from './resources-configuration.container';
import { ResourceConfigurationOptions } from '../interfaces/resource-configuration-options.interface';

let classNameId = 0;

function addClassName(target: { name: string | never[]; }): void {
  if (!target.name || target.name.length < 2) {
    Object.defineProperty(target, 'name', {
      value: `__ClassName__${++classNameId}`,
      enumerable: false,
      writable: false,
      configurable: true,
    });
  }
}

export function resource(resourceName: string, options?: ResourceConfigurationOptions): ClassDecorator {
  return (target) => {
    addClassName(target.prototype.constructor);
    if (!options) {
      options = {};
    }
    options.idKey = !!options.idKey ? options.idKey : 'id';

    if (!ResourcesConfiguration.resources.some((r) => r.resourceName === resourceName)) {
      ResourcesConfiguration.resources.push({
        type: target.prototype.constructor,
        name: target.prototype.constructor.name,
        resourceName,
        options,
      });
    }
  };
}
