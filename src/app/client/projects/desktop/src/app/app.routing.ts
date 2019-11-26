import { NgModule } from '@angular/core';
import { ErrorPageComponent } from '@sunbird/core';
import { RouterModule, Routes } from '@angular/router';
import { DesktopViewAllComponent, LibraryComponent } from './modules/offline';
const appRoutes: Routes = [
  {
    path: '',
    // loadChildren: './../../../../src/app/modules/public/module/explore/explore.module#ExploreModule'
    component: LibraryComponent
  },
  {
    path: 'view-all/:section/:pageNumber', component: DesktopViewAllComponent,
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
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
