import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material';

import { GenericHttpRoutingModule } from './generic-http-routing.module';
import { GenericHttpComponent } from './generic-http.component';
import { AggregateRootComponent } from './aggregate-root/aggregate-root.component';
import { RootParentComponent } from './root-parent/root-parent.component';
import { RootChildComponent } from './root-child/root-child.component';
import { RootGrandchildComponent } from './root-grandchild/root-grandchild.component';


@NgModule({
  declarations: [
    GenericHttpComponent,
    AggregateRootComponent,
    RootParentComponent,
    RootChildComponent,
    RootGrandchildComponent
  ],
  imports: [
    CommonModule,
    GenericHttpRoutingModule,
    MatCardModule,
  ],
})
export class GenericHttpModule { }
