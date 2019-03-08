import { SharedFeatureModule } from '@sunbird/shared-feature';
import { ProfileService } from './services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { SlickModule } from 'ngx-slick';
import { ProfileRoutingModule } from './profile-routing.module';
import {
  ProfilePageComponent, ProfileBadgeComponent, UpdateContactDetailsComponent, UpdateUserDetailsComponent
} from './components';
import { SuiModule } from 'ng2-semantic-ui';
import { CoreModule } from '@sunbird/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { AvatarModule } from 'ngx-avatar';
@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    SuiModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    WebExtensionModule,
    NgInviewModule,
    TelemetryModule,
    SlickModule,
    AvatarModule,
    SharedFeatureModule
  ],
  declarations: [ProfilePageComponent, ProfileBadgeComponent, UpdateContactDetailsComponent, UpdateUserDetailsComponent],
  providers: [ProfileService],
  entryComponents: [ProfileBadgeComponent]
})
export class ProfileModule { }
