import { TelemetryModule } from '@sunbird/telemetry';
import { CourseConsumptionRoutingModule } from './course-consumption-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { FormsModule } from '@angular/forms';
import {
  CoursePlayerComponent, CourseConsumptionHeaderComponent, CourseConsumptionPageComponent,
  CurriculumCardComponent,  } from './components';
import { CourseConsumptionService, CourseBatchService, CourseProgressService , AssessmentScoreService } from './services';
import { CoreModule } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import {
  SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule
} from 'ng2-semantic-ui';
import { BatchDetailsComponent,  } from './components/batch/batch-details/batch-details.component';
import { UnEnrollBatchComponent} from './components/batch/unenroll-batch/unenroll-batch.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { AssessmentPlayerComponent } from './components/course-consumption/assessment-player/assessment-player.component';
import { CourseCompletionComponent } from './components/course-consumption/course-completion/course-completion.component';
import { CourseDetailsComponent } from './components/course-consumption/course-details/course-details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
    SuiProgressModule, SuiRatingModule, SuiCollapseModule,
    FormsModule,
    CourseConsumptionRoutingModule,
    CoreModule,
    TelemetryModule,
    PlayerHelperModule,
    CommonConsumptionModule
  ],
  // providers: [CourseConsumptionService, CourseBatchService, CourseProgressService, AssessmentScoreService],
  declarations: [CoursePlayerComponent, CourseConsumptionHeaderComponent, AssessmentPlayerComponent,
    CourseConsumptionPageComponent, BatchDetailsComponent, CurriculumCardComponent, UnEnrollBatchComponent,
    AssessmentPlayerComponent, CourseCompletionComponent, CourseDetailsComponent]
})
export class CourseConsumptionModule { }
