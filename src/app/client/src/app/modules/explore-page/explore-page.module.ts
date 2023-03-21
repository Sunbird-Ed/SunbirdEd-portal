import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { ExplorePageRoutingModule } from './explore-page-routing.module';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import {
  SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
  SuiRatingModule, SuiCollapseModule, SuiDimmerModule
} from 'ng2-semantic-ui-v9';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { ContentSearchModule } from '@sunbird/content-search';
import { ExplorePageComponent } from './components';
import { ContentSectionModule } from '@project-sunbird/sb-content-section';
import {ObservationModule} from '../observation/observation.module';

@NgModule({
  declarations: [ExplorePageComponent],
  imports: [
    ExplorePageRoutingModule,
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    SharedFeatureModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule, SuiDimmerModule, WebExtensionModule,
    CommonConsumptionModule, ContentSearchModule, ContentSectionModule, ObservationModule
  ]
})
export class ExplorePageModule { }
