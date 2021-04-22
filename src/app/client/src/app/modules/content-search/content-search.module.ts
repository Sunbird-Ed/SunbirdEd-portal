import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoResultComponent, SearchFilterComponent, PageSectionComponent, ProminentFilterComponent,
  TopicPickerComponent, DataDrivenFilterComponent, ViewAllComponent, GlobalSearchFilterComponent, GlobalSearchSelectedFilterComponent } from './components';
import { SharedModule } from '@sunbird/shared';
import {
  SuiModalModule, SuiProgressModule, SuiAccordionModule,
  SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule
} from 'ng2-semantic-ui';
import { TelemetryModule } from '@sunbird/telemetry';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { SlickModule } from 'ngx-slick';
import { RouterModule } from '@angular/router';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { TranslateModule } from '@ngx-translate/core';
import { SbSearchFilterModule } from 'common-form-elements';

@NgModule({
  declarations: [NoResultComponent, SearchFilterComponent, PageSectionComponent, ProminentFilterComponent,
    TopicPickerComponent, DataDrivenFilterComponent, ViewAllComponent, GlobalSearchFilterComponent, GlobalSearchSelectedFilterComponent],
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
        TranslateModule,
        SuiModalModule, SuiProgressModule, SuiAccordionModule,
        SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule, SbSearchFilterModule,
    ],
  exports: [NoResultComponent, SearchFilterComponent, PageSectionComponent, ProminentFilterComponent,
    TopicPickerComponent, DataDrivenFilterComponent, ViewAllComponent, GlobalSearchFilterComponent, GlobalSearchSelectedFilterComponent]
})
export class ContentSearchModule { }
