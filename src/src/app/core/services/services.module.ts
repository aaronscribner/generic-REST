import { NgModule } from '@angular/core';
import { HttpResourceService } from './http-resource/http-resource-service/http-resource.service';
import { RestHierarchyService } from './rest-hierarchy/rest-hierarchy.service';

@NgModule({
  providers: [
    RestHierarchyService,
  ]
})
export class ServicesModule {}
