// Angular modules
import { NgModule } from '@angular/core';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
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
  DatasetComponent, MapComponent,FilterComponent
} from './components';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// SB core and shared services
import { SearchService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { OrderModule } from 'ngx-order-pipe';
import { AceEditorModule } from 'ng2-ace-editor';
import { DiscussionModule } from '../discussion/discussion.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    SuiModule,
    SharedModule,
    OrderModule,
    CommonConsumptionModule,
    TelemetryModule,
    NgxDaterangepickerMd.forRoot(),
    AceEditorModule,
    DiscussionModule
  ],
  declarations: [CourseConsumptionComponent, OrganisationComponent, CourseProgressComponent, UsageReportsComponent,
    DataTableComponent, DataChartComponent, ListAllReportsComponent, ReportSummaryComponent, ReportComponent, AddSummaryModalComponent,
    CourseDashboardComponent, ReIssueCertificateComponent, DashboardSidebarComponent, DatasetComponent, MapComponent,FilterComponent],
  exports: [CourseProgressComponent, DataTableComponent],
  providers: [
    RendererService,
    DashboardUtilsService,
    SearchService,
    LineChartService,
    CourseConsumptionService,
    OrganisationService, DownloadService, CourseProgressService, UsageService, ReportService]
})
export class DashboardModule { }
