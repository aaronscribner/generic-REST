import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceAction } from '@core/services/rest-resource/enums/resource-action.enum';
import { RestResourceService } from '@core/services/rest-resource/rest-resource-service/rest-resource.service';
import { HttpVerb } from '@core/services/resource-url/enums/http-verbs.enum';
import { ResourceUrlService } from '@core/services/resource-url/resource-url.service';
import { Grandchild } from '../models/grandchild.model';


@Injectable({
  providedIn: 'root'
})
export class GrandchildService extends RestResourceService<Grandchild> {

  constructor(httpClient: HttpClient, resourceUrlService: ResourceUrlService) {
    super(
      'RootGrandchild',
      httpClient,
      resourceUrlService
    );
  }

  protected responseHandler(response: any, verb: HttpVerb, action: ResourceAction): Grandchild | Grandchild[] {
    switch (action) {
      case ResourceAction.Read:
        return Grandchild.fromJson(response);
      default:
        throw new Error('Response unhandled');
    }
  }
}
