import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceAction } from '@core/services/rest-resource/enums/resource-action.enum';
import { RestResourceService } from '@core/services/rest-resource/rest-resource-service/rest-resource.service';
import { HttpVerb } from '@core/services/resource-url/enums/http-verbs.enum';
import { ResourceUrlService } from '@core/services/resource-url/resource-url.service';
import { Parent } from '../models/parent.model';

@Injectable({
  providedIn: 'root'
})
export class ParentService extends RestResourceService<Parent> {

  constructor(httpClient: HttpClient, resourceUrlService: ResourceUrlService) {
    super(
      'RootParent',
      httpClient,
      resourceUrlService
    );
  }

  protected responseHandler(response: any, verb: HttpVerb, action: ResourceAction): Parent | Parent[] {
    switch (action) {
      case ResourceAction.Read:
        return Parent.fromJson(response);
      case ResourceAction.Update:
        return Parent.fromJson(response);
      default:
        throw new Error('Response unhandled');
    }
  }
}
