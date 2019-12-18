import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { ProfilePageComponent, AboutUsComponent, UpdateContentPreferenceComponent, UpdateLocationComponent,
  ProfileDropdownComponent } from './components';
import {
  SuiModalModule, SuiSelectModule
} from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfilePageComponent,
    AboutUsComponent,
    UpdateContentPreferenceComponent,
    UpdateLocationComponent,
    ProfileDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UserProfileRoutingModule,
    SuiModalModule,
    SuiSelectModule,
  ],
})
export class UserProfileModule { }
