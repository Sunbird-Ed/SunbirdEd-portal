import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganisationComponent, CourseConsumptionComponent, CourseProgressComponent } from './components/';

const routes: Routes = [
  {
    path: 'myActivity', component: CourseConsumptionComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Course Creator Dashboard', url: '' }]
    }
  },
  {
    path: 'dashboard/course/consumption/:id/:timePeriod', component: CourseConsumptionComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Organization Admin Dashboard', url: '' }]
    }
  },
  {
    path: 'orgDashboard', component: OrganisationComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Organization Admin Dashboard', url: '' }]
    }
  },
  {
    path: 'dashboard/organization/:datasetType/:id/:timePeriod', component: OrganisationComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Organization Admin Dashboard', url: '' }]
    }
  },
  {
    path: 'dashboard/:courseId', component: CourseProgressComponent,
    children: [
      { path: 'dashboard', component: CourseProgressComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
