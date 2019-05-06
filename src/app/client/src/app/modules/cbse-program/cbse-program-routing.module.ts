import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CbseComponent } from './components';
const routes: Routes = [{
  path: 'cbse', component: CbseComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CbseProgramRoutingModule { }
