import { ListAllProgramsComponent } from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '', component: ListAllProgramsComponent, children: [
    {
      path: 'programs', component: ListAllProgramsComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributeRoutingModule { }
