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
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Search', url: '' }],
      telemetry: {
        env: 'home', pageid: 'home-search', type: 'view', subtype: 'paginate'
      }
    }

  },
  {
    path: 'search/Courses/:pageNumber', component: CourseSearchComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Search', url: '' }],
      telemetry: {
        env: 'course', pageid: 'course-search', type: 'view', subtype: 'paginate'
      }
    }

  },
  {
    path: 'search/Library/:pageNumber', component: LibrarySearchComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Search', url: '' }],
      telemetry: {
        env: 'library', pageid: 'library-search', type: 'view', subtype: 'paginate'
      }
    }

  },
  {
    path: 'search/Users/:pageNumber', component: UserSearchComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'Search', url: '' }],
      telemetry: {
        env: 'profile', pageid: 'user-search', type: 'view', subtype: 'paginate'
      }
    },
    children: [
      {
        path: 'edit/:userId', component: UserEditComponent, data: {
          telemetry: {
            env: 'profile', pageid: 'user-edit', type: 'edit', subtype: 'paginate'
          }
        }
      },
      { path: 'delete/:userId', component: UserDeleteComponent }
    ]
  },
  {
    path: 'search/Users/:pageNumber/view/:userId', component: UserProfileComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }],
      telemetry: {
        env: 'profile', pageid: 'user-detail', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'search/Organisations/:pageNumber', component: OrgSearchComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'Search', url: '' }],
      telemetry: {
        env: 'profile', pageid: 'organization-search', type: 'view', subtype: 'paginate'
      }
    }
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
