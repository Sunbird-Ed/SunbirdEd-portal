import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentImportComponent, BrowseComponent } from './index';


const routes: Routes = [
  {
    path: 'browse', component: BrowseComponent, data: {
      telemetry: {
        env: 'offline', pageid: 'browse', type: 'view'
      },
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
