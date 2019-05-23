import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentImportComponent, BrowseComponent } from './components';
import {ViewAllComponent} from '@sunbird/shared-feature';

const routes: Routes = [
  {
    path: 'browse', component: BrowseComponent, data: {
      telemetry: {
        env: 'offline', pageid: 'browse', type: 'view'
      },
    }
  },
  {
    path: 'browse/view-all/:section/:pageNumber', component: ViewAllComponent,
    data: {
      telemetry: {
        env: 'offline', pageid: 'view-all', type: 'view', subtype: 'paginate'
      },
      filterType: 'explore',
      softConstraints: {badgeAssertions: 98, board: 99, channel: 100},
      applyMode: true
    }
  },
  {
    path: 'get', loadChildren: './../dial-code-search/dial-code-search.module#DialCodeSearchModule'
  },
  {
    path: '', loadChildren: './../public/module/explore/explore.module#ExploreModule'
  },
  {
    path: ':slug/explore', loadChildren: './../public/module/explore/explore.module#ExploreModule'
  },
  {
    path: 'play', loadChildren: './../public/module/player/player.module#PlayerModule'
  },
  {
    path: 'import/content', component: ContentImportComponent, data: {
      telemetry: {
        env: 'offline', pageid: 'import-content', type: 'view', subtype: 'scroll'
      },
    }
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineRoutingModule { }
