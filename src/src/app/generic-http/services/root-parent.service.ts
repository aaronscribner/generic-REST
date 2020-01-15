import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResourceService } from '../../core/services/http-resource/http-resource-service/http-resource.service';
import { HttpSubResourceService } from '../../core/services/http-resource/http-sub-resouce-service/http-sub-resource.service';
import { ResourceUrlService } from '../../core/services/resource-url-service/resource-url.service';
import { RootParent } from '../models/root-parent.model';

@Injectable({
  providedIn: 'root'
})
export class RootParentService extends HttpSubResourceService<RootParent, RootParent> {

  constructor(httpClient: HttpClient, resourceUrlService: ResourceUrlService) {
    super(
      'RootParent',
      httpClient,
      resourceUrlService,
      RootParent,
      RootParent
    );
  }
}
