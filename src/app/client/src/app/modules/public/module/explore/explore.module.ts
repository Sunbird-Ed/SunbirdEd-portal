import { ExploreRoutingModule } from './explore-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreContentComponent, ExploreCurriculumCoursesComponent} from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
  SuiRatingModule, SuiCollapseModule, SuiDimmerModule } from 'ng2-semantic-ui-v9';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { ContentSearchModule } from '@sunbird/content-search';

@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    ExploreRoutingModule,
    SharedFeatureModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule, SuiDimmerModule, WebExtensionModule,
    CommonConsumptionModule, ContentSearchModule
  ],
  declarations: [ ExploreContentComponent, ExploreCurriculumCoursesComponent]
})
export class ExploreModule { }
