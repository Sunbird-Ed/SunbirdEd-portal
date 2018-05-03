import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { LandingPageComponent, SignupComponent } from './components';
import { Routes, RouterModule } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupService } from './services';
import { SharedModule } from '@sunbird/shared';

const routes: Routes = [
  {
    path: '', // root path '/' for the app
    component: LandingPageComponent,
    children: [
      { path: 'signup', component: SignupComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    RouterModule.forRoot(routes),
    SuiModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [LandingPageComponent, SignupComponent],
  providers: [SignupService]
})
export class PublicModule { }
