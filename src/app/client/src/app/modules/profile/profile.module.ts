import { ProfileService } from './services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { ProfileRoutingModule } from './profile-routing.module';
import {
  ProfilePageComponent, ProfileHeaderComponent, EditExperienceComponent, UserAddressComponent,
  UserSummaryComponent, ProfileVisibilityComponent, UserAdditionalInfoComponent, UserExperienceViewComponent,
  UserSkillsComponent, EditUserAddressComponent, UserEducationComponent, EditUserEducationComponent, EditUserSkillsComponent,
  EditUserAdditionalInfoComponent, ProfileBadgeComponent
} from './components';
import { SuiModule } from 'ng2-semantic-ui';
import { CoreModule } from '@sunbird/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrgManagementModule } from '@sunbird/org-management';
// import { SocialMediaLinksComponent } from './components/social-media-links/social-media-links.component';
@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    SuiModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    OrgManagementModule
  ],
  declarations: [ProfilePageComponent, ProfileHeaderComponent, UserSummaryComponent, ProfileVisibilityComponent,
    UserExperienceViewComponent, EditExperienceComponent, UserAddressComponent, UserEducationComponent, UserSkillsComponent,
    UserAdditionalInfoComponent,
    EditUserAddressComponent,
    EditUserEducationComponent,
    EditUserSkillsComponent,
    EditUserAdditionalInfoComponent,
    ProfileBadgeComponent],
  providers: [ProfileService]
})
export class ProfileModule { }
