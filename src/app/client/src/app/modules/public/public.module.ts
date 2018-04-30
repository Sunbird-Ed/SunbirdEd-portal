import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent, SignupComponent } from './components';
import { Routes, RouterModule } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '', // root path '/' for the app
    component: LandingPageComponent
  },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    SuiModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [LandingPageComponent, SignupComponent]
})
export class PublicModule { }
