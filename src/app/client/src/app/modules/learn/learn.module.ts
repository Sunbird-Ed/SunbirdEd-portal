import { TelemetryModule } from '@sunbird/telemetry';
import { LearnRoutingModule } from './learn-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { NgInviewModule } from 'angular-inport';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LearnPageComponent, CoursePlayerComponent, CourseConsumptionHeaderComponent,
  CourseConsumptionPageComponent, BatchDetailsComponent, EnrollBatchComponent, CreateBatchComponent,
  UpdateCourseBatchComponent, CarriculumCardComponent, PreviewCourseComponent  } from './components';
import { CourseConsumptionService, CourseBatchService, CourseProgressService } from './services';
import { CoreModule } from '@sunbird/core';
import { NotesModule } from '@sunbird/notes';
import { DashboardModule } from '@sunbird/dashboard';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SuiModule,
    DashboardModule,
    SlickModule,
    FormsModule,
    LearnRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    NotesModule,
    TelemetryModule,
    NgInviewModule,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatCardModule
  ],
  providers: [CourseConsumptionService, CourseBatchService, CourseProgressService],
  declarations: [LearnPageComponent, CoursePlayerComponent, CourseConsumptionHeaderComponent,
    CourseConsumptionPageComponent, BatchDetailsComponent, EnrollBatchComponent, CreateBatchComponent,
    UpdateCourseBatchComponent, CarriculumCardComponent, PreviewCourseComponent]
})
export class LearnModule { }
