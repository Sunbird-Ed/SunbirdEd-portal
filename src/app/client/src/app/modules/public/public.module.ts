import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent, SignupComponent } from './components';
import { Routes, RouterModule } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetComponent } from './components/get/get.component';
import { DialCodeComponent } from './components/dial-code/dial-code.component';
import { SharedModule} from '@sunbird/shared';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';

const routes: Routes = [
  {
    path: '', // root path '/' for the app
    component: LandingPageComponent
  },
  { path: 'signup', component: SignupComponent },
  { path: 'get', component: GetComponent },
  { path: 'get/dial/:dialCode', component: DialCodeComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    SuiModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [LandingPageComponent, SignupComponent, GetComponent, DialCodeComponent, PublicFooterComponent]
})
export class PublicModule { }
