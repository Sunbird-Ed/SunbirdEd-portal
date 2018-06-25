import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from '@sunbird/core';

const appRoutes: Routes = [
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path: 'learn',
    loadChildren: 'app/modules/learn/learn.module#LearnModule'
  },
  {
    path: 'resources',
    loadChildren: 'app/modules/resource/resource.module#ResourceModule'
  },
  {
    path: 'search',
    loadChildren: 'app/modules/search/search.module#SearchModule'
  },
  {
    path: 'workspace',
    loadChildren: 'app/modules/workspace/workspace.module#WorkspaceModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
