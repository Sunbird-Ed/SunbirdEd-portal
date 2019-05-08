import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CbseProgramRoutingModule } from './cbse-program-routing.module';
import { QuestionListComponent, TextbookSearchComponent, CbseComponent,
  QuestionCreationComponent, ChapterListComponent } from './components';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@NgModule({
  declarations: [QuestionListComponent, TextbookSearchComponent, CbseComponent, QuestionCreationComponent, ChapterListComponent],
  imports: [
    CommonModule,
    CbseProgramRoutingModule,
    SuiTabsModule,
    SuiModule,
    ReactiveFormsModule, FormsModule,
    InfiniteScrollModule
  ],
  exports: [ CbseComponent ]
})
export class CbseProgramModule { }
