import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganisationComponent, CourseConsumptionComponent } from './components/';


const routes: Routes = [
  {
    path: 'myActivity', component: CourseConsumptionComponent,
    data: [{label: 'Home', url: '/home'}, {label: 'Profile', url: '/profile'}, {label: 'Organization Admin Dashboard', url: ''}]
  },
  {
    path: 'dashboard/course/consumption/:id/:timePeriod', component: CourseConsumptionComponent,
    data: [{label: 'Home', url: '/home'}, {label: 'Profile', url: '/profile'}, {label: 'Organization Admin Dashboard', url: ''}]
  },
  {
    path: 'orgDashboard', component: OrganisationComponent,
    data: [{label: 'Home', url: '/home'}, {label: 'Profile', url: '/profile'}, {label: 'Organization Admin Dashboard', url: ''}]
  },
  {
    path: 'dashboard/organization/:datasetType/:id/:timePeriod', component: OrganisationComponent,
    data: [{label: 'Home', url: '/home'}, {label: 'Profile', url: '/profile'}, {label: 'Organization Admin Dashboard', url: ''}]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
