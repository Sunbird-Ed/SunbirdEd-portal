import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from '@project-sunbird/ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { programDashboardRoutingModule } from './program-dashboard-routing.module';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { DatasetsComponent } from './components/program-datasets/program-datasets.component';
import { DashletModule } from '@project-sunbird/sb-dashlet';
import { DashboardSharedModule } from '../dashboard/dashboard-shared.module';
import { BigDataPipe } from './pipes/bigData/big-data.pipe';
import { ChartTypePipe } from './pipes/chartType/chart-type.pipe';
import { SbChartComponent } from './shared/sb-chart/sb-chart.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FilterChartPipe } from './pipes/filterChart/filter-chart.pipe';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SbBignumberComponent } from './shared/sb-bignumber/sb-bignumber.component';
import { SbTableComponent } from './shared/sb-table/sb-table.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { PdFiltersComponent } from './shared/pd-filters/pd-filters.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateValidatorDirective } from './shared/directives/date-validator/date-validator.directive';

const TIME_RANGE_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // To parse date from input in this format
  },
  display: {
    dateInput: 'DD/MM/YYYY', // To display date from input in this format
    monthYearLabel: 'MMM YYYY', // To display lable in this format as datepicker header
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY',
  },
};
@NgModule({
  declarations: [
  DatasetsComponent,
  BigDataPipe,
  ChartTypePipe,
  SbChartComponent,
  FilterChartPipe,
  SbBignumberComponent,
  SbTableComponent,
  PdFiltersComponent,
  DateValidatorDirective
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedFeatureModule,
    SuiModule,
    HttpClientModule,
    TelemetryModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    programDashboardRoutingModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatAutocompleteModule,
    DashletModule,
    DashboardSharedModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    ResourceService,
    ToasterService,
    BigDataPipe,
    ChartTypePipe,
    FilterChartPipe,
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
      },
      { provide: MAT_DATE_FORMATS, useValue: TIME_RANGE_DATE_FORMAT},
  ]
})
export class programDashboardModule {

}
