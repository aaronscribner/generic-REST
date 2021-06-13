import { Injectable } from '@angular/core';
import { RestResource } from '@societal/rest';
import { RestModule } from '@societal/rest';

@Injectable({
  providedIn: RestModule
})
export class RestHierarchyService {
  public static assignHierarchyIdentifiers(resource: RestResource, parentIdentifiers: string | number): void {

    let composedArraySubResources = Object.entries(resource)
      .filter(([key, value]) => key !== 'identifierHierarchy' && value.constructor === Array)
      .map(([key, value]) => Object.values(value));

    resource.identifierHierarchy = parentIdentifiers;

    if (composedArraySubResources.length > 0) {
      composedArraySubResources = composedArraySubResources.reduce((acc, value) => {
        if (value.constructor.prototype instanceof RestResource) {
          return [
            acc,
            ...value
          ];
        }
      });
    }

    const composedSingleSubResource = [];

    Object.values(resource).forEach(x => {
      if (x.constructor.prototype instanceof RestResource) {
       composedSingleSubResource.push(x);
      }
    });

    const composedSubResources = [...composedArraySubResources, ...composedSingleSubResource];

    if (composedSubResources.length === 0) {
      return;
    }

    const identifiers = [...parentIdentifiers, resource.id];
    composedSubResources.forEach(x => RestHierarchyService.assignHierarchyIdentifiers(x, identifiers));
  }
}
