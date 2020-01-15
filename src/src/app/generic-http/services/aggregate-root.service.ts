import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResourceService } from '../../core/services/http-resource/http-resource-service/http-resource.service';
import { ResourceUrlService } from '../../core/services/resource-url-service/resource-url.service';
import { AggregateRoot } from '../models/aggregate-root.model';

@Injectable({
  providedIn: 'root'
})
export class AggregateRootService extends HttpResourceService<AggregateRoot, AggregateRoot> {
  constructor(httpClient: HttpClient, resourceUrlService: ResourceUrlService) {
    super(
      'AggregateRoot',
      httpClient,
      resourceUrlService,
      AggregateRoot,
      AggregateRoot
    );
  }
}
