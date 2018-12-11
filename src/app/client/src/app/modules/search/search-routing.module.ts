import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  UserSearchComponent, UserEditComponent, UserProfileComponent, HomeSearchComponent,
  UserDeleteComponent, OrgSearchComponent, CourseSearchComponent, LibrarySearchComponent
} from './components';
import { CatalogComponent } from './components/catalog/catalog.component';
const routes: Routes = [
  {
    path: 'All/:pageNumber', component: HomeSearchComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Search', url: '' }],
      telemetry: {
        env: 'home', pageid: 'home-search', type: 'view', subtype: 'paginate'
      }
    }

  },
  {
    path: 'catalog/:pageNumber', component: CatalogComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Catalog', url: '' }],
      telemetry: {
        env: 'catalog', pageid: 'course-catalog', type: 'view', subtype: 'paginate'
      }
    }

  },
  {
    path: 'Courses/:pageNumber', component: CourseSearchComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Search', url: '' }],
      telemetry: {
        env: 'course', pageid: 'course-search', type: 'view', subtype: 'paginate'
      }
    }

  },
  {
    path: 'Library/:pageNumber', component: LibrarySearchComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Search', url: '' }],
      telemetry: {
        env: 'library', pageid: 'library-search', type: 'view', subtype: 'paginate'
      }
    }

  },
  {
    path: 'Users/:pageNumber', component: UserSearchComponent,
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
    path: 'Users/:pageNumber/view/:userId', component: UserProfileComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }],
      telemetry: {
        env: 'profile', pageid: 'user-detail', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'Organisations/:pageNumber', component: OrgSearchComponent,
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
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
