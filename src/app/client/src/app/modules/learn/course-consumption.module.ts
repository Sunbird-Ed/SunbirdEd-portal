import { TelemetryModule } from '@sunbird/telemetry';
import { CourseConsumptionRoutingModule } from './course-consumption-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { FormsModule } from '@angular/forms';
import {
  CoursePlayerComponent, CourseConsumptionHeaderComponent, CourseConsumptionPageComponent,
  CurriculumCardComponent  } from './components';
import { CourseConsumptionService, CourseBatchService, CourseProgressService , AssessmentScoreService } from './services';
import { CoreModule } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import {
  SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule
} from 'ng2-semantic-ui';
import { BatchDetailsComponent,  } from './components/batch/batch-details/batch-details.component';
import { UnEnrollBatchComponent} from './components/batch/unenroll-batch/unenroll-batch.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { AssessmentPlayerComponent } from './components/course-consumption/assessment-player/assessment-player.component';
import { CourseCompletionComponent } from './components/course-consumption/course-completion/course-completion.component';
import { CertificateNameUpdatePopupComponent } from './components/course-consumption/certificate-name-update-popup/certificate-name-update-popup.component';
import { CourseDetailsComponent } from './components/course-consumption/course-details/course-details.component';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';
import { NotificationModule } from '../notification/notification.module';
import { DiscussionModule } from '../discussion/discussion.module';

export const csUserServiceFactory = (csLibInitializerService: CsLibInitializerService) => {
  if (!CsModule.instance.isInitialised) {
    csLibInitializerService.initializeCs();
  }
  return CsModule.instance.userService;
};
export const csCourseServiceFactory = (csLibInitializerService: CsLibInitializerService) => {
  if (!CsModule.instance.isInitialised) {
    csLibInitializerService.initializeCs();
  }
  return CsModule.instance.courseService;
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedFeatureModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
    SuiProgressModule, SuiRatingModule, SuiCollapseModule,
    FormsModule,
    CourseConsumptionRoutingModule,
    CoreModule,
    TelemetryModule,
    PlayerHelperModule,
    CommonConsumptionModule,
    NotificationModule,
    DiscussionModule
  ],
  providers: [
    { provide: 'CS_USER_SERVICE', useFactory: csUserServiceFactory, deps: [CsLibInitializerService] },
    { provide: 'CS_COURSE_SERVICE', useFactory: csCourseServiceFactory, deps: [CsLibInitializerService] }
  ],
  declarations: [CoursePlayerComponent, CourseConsumptionHeaderComponent, AssessmentPlayerComponent,
    CourseConsumptionPageComponent, BatchDetailsComponent, CurriculumCardComponent, UnEnrollBatchComponent,
    AssessmentPlayerComponent, CourseCompletionComponent, CourseDetailsComponent, CertificateNameUpdatePopupComponent]
})
export class CourseConsumptionModule { }
