import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule, SuiModalModule} from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { ContentSearchModule } from '@sunbird/content-search';
import { TranslateModule } from '@ngx-translate/core';
import { ReportRoutingModule } from './report-routing.module';
import { SolutionListingComponent,EntityListComponent,ReportViewComponent } from './components';
import {DataTablesModule} from 'angular-datatables';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {DashletModule} from '@project-sunbird/sb-dashlet-v9';
import {SlReportsLibraryModule} from 'sl-reports-library';

@NgModule({
  declarations: [SolutionListingComponent, EntityListComponent, ReportViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    SuiModule,
    SuiModalModule,
    TranslateModule,
    ContentSearchModule,
    SharedFeatureModule,
    NgInviewModule,
    TelemetryModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    SharedFeatureModule,
    ReportRoutingModule,
    DataTablesModule,
    InfiniteScrollModule,
    DashletModule,
    SlReportsLibraryModule
  ],
  providers: []

})
export class ReportModule { }
