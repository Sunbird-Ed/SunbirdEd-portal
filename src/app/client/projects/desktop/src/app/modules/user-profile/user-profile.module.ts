import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { ProfilePageComponent, AboutUsComponent, UpdateContentPreferenceComponent, UpdateLocationComponent } from './components';
import { SuiModalModule } from 'ng2-semantic-ui';
@NgModule({
  declarations: [
    ProfilePageComponent,
    AboutUsComponent,
    UpdateContentPreferenceComponent,
    UpdateLocationComponent
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    SuiModalModule,
  ],
})
export class UserProfileModule { }
