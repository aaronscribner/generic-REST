import { Injectable } from '@angular/core';
import { SubResource } from '../../../shared/models/base-classes/sub-resource.model';

@Injectable({
  providedIn: 'root'
})
export class RestHierarchyService {
  public static assignHierarchyIdentifiers(subResource: SubResource | any, parentIdentifiers: any): void {
    const composedSubResources = Object.entries(subResource)
      .filter(([key, value]) => key !== 'identifierHierarchy' && value.constructor === Array)
      .map(([key, value]) => Object.values(value).reduce(x => x));

    if (!composedSubResources) {
      return;
    }

    subResource.identifierHierarchy = parentIdentifiers;
    composedSubResources.forEach(x => RestHierarchyService.assignHierarchyIdentifiers(x, [...parentIdentifiers, subResource.id]));
  }
}
