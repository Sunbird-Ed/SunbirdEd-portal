import { NgModule } from '@angular/core';
import { ErrorPageComponent } from '@sunbird/core';
import { RouterModule, Routes } from '@angular/router';
const appRoutes: Routes = [
  {
    path: '',
    loadChildren: './modules/public/module/explore/explore.module#ExploreModule'
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
export class AppRoutingOfflineModule { }
