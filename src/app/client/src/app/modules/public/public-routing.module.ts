import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetComponent } from './components/get/get.component';
import { DialCodeComponent } from './components/dial-code/dial-code.component';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';
import {
  LandingPageComponent, SignupComponent, PublicContentPlayerComponent,
  PublicCollectionPlayerComponent, ExploreContentComponent
} from './components';

const routes: Routes = [
  {
    path: '', // root path '/' for the app
    component: LandingPageComponent
  },
  {
    path: 'signup', component: SignupComponent, data: {
      telemetry: {
        env: 'signup', pageid: 'signup', type: 'edit', subtype: 'paginate'
      }
    }
  },
  { path: 'get', component: GetComponent },
  { path: 'get/dial/:dialCode', component: DialCodeComponent },
  { path: 'play/content/:contentId', component: PublicContentPlayerComponent },
  { path: 'play/collection/:collectionId', component: PublicCollectionPlayerComponent },
  { path: 'explore/:pageNumber', component: ExploreContentComponent },
  { path: ':slug/explore/:pageNumber', component: ExploreContentComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }

