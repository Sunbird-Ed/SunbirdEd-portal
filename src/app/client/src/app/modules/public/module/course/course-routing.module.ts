import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ExploreCourseComponent, PublicCoursePlayerComponent,
  PublicCourseConsumptionPageComponent
} from './components';
import { ViewAllComponent } from '@sunbird/content-search';
const routes: Routes = [
  {
    path: '', loadChildren: '../../../learn/learn.module#LearnModule'
  },
  {
    path: 'view-all/:section/:pageNumber', component: ViewAllComponent,
    data: {
      telemetry: {
        env: 'explore-course', pageid: 'explore-view-all', type: 'view', subtype: 'paginate'
      },
      filterType: 'explore-course',
      frameworkName: true,
      formAction: 'filter',
      facets: true
    }
  },
  {
    path: ':pageNumber', component: ExploreCourseComponent, data: {
      telemetry: {
        env: 'explore-course', pageid: 'explore-course-search', type: 'view', subtype: 'paginate'
      },
      softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }
    }
  },
  {
    path: 'course', component: PublicCourseConsumptionPageComponent,
    data: { telemetry: { env: 'explore', pageid: 'explore-course-toc', type: 'view' } },
    children: [
      {
        path: ':courseId', component: PublicCoursePlayerComponent,
        data: {
          telemetry: {
            env: 'explore-course-toc', pageid: 'explore-course-toc', type: 'view'
          }
        },
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
