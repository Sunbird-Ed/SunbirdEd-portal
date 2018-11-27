import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseComponent, CourseContentComponent  } from './components';
import {ViewAllComponent} from '@sunbird/shared-feature';
const routes: Routes = [
  {
    path: '', component: CourseComponent, data: {
      telemetry: {
        env: 'public', pageid: 'explore-course', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'view-all/:section/:pageNumber', component: ViewAllComponent,
    data: {
      telemetry: {
        env: 'public', pageid: 'view-all', type: 'view', subtype: 'paginate'
      },
      filterType: 'explore',
      softConstraints: {badgeAssertions: 98, board: 99, channel: 100}
    }
  },
    {
      path: ':pageNumber', component: CourseContentComponent, data: {
        telemetry: {
          env: 'public', pageid: 'explore-course-search', type: 'view', subtype: 'paginate'
        }
      }
    }
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CourseRoutingModule { }
