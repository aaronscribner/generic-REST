import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResourceService } from '../../core/services/http-resource/http-resource-service/http-resource.service';
import { HttpSubResourceService } from '../../core/services/http-resource/http-sub-resouce-service/http-sub-resource.service';
import { ResourceUrlService } from '../../core/services/resource-url-service/resource-url.service';
import { RootGrandchild } from '../models/root-grandchild.model';


@Injectable({
  providedIn: 'root'
})
export class RootGrandchildService extends HttpSubResourceService<RootGrandchild, RootGrandchild> {

  constructor(httpClient: HttpClient, resourceUrlService: ResourceUrlService) {
    super(
      'RootGrandchild',
      httpClient,
      resourceUrlService,
      RootGrandchild,
      RootGrandchild
    );
  }
}
