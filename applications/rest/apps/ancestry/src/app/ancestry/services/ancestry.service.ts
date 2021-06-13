import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ancestry } from '../models/ancestry.model';
import { ResourceAction, ResourcesService, ResourceUrlService, RestVerb } from '@rest/rest'

@Injectable({
  providedIn: 'root'
})
export class AncestryService extends ResourcesService<Ancestry> {
  constructor(httpClient: HttpClient, resourceUrlService: ResourceUrlService) {
    super(
      httpClient,
      resourceUrlService,
    );
  }

  protected responseHandler(response: any, verb: RestVerb, action: ResourceAction): Ancestry | Ancestry[] {
    let httpResult: Ancestry | Ancestry[];

    switch (action) {
      case ResourceAction.List:
        httpResult = Ancestry.fromJson(response) as Ancestry[];
        // httpResult.forEach(x => x.parents.forEach(y => RestHierarchyService.assignHierarchyIdentifiers(y, [x.id])));
        break;
      case ResourceAction.Read:
        httpResult = Ancestry.fromJson(response) as Ancestry;
        // httpResult.parents.forEach(y => RestHierarchyService.assignHierarchyIdentifiers(y, [httpResult.id]));
        break;
      default:
        throw new Error('Response unhandled');
    }

    return httpResult;
  }
}
