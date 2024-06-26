import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule, SuiModalModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { TranslateModule } from '@ngx-translate/core';
import { ReportRoutingModule } from './report-routing.module';
import { SolutionListingComponent, EntityListComponent, ReportViewComponent, AllEvidenceComponent } from './components';
import { DataTablesModule } from 'angular-datatables';
import { DashletModule } from '@project-sunbird/sb-dashlet';
import { SlReportsLibraryModule } from '@shikshalokam/sl-reports-library';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [SolutionListingComponent, EntityListComponent, ReportViewComponent, AllEvidenceComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    SuiModule,
    SuiModalModule,
    TranslateModule,
    SharedFeatureModule,
    TelemetryModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    SharedFeatureModule,
    ReportRoutingModule,
    DataTablesModule,
    DashletModule.forRoot(),
    SlReportsLibraryModule,
    MatTabsModule
  ],
  providers: []

})
export class ReportModule { }
