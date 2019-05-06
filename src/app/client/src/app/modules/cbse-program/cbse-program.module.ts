import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CbseProgramRoutingModule } from './cbse-program-routing.module';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { TextbookSearchComponent } from './components/textbook-search/textbook-search.component';
import { CbseComponent } from './components/cbse/cbse.component';

@NgModule({
  declarations: [QuestionListComponent, TextbookSearchComponent, CbseComponent],
  imports: [
    CommonModule,
    CbseProgramRoutingModule
  ]
})
export class CbseProgramModule { }
