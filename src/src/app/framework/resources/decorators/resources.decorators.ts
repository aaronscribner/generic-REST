import { ResourcesConfiguration } from './resources-configuration.container';
import { ResourceConfigurationOptions } from '../interfaces/resource-configuration-options.interface';

let classNameId = 0;

function addClassName(target): void {
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

export function child(resourceName: string, options: ResourceConfigurationOptions = {}): PropertyDecorator {
  return <T>(target: new (object?: T) => T, propertyName: string) => {
    addClassName(target.constructor);
    if (!options) {
      options = {};
    }
    const actualType = Reflect.getMetadata('design:type', target, propertyName);

    const array = actualType.name === 'Array';
    const type: new () => unknown = options.type || actualType;

    addClassName(type);

    if (array && !type) {
      throw new Error('@child - type is required for array properties');
    }
    options.idKey = !!options.idKey ? options.idKey : 'id';

    options.childName = array ? `${propertyName}` : propertyName;

    ResourcesConfiguration.resources.push({
      resourceName,
      name: type.name,
      parent: target.constructor.name,
      type,
      array,
      options,
    });
  };
}
