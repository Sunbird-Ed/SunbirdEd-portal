import { TelemetryModule } from '@sunbird/telemetry';
import { LearnRoutingModule } from './learn-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import { CoursePageComponent } from './components';
import { CoreModule } from '@sunbird/core';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { ContentSearchModule } from '@sunbird/content-search';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v9';

import {
  SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
  SuiRatingModule, SuiCollapseModule
} from 'ng2-semantic-ui-v9';

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
    SuiRatingModule, SuiCollapseModule, CommonConsumptionModule
  ],
  providers: [],
  declarations: [CoursePageComponent]
})
export class LearnModule { }
