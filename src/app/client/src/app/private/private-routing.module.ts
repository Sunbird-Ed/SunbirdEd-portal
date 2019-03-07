import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
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
  },
  {
    path: 'home',
    loadChildren: 'app/modules/home/home.module#HomeModule'
  },
  {
    path: 'announcement',
    loadChildren: 'app/modules/announcement/announcement.module#AnnouncementModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
