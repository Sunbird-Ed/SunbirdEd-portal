import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
  OtpPopupComponent, BatchInfoComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
  UserLocationComponent, UserOnboardingComponent, OnboardingUserSelectionComponent,
  ConfirmationPopupComponent, CertPreviewPopupComponent, ContentPlayerComponent, CollectionPlayerComponent, YearOfBirthComponent
} from './components';
import { SlickModule } from 'ngx-slick';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule, SuiDimmerModule } from 'ng2-semantic-ui-v9';
import { GlobalConsentPiiComponent } from './components/global-consent-pii/global-consent-pii.component';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v9';
import { CommonFormElementsModule } from 'common-form-elements-web-v9';
import { LocationModule } from '../../plugins/location';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashletModule } from  '@project-sunbird/sb-dashlet-v9';

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
    PlayerHelperModule,
    CommonConsumptionModule,
    CommonFormElementsModule,
    LocationModule,
    DashletModule.forRoot()
  ],
  providers:  [{ provide: 'CS_USER_SERVICE', useFactory: csUserServiceFactory, deps: [CsLibInitializerService] }],
  declarations: [ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
    OtpPopupComponent, BatchInfoComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
    UserLocationComponent,
    UserOnboardingComponent,
    OnboardingUserSelectionComponent,
    ConfirmationPopupComponent, CertPreviewPopupComponent, ContentPlayerComponent, GlobalConsentPiiComponent,
     CollectionPlayerComponent, YearOfBirthComponent, DashboardComponent
  ],
  exports: [ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
    OtpPopupComponent, BatchInfoComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
    UserLocationComponent, UserOnboardingComponent, OnboardingUserSelectionComponent,
    ConfirmationPopupComponent, CertPreviewPopupComponent, DashboardComponent,
     ContentPlayerComponent, GlobalConsentPiiComponent, CollectionPlayerComponent, YearOfBirthComponent]
})
export class SharedFeatureModule { }
