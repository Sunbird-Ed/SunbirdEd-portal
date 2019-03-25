import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './components';
import { LandingpageGuard } from './services';
import { environment } from '@sunbird/environment';

let rootRoute: any = {
  path: '', component: LandingPageComponent, canActivate: [LandingpageGuard],
  data: { telemetry: { env: 'public', pageid: 'landing-page', type: 'edit', subtype: 'paginate' } }
};
if (environment.isOffline) {
  rootRoute = {
    path: '', loadChildren: './module/explore/explore.module#ExploreModule'
  };
}
const routes: Routes = [
  rootRoute,
  {
    path: 'get', loadChildren: './module/dial-code-search/dial-code-search.module#DialCodeSearchModule'
  },
  {
    path: 'explore', loadChildren: './module/explore/explore.module#ExploreModule'
  },
  {
    path: ':slug/explore', loadChildren: './module/explore/explore.module#ExploreModule'
  },
  {
    path: 'explore-course', loadChildren: './module/course/course.module#CourseModule'
  },
  {
    path: ':slug/explore-course', loadChildren: './module/course/course.module#CourseModule'
  },
  {
    path: ':slug/signup', loadChildren: './module/signup/signup.module#SignupModule'
  },
  {
    path: 'signup', loadChildren: './module/signup/signup.module#SignupModule'
  },
  {
    path: ':slug/sign-in/sso', loadChildren: './module/sign-in/sso/sso.module#SsoModule'
  },
  {
    path: 'sign-in/sso', loadChildren: './module/sign-in/sso/sso.module#SsoModule'
  },
  {
    path: 'play', loadChildren: './module/player/player.module#PlayerModule'
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
