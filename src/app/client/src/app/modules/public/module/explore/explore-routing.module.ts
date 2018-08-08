import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExploreContentComponent, ExploreComponent } from './components';
const routes: Routes = [
    {
      path: ':pageNumber', component: ExploreContentComponent, data: {
        telemetry: {
          env: 'public', pageid: 'explore', type: 'view', subtype: 'paginate'
        }
      }
    },
    {
        path: '', component: ExploreComponent, data: {
          telemetry: {
            env: 'public', pageid: 'explore', type: 'view', subtype: 'paginate'
          }
        }
      },
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ExploreRoutingModule { }
