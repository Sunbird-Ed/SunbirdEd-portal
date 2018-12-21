import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components';
const routes: Routes = [
  {
    path: '', component: SignupComponent
  }
];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SignupRoutingModule { }
