import { ProfileService } from './services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { ProfileRoutingModule } from './profile-routing.module';
import {
  ProfilePageComponent, ProfileHeaderComponent, EditExperienceComponent, UserAddressComponent,
  UserSummaryComponent, ProfileVisibilityComponent, UserAdditionalInfoComponent, UserExperienceViewComponent,
  UserSkillsComponent, EditUserAddressComponent, UserEducationComponent, EditUserEducationComponent, EditUserSkillsComponent,
  EditUserAdditionalInfoComponent
} from './components';
import { SuiModule } from 'ng2-semantic-ui';
import { CoreModule } from '@sunbird/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrgManagementModule } from '@sunbird/org-management';
import { WebExtensionModule } from 'sunbird-web-extension';
import { ProfileBadgeComponent } from './components/profile-badge/profile-badge.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    SuiModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    OrgManagementModule,
    WebExtensionModule,
    NgInviewModule,
    TelemetryModule
  ],
  declarations: [ProfilePageComponent, ProfileHeaderComponent, UserSummaryComponent, ProfileVisibilityComponent,
    UserExperienceViewComponent, EditExperienceComponent, UserAddressComponent, UserEducationComponent, UserSkillsComponent,
    UserAdditionalInfoComponent,
    EditUserAddressComponent,
    EditUserEducationComponent,
    EditUserSkillsComponent,
    EditUserAdditionalInfoComponent,
    ProfileBadgeComponent,
    MenuItemComponent],
  providers: [ProfileService],
  entryComponents: [ProfileBadgeComponent, MenuItemComponent]
})
export class ProfileModule { }
