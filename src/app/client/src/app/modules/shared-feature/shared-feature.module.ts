import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
  OtpPopupComponent, BatchInfoComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
  UserLocationComponent, UserOnboardingComponent, OnboardingUserSelectionComponent, OnboardingLocationSelectionComponent,
  ConfirmationPopupComponent, JoyThemePopupComponent, CertPreviewPopupComponent, ContentPlayerComponent
} from './components';
import { SlickModule } from 'ngx-slick';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule, SuiDimmerModule } from 'ng2-semantic-ui';
import { GlobalConsentPiiComponent } from './components/global-consent-pii/global-consent-pii.component';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';
import { PlayerHelperModule } from '@sunbird/player-helper';

export const csUserServiceFactory = (csLibInitializerService: CsLibInitializerService) => {
  if (!CsModule.instance.isInitialised) {
    csLibInitializerService.initializeCs();
  }
  return CsModule.instance.userService;
};
@NgModule({
  imports: [
    CommonModule,
    SlickModule,
    SharedModule,
    CoreModule,
    TelemetryModule,
    RouterModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
    SuiProgressModule, SuiRatingModule, SuiCollapseModule, SuiDimmerModule,
    FormsModule,
    ReactiveFormsModule,
    PlayerHelperModule
  ],
  providers:  [{ provide: 'CS_USER_SERVICE', useFactory: csUserServiceFactory, deps: [CsLibInitializerService] }],
  declarations: [ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
    OtpPopupComponent, BatchInfoComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
    UserLocationComponent,
    UserOnboardingComponent,
    OnboardingUserSelectionComponent,
    OnboardingLocationSelectionComponent,
<<<<<<< HEAD
    ConfirmationPopupComponent, JoyThemePopupComponent, CertPreviewPopupComponent, GlobalConsentPiiComponent
=======
    ConfirmationPopupComponent, JoyThemePopupComponent, CertPreviewPopupComponent, ContentPlayerComponent
>>>>>>> upstream/release-3.4.0
  ],
  exports: [ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
    OtpPopupComponent, BatchInfoComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
    UserLocationComponent, UserOnboardingComponent, OnboardingUserSelectionComponent, OnboardingLocationSelectionComponent,
<<<<<<< HEAD
    ConfirmationPopupComponent, JoyThemePopupComponent, CertPreviewPopupComponent, GlobalConsentPiiComponent]
=======
    ConfirmationPopupComponent, JoyThemePopupComponent, CertPreviewPopupComponent, ContentPlayerComponent]
>>>>>>> upstream/release-3.4.0
})
export class SharedFeatureModule { }
