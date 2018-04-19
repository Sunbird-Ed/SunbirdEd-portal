import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CourseSearchComponent } from './components';
const routes: Routes = [
  {
    path: 'search/Courses/:pageNumber', component: CourseSearchComponent

  }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
