import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoResultComponent, SearchFilterComponent, PageSectionComponent,
  TopicPickerComponent, DataDrivenFilterComponent, ViewAllComponent, GlobalSearchFilterComponent, GlobalSearchSelectedFilterComponent } from './components';
import { SharedModule } from '@sunbird/shared';
import {
  SuiModalModule, SuiProgressModule, SuiAccordionModule,
  SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule
} from 'ng2-semantic-ui-v9';
import { TelemetryModule } from '@sunbird/telemetry';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { RouterModule } from '@angular/router';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { TranslateModule } from '@ngx-translate/core';
import { SbSearchFilterModule } from '@project-sunbird/common-form-elements-full';

@NgModule({
  declarations: [NoResultComponent, SearchFilterComponent, PageSectionComponent,
    TopicPickerComponent, DataDrivenFilterComponent, ViewAllComponent, GlobalSearchFilterComponent, GlobalSearchSelectedFilterComponent],
    imports: [
        SharedFeatureModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        TelemetryModule,
        CommonModule,
        CommonConsumptionModule,
        SharedModule,
        TranslateModule,
        SuiModalModule, SuiProgressModule, SuiAccordionModule,
        SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule, SbSearchFilterModule,
    ],
  exports: [NoResultComponent, SearchFilterComponent, PageSectionComponent,
    TopicPickerComponent, DataDrivenFilterComponent, ViewAllComponent, GlobalSearchFilterComponent, GlobalSearchSelectedFilterComponent]
})
export class ContentSearchModule { }
