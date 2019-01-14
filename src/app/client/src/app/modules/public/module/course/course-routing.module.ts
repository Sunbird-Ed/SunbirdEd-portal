import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicCourseComponent, ExploreCourseComponent, PublicCoursePlayerComponent,
  PublicCourseConsumptionPageComponent } from './components';
import {ViewAllComponent} from '@sunbird/shared-feature';
const routes: Routes = [
    {
      path: '', component: PublicCourseComponent, data: {
        telemetry: {
          env: 'explore-course', pageid: 'explore-course', type: 'view', subtype: 'paginate'
        }
      }
    },
    {
      path: 'view-all/:section/:pageNumber', component: ViewAllComponent,
      data: {
        telemetry: {
          env: 'explore-course', pageid: 'explore-view-all', type: 'view', subtype: 'paginate'
        },
        filterType: 'explore-course',
        frameworkName: true,
        formAction: 'filter'
      }
    },
    {
      path: ':pageNumber', component: ExploreCourseComponent, data: {
        telemetry: {
          env: 'explore-course', pageid: 'explore-course-search', type: 'view', subtype: 'paginate'
        }
      }
    },
    {
      path: 'course', component: PublicCourseConsumptionPageComponent,
      data: { telemetry: { env: 'explore', pageid: 'explore-course-toc', type: 'view'} },
      children: [
        {
          path: ':courseId', component: PublicCoursePlayerComponent,
          data: {
            telemetry: {
              env: 'explore-course', pageid: 'explore-course-toc', type: 'view'
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
