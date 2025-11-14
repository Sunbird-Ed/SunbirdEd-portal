// Angular modules
import { NgModule } from '@angular/core';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Modules
import { NgChartsModule } from 'ng2-charts';
import { SuiModule } from '@project-sunbird/ng2-semantic-ui';
import { DASHBOARD_ROUTES } from './dashboard-routing.module';
import { TelemetryModule } from '@sunbird/telemetry';
import { DashboardSharedModule } from './dashboard-shared.module';
// Custome component(s) and services
import {
  CourseConsumptionService, DashboardUtilsService, OrganisationService,
  RendererService, LineChartService, DownloadService, CourseProgressService,
  UsageService, ReportService
} from './services';
// Import components directly to avoid circular dependency
import { OrganisationComponent } from './components/organization/organization.component';
import { CourseConsumptionComponent } from './components/course-consumption/course-consumption.component';
import { CourseProgressComponent } from './components/course-progress/course-progress.component';
import { UsageReportsComponent } from './components/usage-reports/usage-reports.component';
// DataTableComponent and FilterComponent are in DashboardSharedModule
import { DataChartComponent } from './components/data-chart/data-chart.component';
import { ReportComponent } from './components/report/report.component';
import { ReportSummaryComponent } from './components/report-summary/report-summary.component';
import { ListAllReportsComponent } from './components/list-all-reports/list-all-reports.component';
import { AddSummaryModalComponent } from './components/add-summary-modal/add-summary-modal.component';
import { CourseDashboardComponent } from './components/course-dashboard/course-dashboard.component';
import { ReIssueCertificateComponent } from './components/re-issue-certificate/re-issue-certificate.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { DatasetComponent } from './components/dataset/dataset.component';
import { MapComponent } from './components/map/map.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// SB core and shared services
import { SearchService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { AceEditorModule } from '@derekbaker/ngx-ace-editor-wrapper';
import { DiscussionModule } from '../discussion/discussion.module';
import { SbTableComponent } from './components/sb-table/sb-table.component';
import { DashletModule } from '@project-sunbird/sb-dashlet';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
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
    MatAutocompleteModule,
    DashboardSharedModule,
    RouterModule.forChild(DASHBOARD_ROUTES)  // Use the exported routes directly
  ],
  declarations: [CourseConsumptionComponent, OrganisationComponent, CourseProgressComponent, UsageReportsComponent,
    DataChartComponent, ListAllReportsComponent, ReportSummaryComponent, ReportComponent, AddSummaryModalComponent,
    CourseDashboardComponent, ReIssueCertificateComponent, DashboardSidebarComponent, DatasetComponent, MapComponent, SbTableComponent],
  exports: [DashboardSharedModule, RouterModule],
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
