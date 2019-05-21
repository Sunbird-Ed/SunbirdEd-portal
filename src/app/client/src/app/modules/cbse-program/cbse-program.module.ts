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

@NgModule({
  declarations: [QuestionListComponent, SelectTextbookComponent, CbseComponent, QuestionCreationComponent, ChapterListComponent,
    McqCreationComponent, CkeditorToolComponent ,
    McqTemplateSelectionComponent,
    QuestionPreviewComponent, SanitizeHtmlPipe, QuestionCreationHeaderComponent, TextbookListComponent],
  imports: [
    CommonModule,
    SuiTabsModule,
    SuiModule,
    ReactiveFormsModule, FormsModule, SharedModule,
    InfiniteScrollModule
  ],
  exports: [ CbseComponent, SanitizeHtmlPipe ]
})
export class CbseProgramModule { }
