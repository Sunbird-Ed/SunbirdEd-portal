import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'get', loadChildren: './../public/module/dial-code-search/dial-code-search.module#DialCodeSearchModule'
  },
  {
    path: '', loadChildren: './../public/module/explore/explore.module#ExploreModule'
  },
  {
    path: ':slug/explore', loadChildren: './../public/module/explore/explore.module#ExploreModule'
  },
  {
    path: 'play', loadChildren: './../public/module/player/player.module#PlayerModule'
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineRoutingModule { }
