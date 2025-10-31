import { CourseRoutingModule } from './course-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { PublicCourseConsumptionPageComponent,
  ExploreCourseComponent, PublicCoursePlayerComponent, PublicBatchDetailsComponent } from './components';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
  SuiRatingModule, SuiCollapseModule } from '@project-sunbird/ng2-semantic-ui';
import { CourseConsumptionService, CourseBatchService, CourseProgressService } from '@sunbird/learn';
import { FormsModule } from '@angular/forms';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { ContentSearchModule } from '@sunbird/content-search';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';

@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    CourseRoutingModule,
    SharedFeatureModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
    FormsModule,
    PlayerHelperModule,
    ContentSearchModule,
    CommonConsumptionModule
  ],
  providers: [CourseConsumptionService, CourseBatchService, CourseProgressService],
  declarations: [ PublicCourseConsumptionPageComponent, ExploreCourseComponent,
    PublicCoursePlayerComponent, PublicBatchDetailsComponent ]
})
export class CourseModule { }
