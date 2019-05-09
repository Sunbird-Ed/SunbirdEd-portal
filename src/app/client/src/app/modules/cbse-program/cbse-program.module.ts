import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionListComponent, SelectTextbookComponent, CbseComponent,
  QuestionCreationComponent, ChapterListComponent } from './components';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { McqCreationComponent } from './components/mcq-creation/mcq-creation.component';
@NgModule({
  declarations: [QuestionListComponent, SelectTextbookComponent, CbseComponent, QuestionCreationComponent, ChapterListComponent,
    McqCreationComponent],
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
