import { NgModule } from '@angular/core';
import { RestHierarchyService } from './rest-hierarchy/rest-hierarchy.service';
import { HttpCodeMessageService } from '@core/services/http-code-message/http-code-message.service';

@NgModule({
  providers: [
    RestHierarchyService,
    HttpCodeMessageService
  ]
})
export class ServicesModule {}
