import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExploreContentComponent, ExploreComponent } from './components';
import {ViewAllComponent} from '@sunbird/shared-feature';
const routes: Routes = [
  {
    path: '', component: ExploreComponent, data: {
      telemetry: {
        env: 'public', pageid: 'explore', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'view-all/:section/:pageNumber', component: ViewAllComponent,
    data: {
      telemetry: {
        env: 'explore', pageid: 'viewAll', type: 'view', subtype: 'paginate'
      },
      filterType: 'explore',
      softConstraints: {badgeAssertions: 98, board: 99, channel: 100}
    }
  },
    {
      path: ':pageNumber', component: ExploreContentComponent, data: {
        telemetry: {
          env: 'public', pageid: 'explore', type: 'view', subtype: 'paginate'
        }
      }
    }
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ExploreRoutingModule { }
