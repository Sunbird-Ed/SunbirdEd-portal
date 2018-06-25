import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { ErrorPageComponent, AuthGuard } from '@sunbird/core';
const appRoutes: Routes = [
  {
    path: '',
    loadChildren: 'app/public/public.module#PublicModule'
  },
  {
    path: '',
    loadChildren: 'app/private/private.module#PrivateModule', canLoad: [AuthGuard]
  },
  {
    path: 'error',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
