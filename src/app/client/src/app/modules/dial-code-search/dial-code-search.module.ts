import { DialCodeSearchRoutingModule } from './dial-code-search.routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgInviewModule } from 'angular-inport';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
  SuiRatingModule, SuiCollapseModule, SuiDimmerModule } from 'ng2-semantic-ui';
import { GetComponent, DialCodeComponent, DialCodeCardComponent } from './components';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';

@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    NgInviewModule,
    DialCodeSearchRoutingModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule, SuiDimmerModule,
    SuiRatingModule, SuiCollapseModule,
    FormsModule,
    InfiniteScrollModule,
    PlayerHelperModule,
    SharedFeatureModule,
    CommonConsumptionModule
  ],
  declarations: [ GetComponent, DialCodeComponent, DialCodeCardComponent]
})
export class DialCodeSearchModule { }
