import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CbseComponent, TextbookSearchComponent, QuestionListComponent } from './components';
const routes: Routes = [{
  path: 'cbse', component: CbseComponent
},
{
  path: 'question-list', component: QuestionListComponent
},
{
  path: 'textbook-search', component: TextbookSearchComponent
},
{
  path: 'question-list', component: QuestionListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CbseProgramRoutingModule { }
