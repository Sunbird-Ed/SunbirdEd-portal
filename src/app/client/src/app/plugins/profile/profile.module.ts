import { SharedFeatureModule } from '@sunbird/shared-feature';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { ProfileRoutingModule } from './profile-routing.module';
import {
  ProfilePageComponent, ProfileBadgeComponent, UpdateContactDetailsComponent,
  AccountRecoveryInfoComponent, CreateUserComponent,DeleteUserComponent,DeleteAccountComponent, ChooseUserComponent, SubmitTeacherDetailsComponent
} from './components';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule } from '@project-sunbird/ng2-semantic-ui';
import { CoreModule } from '@sunbird/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { TelemetryModule } from '@sunbird/telemetry';
import { ContentSearchModule } from '@sunbird/content-search';
import {CommonConsumptionModule} from '@project-sunbird/common-consumption';
import { CertificateDirectivesModule } from '@project-sunbird/sb-svg2pdf';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';
import { CommonFormElementsModule } from '@project-sunbird/common-form-elements-full';
import {LocationModule} from '../location';
import { MatTooltipModule } from '@angular/material/tooltip';


export const csCourseServiceFactory = (csLibInitializerService: CsLibInitializerService) => {
  if (!CsModule.instance.isInitialised) {
    csLibInitializerService.initializeCs();
  }
  return CsModule.instance.courseService;
};

export const csCertificateServiceFactory = (csLibInitializerService: CsLibInitializerService) => {
  if (!CsModule.instance.isInitialised) {
    csLibInitializerService.initializeCs();
  }
  return CsModule.instance.certificateService;
};

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
    SuiProgressModule, SuiRatingModule, SuiCollapseModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    // WebExtensionModule,
    TelemetryModule,
    SharedFeatureModule,
    ContentSearchModule,
    CommonConsumptionModule,
    CertificateDirectivesModule,
    CommonFormElementsModule,
    LocationModule,
    MatTooltipModule,
  ],
  declarations: [ProfilePageComponent, ProfileBadgeComponent, UpdateContactDetailsComponent,
   AccountRecoveryInfoComponent,
   CreateUserComponent,
   DeleteUserComponent,
   DeleteAccountComponent,
   ChooseUserComponent,
   SubmitTeacherDetailsComponent],
  providers: [
    {provide: 'CS_COURSE_SERVICE', useFactory: csCourseServiceFactory, deps: [CsLibInitializerService]},
    {provide: 'CS_CERTIFICATE_SERVICE', useFactory: csCertificateServiceFactory, deps: [CsLibInitializerService]}
  ]
})
export class ProfileModule { }
