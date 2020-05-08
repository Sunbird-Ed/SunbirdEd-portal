import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoResultComponent, SearchFilterComponent, PageSectionComponent } from './components';
import { SharedModule } from '@sunbird/shared';
import {
  SuiModalModule, SuiProgressModule, SuiAccordionModule,
  SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule
} from 'ng2-semantic-ui';
import { TelemetryModule } from '@sunbird/telemetry';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { SlickModule } from 'ngx-slick';

@NgModule({
  declarations: [NoResultComponent, SearchFilterComponent, PageSectionComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TelemetryModule,
    CommonModule,
    SlickModule,
    CommonConsumptionModule,
    SharedModule,
    SuiModalModule, SuiProgressModule, SuiAccordionModule,
  SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule
  ],
  exports: [NoResultComponent, SearchFilterComponent, PageSectionComponent]
})
export class ContentSearchModule { }
