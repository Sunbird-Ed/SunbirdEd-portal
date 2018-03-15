import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent, CreateContentComponent } from './components/index';
const routes: Routes = [
  {
    path: 'workspace/content', component: WorkspaceComponent,
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full'},
      { path: 'create', component: CreateContentComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }


