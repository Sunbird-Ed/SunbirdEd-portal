import { CourseRoutingModule } from './course-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgInviewModule } from 'angular-inport';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { CourseComponent } from './components/course/course.component';
import { SuiModule } from 'ng2-semantic-ui';
import { CourseContentComponent } from './components/course-content/course-content.component';

@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    NgInviewModule,
    CourseRoutingModule,
    SharedFeatureModule,
    SuiModule
  ],
  declarations: [ CourseComponent, CourseContentComponent]
})
export class CourseModule { }
