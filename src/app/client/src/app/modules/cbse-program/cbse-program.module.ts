import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from './pipe/sanitize-html.pipe';
import { QuestionListComponent, SelectTextbookComponent, CbseComponent,
  QuestionCreationComponent, ChapterListComponent, McqCreationComponent, McqTemplateSelectionComponent,
  CkeditorToolComponent, QuestionPreviewComponent } from './components';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '@sunbird/shared';
import { QuestionCreationHeaderComponent } from './components/question-creation-header/question-creation-header.component';
import { TextbookListComponent } from './components/textbook-list/textbook-list.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CsvUploadComponent } from './components/csv-upload/csv-upload.component';
import { CertificateModule } from './../certificate/certificate.module';
import { CertificateDashboardComponent } from './components/certificate-dashboard/certificate-dashboard.component';
import { RecursiveTreeComponent } from './components/recursive-tree/recursive-tree.component';
import { ContentUploaderComponent } from './components/content-uploader/content-uploader.component';
import { ResourceTemplateComponent } from './components/resource-template/resource-template.component';
import { DynamicModule } from 'ng-dynamic-component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { CollectionComponent } from './components/collection/collection.component';
import { ResourceReorderComponent } from './components/resource-reorder/resource-reorder.component';
import { CollectionHierarchyService } from './services/collection-hierarchy/collection-hierarchy.service';


@NgModule({
  declarations: [CsvUploadComponent, QuestionListComponent, SelectTextbookComponent, CbseComponent, QuestionCreationComponent,
    ChapterListComponent,
    McqCreationComponent, CkeditorToolComponent ,
    McqTemplateSelectionComponent,
    QuestionPreviewComponent, SanitizeHtmlPipe, QuestionCreationHeaderComponent,
    TextbookListComponent, DashboardComponent, RecursiveTreeComponent,
    ContentUploaderComponent, CertificateDashboardComponent,  ResourceTemplateComponent, CollectionComponent, ResourceReorderComponent],
  imports: [
    CommonModule,
    SuiTabsModule,
    CommonConsumptionModule,
    SuiModule,
    ReactiveFormsModule, FormsModule, SharedModule,
    InfiniteScrollModule,
    PlayerHelperModule,
    TelemetryModule,
    CertificateModule,
    DynamicModule.withComponents([QuestionListComponent, SelectTextbookComponent,
       QuestionCreationComponent, ChapterListComponent,
      McqCreationComponent, CkeditorToolComponent ,
      McqTemplateSelectionComponent,
      QuestionPreviewComponent, QuestionCreationHeaderComponent,
      TextbookListComponent, DashboardComponent, RecursiveTreeComponent, ContentUploaderComponent, ResourceTemplateComponent]),

  ],
  providers: [CollectionHierarchyService],
  exports: [ CbseComponent, SanitizeHtmlPipe ]
})
export class CbseProgramModule { }
