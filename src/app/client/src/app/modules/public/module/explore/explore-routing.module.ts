import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExploreContentComponent } from './components';
const routes: Routes = [
    {
      path: ':pageNumber', component: ExploreContentComponent, data: {
        telemetry: {
          env: 'public', pageid: 'explore', type: 'view', subtype: 'paginate'
        }
      }
    },
    {
        path: '', component: ExploreContentComponent
      },
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ExploreRoutingModule { }
