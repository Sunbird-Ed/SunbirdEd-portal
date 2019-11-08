import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExploreContentComponent, ExploreComponent } from './components';
import {ViewAllComponent} from '@sunbird/shared-feature';
const routes: Routes = [
  {
    path: '', component: ExploreComponent, data: {
      telemetry: {
        env: 'explore', pageid: 'explore', type: 'view', subtype: 'paginate'
      },
      softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 }
    }
  },
  {
    path: 'view-all/:section/:pageNumber', component: ViewAllComponent,
    data: {
      telemetry: {
        env: 'explore', pageid: 'view-all', type: 'view', subtype: 'paginate'
      },
      filterType: 'explore',
      softConstraints: {badgeAssertions: 98, board: 99, channel: 100},
      applyMode: true
    }
  },
    {
      path: ':pageNumber', component: ExploreContentComponent, data: {
        telemetry: {
          env: 'explore', pageid: 'explore-search', type: 'view', subtype: 'paginate'
        },
        softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 }
      }
    }
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ExploreRoutingModule { }
