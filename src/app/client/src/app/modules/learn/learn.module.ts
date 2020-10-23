import { TelemetryModule } from '@sunbird/telemetry';
import { LearnRoutingModule } from './learn-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { SharedModule } from '@sunbird/shared';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import { LearnPageComponent, CoursePageComponent } from './components';
import { CoreModule } from '@sunbird/core';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { ContentSearchModule } from '@sunbird/content-search';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
  SuiRatingModule, SuiCollapseModule } from 'ng2-semantic-ui';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SlickModule,
    FormsModule,
    LearnRoutingModule,
    CoreModule,
    TelemetryModule,
    SharedFeatureModule,
    ContentSearchModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
  ],
  providers: [],
  declarations: [LearnPageComponent, CoursePageComponent]
})
export class LearnModule { }
