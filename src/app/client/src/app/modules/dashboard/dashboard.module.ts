// Angular modules
import { NgModule } from '@angular/core';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Modules
import { ChartsModule } from 'ng2-charts';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { TelemetryModule } from '@sunbird/telemetry';
// Custome component(s) and services
import {
  CourseConsumptionService, DashboardUtilsService, OrganisationService,
  RendererService, LineChartService, DownloadService, CourseProgressService,
  UsageService, ReportService
} from './services';
import {
  OrganisationComponent, CourseConsumptionComponent, CourseProgressComponent, UsageReportsComponent,
  DataTableComponent, DataChartComponent, ReportComponent, ReportSummaryComponent, ListAllReportsComponent,
  AddSummaryModalComponent, CourseDashboardComponent, ReIssueCertificateComponent, DashboardSidebarComponent,
  DatasetComponent, MapComponent, FilterComponent
} from './components';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// SB core and shared services
import { SearchService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { AceEditorModule } from '@derekbaker/ngx-ace-editor-wrapper';
import { DiscussionModule } from '../discussion/discussion.module';
import { SbTableComponent } from './components/sb-table/sb-table.component';
import { DashletModule } from '@project-sunbird/sb-dashlet';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';



@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    SuiModule,
    SharedModule,
    CommonConsumptionModule,
    TelemetryModule,
    NgxDaterangepickerMd.forRoot(),
    AceEditorModule,
    DiscussionModule,
    DashletModule.forRoot(),
    MatCheckboxModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    SharedFeatureModule,
    MatAutocompleteModule
  ],
  declarations: [CourseConsumptionComponent, OrganisationComponent, CourseProgressComponent, UsageReportsComponent,
    DataTableComponent, DataChartComponent, ListAllReportsComponent, ReportSummaryComponent, ReportComponent, AddSummaryModalComponent,
    CourseDashboardComponent, ReIssueCertificateComponent, DashboardSidebarComponent, DatasetComponent, MapComponent, FilterComponent, SbTableComponent],
  exports: [CourseProgressComponent, DataTableComponent,FilterComponent],
  providers: [
    RendererService,
    DashboardUtilsService,
    SearchService,
    LineChartService,
    CourseConsumptionService,
    OrganisationService, DownloadService, CourseProgressService, UsageService, ReportService,
    { provide: MAT_DIALOG_DATA, useValue: {}}
  ]
})
export class DashboardModule { }
