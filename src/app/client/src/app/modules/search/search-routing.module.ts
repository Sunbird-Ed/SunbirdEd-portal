import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  UserSearchComponent, UserEditComponent, UserProfileComponent, HomeSearchComponent,
  UserDeleteComponent, OrgSearchComponent, CourseSearchComponent, LibrarySearchComponent
} from './components';
const routes: Routes = [
  {
    path: 'search/All/:pageNumber', component: HomeSearchComponent,
  data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Search', url: '' }] }

  },
  {
    path: 'search/Courses/:pageNumber', component: CourseSearchComponent,
    data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Search', url: '' }] }

  },
  {
    path: 'search/Library/:pageNumber', component: LibrarySearchComponent,
    data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Search', url: '' }] }

  },
  {
    path: 'search/Users/:pageNumber', component: UserSearchComponent,
    data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'Search', url: '' }] },
    children: [
      { path: 'edit/:userId', component: UserEditComponent },
      { path: 'delete/:userId', component: UserDeleteComponent }
    ]
  },
  {
    path: 'search/Users/:pageNumber/view/:userId', component: UserProfileComponent,
    data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }] }
  },
  {
    path: 'search/Organisations/:pageNumber', component: OrgSearchComponent,
    data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'Search', url: '' }] }
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
