import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenericHttpRoutingModule } from './generic-http-routing.module';
import { GenericHttpComponent } from './generic-http/generic-http.component';


@NgModule({
  declarations: [GenericHttpComponent],
  imports: [
    CommonModule,
    GenericHttpRoutingModule
  ]
})
export class GenericHttpModule { }
