import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EventViewTypeComponent, EventDetailComponent
} from './components';
import { EventRoutingModule } from './events.routing.module';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgInviewModule } from 'angular-inport';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
  SuiRatingModule, SuiCollapseModule } from 'ng2-semantic-ui-v9';
// import { PublicCourseConsumptionPageComponent,
//   ExploreCourseComponent, PublicCoursePlayerComponent, PublicBatchDetailsComponent } from '../course/components';
import { CourseConsumptionService, CourseBatchService, CourseProgressService } from '@sunbird/learn';
import { FormsModule } from '@angular/forms';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { ContentSearchModule } from '@sunbird/content-search';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v9';
import { EventLibraryModule } from 'ngtek-event-library';
import  * as configData from '../../../../modules/workspace';


// @NgModule({
//   declarations: [],
//   imports: [ ]
// })
// export class EventsModule { }

@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    NgInviewModule,
    EventRoutingModule,
    SharedFeatureModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
    FormsModule,
    PlayerHelperModule,
    ContentSearchModule,
    CommonConsumptionModule,
    EventLibraryModule.forChild(configData),
  ],
  providers: [CourseConsumptionService, CourseBatchService, CourseProgressService],
  declarations: [
    //  PublicCourseConsumptionPageComponent, ExploreCourseComponent,
    // PublicCoursePlayerComponent, PublicBatchDetailsComponent,
     EventViewTypeComponent, EventDetailComponent ]
})
export class EventsModule { 
}
