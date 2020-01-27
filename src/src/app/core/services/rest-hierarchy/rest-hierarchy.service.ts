import { Injectable } from '@angular/core';
import { SubResource } from '../../../shared/models/base-classes/sub-resource.model';
import { Contact } from '../../../ancestry/models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class RestHierarchyService {
  public static assignHierarchyIdentifiers(subResource: SubResource | any, parentIdentifiers: any): void {

    let composedArraySubResources = Object.entries(subResource)
      .filter(([key, value]) => key !== 'identifierHierarchy' && value.constructor === Array)
      .map(([key, value]) => Object.values(value));

    subResource.identifierHierarchy = parentIdentifiers;

    if (composedArraySubResources.length > 0) {
      composedArraySubResources = composedArraySubResources.reduce((acc, value) => {
        if (value.constructor.prototype instanceof SubResource) {
          return [
            acc,
            ...value
          ];
        }
      });
    }
    // composedSubResources = composedSubResources.filter(x => x.constructor.prototype === SubResource);

    const composedSingleSubResource = [];

    Object.values(subResource).forEach(x => {
      if (x.constructor.prototype instanceof SubResource) {
       composedSingleSubResource.push(x);
      }
    });


    const composedSubResources = [...composedArraySubResources, ...composedSingleSubResource];

    if (composedSubResources.length === 0) {
      return;
    }

    const identifiers = [...parentIdentifiers, subResource.id];
    composedSubResources.forEach(x => RestHierarchyService.assignHierarchyIdentifiers(x, identifiers));
  }
}
