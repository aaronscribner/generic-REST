import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceAction } from '../../core/services/http-resource/enums/resource-action.enum';
import { HttpResourceService } from '../../core/services/http-resource/http-resource-service/http-resource.service';
import { HttpVerb } from '../../core/services/resource-url-service/enums/http-verbs.enum';
import { ResourceUrlService } from '../../core/services/resource-url-service/resource-url.service';
import { RestHierarchyService } from '../../core/services/rest-hierarchy/rest-hierarchy.service';
import { Ancestry } from '../models/ancestry.model';

@Injectable({
  providedIn: 'root'
})
export class AncestryService extends HttpResourceService<Ancestry, Ancestry> {
  constructor(httpClient: HttpClient, resourceUrlService: ResourceUrlService) {
    super(
      'AggregateRoot',
      httpClient,
      resourceUrlService,
    );
  }

  protected responseHandler(response: any, verb: HttpVerb, action: ResourceAction): Ancestry | Ancestry[] {
    let httpResult;

    switch (action) {
      case ResourceAction.List:
        httpResult = Ancestry.fromJson(response) as Ancestry[];
        httpResult.forEach(x => x.parents.forEach(y => RestHierarchyService.assignHierarchyIdentifiers(y, [x.id])));
        break;
      case ResourceAction.Read:
        httpResult = Ancestry.fromJson(response) as Ancestry;
        httpResult.parents.forEach(y => RestHierarchyService.assignHierarchyIdentifiers(y, [httpResult.id]));
        break;
      default:
        throw new Error('Response unhandled');
    }

    console.table(httpResult);
    return httpResult;
  }
}
