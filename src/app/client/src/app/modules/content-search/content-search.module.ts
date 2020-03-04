import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent } from './components';
import { SharedModule } from '@sunbird/shared';
import {
  SuiModalModule, SuiProgressModule, SuiAccordionModule,
  SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule
} from 'ng2-semantic-ui';
import { TelemetryModule } from '@sunbird/telemetry';

@NgModule({
  declarations: [NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent],
  imports: [
    TelemetryModule,
    CommonModule,
    SharedModule,
    SuiModalModule, SuiProgressModule, SuiAccordionModule,
  SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule
  ],
  exports: [NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent]
})
export class ContentSearchModule { }
