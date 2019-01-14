import { CourseRoutingModule } from './course-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgInviewModule } from 'angular-inport';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { PublicCourseComponent, PublicCourseConsumptionPageComponent,
  ExploreCourseComponent, PublicCoursePlayerComponent, PublicBatchDetailsComponent } from './components';
import { SuiModule } from 'ng2-semantic-ui';
import { CourseConsumptionService, CourseBatchService, CourseProgressService } from '@sunbird/learn';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    NgInviewModule,
    CourseRoutingModule,
    SharedFeatureModule,
    SuiModule,
    FormsModule
  ],
  providers: [CourseConsumptionService, CourseBatchService, CourseProgressService],
  declarations: [ PublicCourseComponent, PublicCourseConsumptionPageComponent, ExploreCourseComponent,
    PublicCoursePlayerComponent, PublicBatchDetailsComponent ]
})
export class CourseModule { }
