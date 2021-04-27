import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestResourceService } from './services';

@NgModule({
  imports: [CommonModule],
  exports: [RestResourceService]
})
export class RestModule {}
