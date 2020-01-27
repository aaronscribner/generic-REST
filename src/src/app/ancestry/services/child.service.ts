import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceAction } from '../../core/services/http-resource/enums/resource-action.enum';
import { HttpResourceService } from '../../core/services/http-resource/http-resource-service/http-resource.service';
import { HttpVerb } from '../../core/services/resource-url-service/enums/http-verbs.enum';
import { ResourceUrlService } from '../../core/services/resource-url-service/resource-url.service';
import { Child } from '../models/child.model';


@Injectable({
  providedIn: 'root'
})
export class ChildService extends HttpResourceService<Child, Child> {

  constructor(httpClient: HttpClient, resourceUrlService: ResourceUrlService) {
    super(
      'RootChild',
      httpClient,
      resourceUrlService,
    );
  }

  protected responseHandler(response: any, verb: HttpVerb, action: ResourceAction): Child | Child[] {
    switch (action) {
      case ResourceAction.Read:
        return Child.fromJson(response);
      default:
        throw new Error('Response unhandled');
    }
  }
}
