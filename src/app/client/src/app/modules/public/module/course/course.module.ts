import { CourseRoutingModule } from './course-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgInviewModule } from 'angular-inport';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { CourseComponent, CourseContentComponent } from './components';
import { SuiModule } from 'ng2-semantic-ui';
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
