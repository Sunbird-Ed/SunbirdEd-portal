import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CbseComponent, QuestionListComponent, TextbookSearchComponent } from './components';
const routes: Routes = [{
  path: 'cbse', component: CbseComponent
},
{
  path: 'question-list', component: QuestionListComponent
},
{
  path: 'textbook-search', component: TextbookSearchComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CbseProgramRoutingModule { }
