import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { ProfilePageComponent, AboutUsComponent, UpdateContentPreferenceComponent, UpdateLocationComponent } from './components';

@NgModule({
  declarations: [
    ProfilePageComponent,
    AboutUsComponent,
    UpdateContentPreferenceComponent,
    UpdateLocationComponent
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule
  ]
})
export class UserProfileModule { }
