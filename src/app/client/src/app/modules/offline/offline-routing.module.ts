import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseComponent, OfflineHelpCenterComponent } from './components';
import {ViewAllComponent} from '@sunbird/shared-feature';
import { ExploreContentComponent } from './../public/module/explore/components/explore-content/explore-content.component';

const routes: Routes = [
  {
    path: 'browse', component: BrowseComponent, data: {
      telemetry: {
        env: 'offline', pageid: 'browse', type: 'view'
      },
      softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 }
    }
  },
  {
    path: 'help-center', component: OfflineHelpCenterComponent, data: {
      telemetry: {
        env: 'offline', pageid: 'help-center', type: 'view'
      }
    }
  },
  {
    path: 'browse/:pageNumber', component: ExploreContentComponent, data: {
      telemetry: {
        env: 'offline', pageid: 'browse-search', type: 'view', subtype: 'paginate'
      },
      softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 }
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
    path: 'search/:pageNumber', component: ExploreContentComponent, data: {
      telemetry: {
        env: 'offline', pageid: 'library-search', type: 'view', subtype: 'paginate'
      },
      softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 }
    }
  },
  {
    path: 'get', loadChildren: './../dial-code-search/dial-code-search.module#DialCodeSearchModule'
  },
  {
    path: 'browse/get', loadChildren: './../dial-code-search/dial-code-search.module#DialCodeSearchModule'
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
    path: 'browse/play', loadChildren: './../public/module/player/player.module#PlayerModule'
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineRoutingModule { }
