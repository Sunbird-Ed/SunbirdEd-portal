import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { ProfilePageComponent, AboutUsComponent, UpdateContentPreferenceComponent, UpdateLocationComponent } from './components';
import {
  SuiModalModule, SuiProgressModule, SuiAccordionModule,
  SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule
} from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
@NgModule({
  declarations: [
    ProfilePageComponent,
    AboutUsComponent,
    UpdateContentPreferenceComponent,
    UpdateLocationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    UserProfileRoutingModule,
    SuiModalModule,
    SuiProgressModule,
    SuiAccordionModule,
    SuiTabsModule,
    SuiSelectModule,
    SuiDimmerModule,
    SuiCollapseModule

  ],
})
export class UserProfileModule { }
