import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  UserSearchComponent, UserEditComponent, UserProfileComponent, HomeSearchComponent,
  UserDeleteComponent, OrgSearchComponent, CourseSearchComponent, LibrarySearchComponent
} from './components';
const routes: Routes = [
  {
    path: 'search/All/:pageNumber', component: HomeSearchComponent

  },
  {
    path: 'search/Courses/:pageNumber', component: CourseSearchComponent
  },
  {
    path: 'search/Library/:pageNumber', component: LibrarySearchComponent

  },
  {
    path: 'search/Users/:pageNumber', component: UserSearchComponent, data: { name: 'Users' },
    children: [
      { path: 'edit/:userId', component: UserEditComponent },
      { path: 'delete/:userId', component: UserDeleteComponent, data: { name: 'Users' } }
    ]
  },
  {
    path: 'search/Users/:pageNumber/view/:userId', component: UserProfileComponent, data: { name: 'Users' }
  },
  {
    path: 'search/Organisations/:pageNumber', component: OrgSearchComponent, data: { name: 'Organisations' }
  },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
