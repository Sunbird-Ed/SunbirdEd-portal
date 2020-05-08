import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoResultComponent, SearchFilterComponent, PageSectionComponent, ProminentFilterComponent,
  TopicPickerComponent, DataDrivenFilterComponent, ViewAllComponent } from './components';
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
import { RouterModule } from '@angular/router';
import { SharedFeatureModule } from '@sunbird/shared-feature';

@NgModule({
  declarations: [NoResultComponent, SearchFilterComponent, PageSectionComponent, ProminentFilterComponent,
    TopicPickerComponent, DataDrivenFilterComponent, ViewAllComponent],
  imports: [
    SharedFeatureModule,
    RouterModule,
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
  exports: [NoResultComponent, SearchFilterComponent, PageSectionComponent, ProminentFilterComponent,
    TopicPickerComponent, DataDrivenFilterComponent, ViewAllComponent]
})
export class ContentSearchModule { }
