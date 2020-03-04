import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent } from './components';
import { SharedModule } from '@sunbird/shared';
import {
  SuiModalModule, SuiProgressModule, SuiAccordionModule,
  SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule
} from 'ng2-semantic-ui';
import { TelemetryModule } from '@sunbird/telemetry';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';

@NgModule({
  declarations: [NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TelemetryModule,
    CommonModule,
    CommonConsumptionModule,
    SharedModule,
    SuiModalModule, SuiProgressModule, SuiAccordionModule,
  SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule
  ],
  exports: [NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent]
})
export class ContentSearchModule { }
