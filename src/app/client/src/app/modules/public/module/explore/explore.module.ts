import { ExploreRoutingModule } from './explore-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreContentComponent} from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgInviewModule } from 'angular-inport';
import { ExploreComponent } from './components/explore/explore.component';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
  SuiRatingModule, SuiCollapseModule, SuiDimmerModule } from 'ng2-semantic-ui';
import { WebExtensionModule } from '@project-sunbird/web-extensions';

@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    NgInviewModule,
    ExploreRoutingModule,
    SharedFeatureModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule, SuiDimmerModule, WebExtensionModule
  ],
  declarations: [ ExploreContentComponent, ExploreComponent],
  exports: [ExploreComponent]
})
export class ExploreModule { }
