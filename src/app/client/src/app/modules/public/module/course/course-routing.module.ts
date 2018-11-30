import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseComponent, ExploreCourseComponent  } from './components';
import {ViewAllComponent} from '@sunbird/shared-feature';
const routes: Routes = [
  {
    path: '', component: CourseComponent, data: {
      telemetry: {
        env: 'explore', pageid: 'explore-course', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'view-all/:section/:pageNumber', component: ViewAllComponent,
    data: {
      telemetry: {
        env: 'explore', pageid: 'explore-view-all', type: 'view', subtype: 'paginate'
      },
      filterType: 'explore',
      anounymousUser: true

    }
  },
    {
      path: ':pageNumber', component: ExploreCourseComponent, data: {
        telemetry: {
          env: 'explore', pageid: 'explore-course-search', type: 'view', subtype: 'paginate'
        }
      }
    }
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CourseRoutingModule { }
