import { Injectable } from '@angular/core';
import { Resource } from '@shared/models/base-classes/resource.model';

@Injectable({
  providedIn: 'root'
})
export class RestHierarchyService {
  public static assignHierarchyIdentifiers(resource: Resource | any, parentIdentifiers: any): void {

    let composedArraySubResources = Object.entries(resource)
      .filter(([key, value]) => key !== 'identifierHierarchy' && value.constructor === Array)
      .map(([key, value]) => Object.values(value));

    resource.identifierHierarchy = parentIdentifiers;

    if (composedArraySubResources.length > 0) {
      composedArraySubResources = composedArraySubResources.reduce((acc, value) => {
        if (value.constructor.prototype instanceof Resource) {
          return [
            acc,
            ...value
          ];
        }
      });
    }

    const composedSingleSubResource = [];

    Object.values(resource).forEach(x => {
      if (x.constructor.prototype instanceof Resource) {
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
