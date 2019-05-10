import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionListComponent, SelectTextbookComponent, CbseComponent,
  QuestionCreationComponent, ChapterListComponent, McqCreationComponent, McqTemplateSelectionComponent } from './components';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [QuestionListComponent, SelectTextbookComponent, CbseComponent, QuestionCreationComponent, ChapterListComponent,
    McqCreationComponent,
    McqTemplateSelectionComponent],
  imports: [
    CommonModule,
    SuiTabsModule,
    SuiModule,
    ReactiveFormsModule, FormsModule,
    InfiniteScrollModule
  ],
  exports: [ CbseComponent ]
})
export class CbseProgramModule { }
