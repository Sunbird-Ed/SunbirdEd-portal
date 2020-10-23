import { LearnPageComponent } from './components/learn-page/learn-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedirectComponent } from './../shared/components/redirect/redirect.component';
import { ViewAllComponent } from '@sunbird/content-search';

const telemetryEnv = 'Course';
const objectType = 'Course';
const routes: Routes = [
  {
    path: '', loadChildren: '../public/module/course/course.module#CourseModule',
    data: {
      routeReuse: {
        reuse: true,
        path: 'learn'
      },
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '' }],
      telemetry: { env: telemetryEnv, pageid: 'learn', type: 'view', subtype: 'paginate' },
      baseUrl: 'learn'
    }
  },
  {
    path: 'redirect', component: RedirectComponent,
    data: {
      telemetry: { env: telemetryEnv, pageid: 'learn-redirect', type: 'view' }
    }
  },
  {
    path: 'view-all/:section/:pageNumber', component: ViewAllComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '/learn' }],
      telemetry: {
        env: telemetryEnv, pageid: 'view-all', type: 'view', subtype: 'paginate'
      },
      baseUrl: 'learn',
      filterType: 'courses',
      facets: true,
      frameworkName: true,
      formAction: 'filter'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }
