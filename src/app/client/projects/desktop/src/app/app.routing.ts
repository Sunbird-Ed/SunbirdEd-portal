import { NgModule } from '@angular/core';
import { ErrorPageComponent } from '@sunbird/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryComponent } from './modules/offline';

const appRoutes: Routes = [
  {
    path: '',
    component: LibraryComponent
  },
  {
      path: 'play', loadChildren: './modules/content-consumption/content-consumption.module#ContentConsumptionModule'
  },
  {
      path: 'browse/play', loadChildren: './modules/content-consumption/content-consumption.module#ContentConsumptionModule'
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
