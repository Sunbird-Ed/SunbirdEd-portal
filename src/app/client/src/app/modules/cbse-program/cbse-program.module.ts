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
import { RecursiveTreeComponent } from './components/recursive-tree/recursive-tree.component';
import { ContentUploaderComponent } from './components/content-uploader/content-uploader.component';
import { ResourceTemplateComponent } from './components/resource-template/resource-template.component';
import { DynamicModule } from 'ng-dynamic-component';

@NgModule({
  declarations: [QuestionListComponent, SelectTextbookComponent, CbseComponent, QuestionCreationComponent, ChapterListComponent,
    McqCreationComponent, CkeditorToolComponent ,
    McqTemplateSelectionComponent,
    QuestionPreviewComponent, SanitizeHtmlPipe, QuestionCreationHeaderComponent,
    TextbookListComponent, DashboardComponent, RecursiveTreeComponent, ContentUploaderComponent, ResourceTemplateComponent],
  imports: [
    CommonModule,
    SuiTabsModule,
    SuiModule,
    ReactiveFormsModule, FormsModule, SharedModule,
    InfiniteScrollModule,
    PlayerHelperModule,
    TelemetryModule,
    DynamicModule.withComponents([QuestionListComponent, SelectTextbookComponent,
       QuestionCreationComponent, ChapterListComponent,
      McqCreationComponent, CkeditorToolComponent ,
      McqTemplateSelectionComponent,
      QuestionPreviewComponent, QuestionCreationHeaderComponent,
      TextbookListComponent, DashboardComponent, RecursiveTreeComponent, ContentUploaderComponent, ResourceTemplateComponent]),

  ],
  exports: [ CbseComponent, SanitizeHtmlPipe ]
})
export class CbseProgramModule { }
