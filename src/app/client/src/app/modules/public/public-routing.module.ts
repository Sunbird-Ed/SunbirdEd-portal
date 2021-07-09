import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './components';
import { LandingpageGuard } from './services';
import { OfflineApplicationDownloadComponent } from '@sunbird/shared';

const routes: Routes = [
  {
    path: '', component: LandingPageComponent, canActivate: [LandingpageGuard],
    data: { telemetry: { env: 'public', pageid: 'landing-page', type: 'edit', subtype: 'paginate' } }
  },
  {
    path: 'desktop', loadChildren: './module/offline/offline.module#OfflineModule'
  },
  {
    path: 'explore', loadChildren: './module/explore/explore.module#ExploreModule'
  },
  {
    path: 'explore-course', loadChildren: './module/course/course.module#CourseModule'
  },
  {
    path: 'explore-groups', loadChildren: './module/group/group.module#GroupModule'
  },
  {
    path: 'signup', loadChildren: './module/signup/signup.module#SignupModule'
  },
  {
    path: 'sign-in/sso', loadChildren: './module/sign-in/sso/sso.module#SsoModule'
  },
  {
    path: 'play', loadChildren: './module/player/player.module#PlayerModule'
  },
  {
    path: 'download/desktopapp', component: OfflineApplicationDownloadComponent
  },
  {
    path: 'faq', loadChildren: './module/help/help.module#HelpModule'
  },
  {
    path: 'guest-profile', loadChildren: './module/guest-profile/guest-profile.module#GuestProfileModule'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
