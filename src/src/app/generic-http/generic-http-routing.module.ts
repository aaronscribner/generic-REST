import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenericHttpComponent } from './generic-http.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main'
  },
  {
    path: 'main',
    component: GenericHttpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenericHttpRoutingModule { }
