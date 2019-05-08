import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CbseProgramRoutingModule } from './cbse-program-routing.module';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { TextbookSearchComponent } from './components/textbook-search/textbook-search.component';
import { CbseComponent } from './components/cbse/cbse.component';
import { SuiTabsModule } from 'ng2-semantic-ui';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { QuestionCreationComponent } from './components/question-creation/question-creation.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ChapterListComponent } from './components/chapter-list/chapter-list.component';
@NgModule({
  declarations: [QuestionListComponent, TextbookSearchComponent, CbseComponent, QuestionCreationComponent,
    ChapterListComponent, QuestionListComponent],
  imports: [
    CommonModule,
    CbseProgramRoutingModule,
    SuiTabsModule,
    SuiModule,
    ReactiveFormsModule, FormsModule,
    InfiniteScrollModule
  ]
})
export class CbseProgramModule { }
