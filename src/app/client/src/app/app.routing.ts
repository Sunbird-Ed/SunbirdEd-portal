import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from '@sunbird/core';

const appRoutes: Routes = [
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path: 'learn',
    loadChildren: 'app/modules/learn/learn.module#LearnModule'
  },
  {
    path: 'resources',
    loadChildren: 'app/modules/resource/resource.module#ResourceModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
