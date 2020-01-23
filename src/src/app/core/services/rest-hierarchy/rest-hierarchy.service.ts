import { Injectable } from '@angular/core';
import { SubResource } from '../../../shared/models/base-classes/sub-resource.model';

@Injectable({
  providedIn: 'root'
})
export class RestHierarchyService {
  public static assignHierarchyIdentifiers(subResource: SubResource | any, parentIdentifiers: any): void {
    let composedSubResources = Object.entries(subResource)
      .filter(([key, value]) => key !== 'identifierHierarchy' && value.constructor === Array)
      .map(([key, value]) => Object.values(value));

    subResource.identifierHierarchy = parentIdentifiers;

    if (!composedSubResources || composedSubResources.length === 0) {
      return;
    }

    composedSubResources = composedSubResources.reduce((acc, value) => [acc, ...value]);
    console.table(composedSubResources);
    const identifiers = [...parentIdentifiers, subResource.id];
    composedSubResources.forEach(x => RestHierarchyService.assignHierarchyIdentifiers(x, identifiers));
  }
}
