import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExploreGroupComponent } from './components';
const routes: Routes = [
  {
    path: '', component: ExploreGroupComponent, data: {
      telemetry: {
        env: 'groups', pageid: 'explore-groups', type: 'view', subtype: 'paginate'
      }
    }
  }
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class GroupRoutingModule { }
