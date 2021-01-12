import { SharedFeatureModule } from '@sunbird/shared-feature';
import { ProfileService } from './services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { SlickModule } from 'ngx-slick';
import { ProfileRoutingModule } from './profile-routing.module';
import {
  ProfilePageComponent, ProfileBadgeComponent, UpdateContactDetailsComponent,
  AccountRecoveryInfoComponent, CreateUserComponent, ChooseUserComponent, SubmitTeacherDetailsComponent
} from './components';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule } from 'ng2-semantic-ui';
import { CoreModule } from '@sunbird/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { TelemetryModule } from '@sunbird/telemetry';
import { AvatarModule } from 'ngx-avatar';
import { ContentSearchModule } from '@sunbird/content-search';
import {CommonConsumptionModule} from '@project-sunbird/common-consumption-v8';
import { CertificateDirectivesModule } from 'sb-svg2pdf';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';
import { CommonFormElementsModule } from 'common-form-elements';
import {LocationModule} from "../location";

export const csCourseServiceFactory = (csLibInitializerService: CsLibInitializerService) => {
  if (!CsModule.instance.isInitialised) {
    csLibInitializerService.initializeCs();
  }
  return CsModule.instance.courseService;
}
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
    SlickModule,
    AvatarModule,
    SharedFeatureModule,
    ContentSearchModule,
    CommonConsumptionModule,
    CertificateDirectivesModule,
    CommonFormElementsModule,
    LocationModule,
  ],
  declarations: [ProfilePageComponent, ProfileBadgeComponent, UpdateContactDetailsComponent,
   AccountRecoveryInfoComponent,
   CreateUserComponent,
   ChooseUserComponent,
   SubmitTeacherDetailsComponent],
  providers: [{provide: 'CS_COURSE_SERVICE', useFactory: csCourseServiceFactory, deps: [CsLibInitializerService]}]
})
export class ProfileModule { }
