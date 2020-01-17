import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material';

import { AncestryRoutingModule } from './ancestry-routing.module';
import { AncestryComponent } from './ancestry.component';
import { ParentComponent } from './parent/parent.component';
import { ChildComponent } from './child/child.component';
import { GrandchildComponent } from './grandchild/grandchild.component';


@NgModule({
  declarations: [
    AncestryComponent,
    ParentComponent,
    ChildComponent,
    GrandchildComponent
  ],
  imports: [
    CommonModule,
    AncestryRoutingModule,
    MatCardModule,
  ],
})
export class AncestryModule { }
