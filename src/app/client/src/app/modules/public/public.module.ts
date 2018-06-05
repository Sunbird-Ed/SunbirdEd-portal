import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import {
  LandingPageComponent, SignupComponent, PublicContentPlayerComponent,
  PublicCollectionPlayerComponent, ExploreContentComponent
} from './components';
import { Routes, RouterModule } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetComponent } from './components/get/get.component';
import { DialCodeComponent } from './components/dial-code/dial-code.component';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';
import { SignupService, PublicPlayerService, OrgManagementService } from './services';
import { SharedModule } from '@sunbird/shared';
import { DiscussionModule } from '@sunbird/discussion';

const routes: Routes = [
  {
    path: '', // root path '/' for the app
    component: LandingPageComponent
  },
  { path: 'signup', component: SignupComponent },
  { path: 'get', component: GetComponent },
  { path: 'get/dial/:dialCode', component: DialCodeComponent },
  { path: 'play/content/:contentId', component: PublicContentPlayerComponent },
  { path: 'play/collection/:collectionId', component: PublicCollectionPlayerComponent },
  { path: 'explore/:pageNumber', component: ExploreContentComponent },
  { path: ':slug/explore/:pageNumber', component: ExploreContentComponent }
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    RouterModule.forRoot(routes),
    SuiModule,
    FormsModule,
    ReactiveFormsModule,
    DiscussionModule
  ],
  declarations: [LandingPageComponent, SignupComponent, GetComponent, DialCodeComponent,
    PublicFooterComponent, PublicContentPlayerComponent, PublicCollectionPlayerComponent, ExploreContentComponent],
  providers: [SignupService, PublicPlayerService, OrgManagementService]
})
export class PublicModule { }
