import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganisationComponent, CourseConsumptionComponent, CourseProgressComponent } from './components/';


const routes: Routes = [
  {
    path: 'myActivity', component: CourseConsumptionComponent
  },
  {
    path: 'dashboard/course/consumption/:id/:timePeriod', component: CourseConsumptionComponent
  },
  {
    path: 'orgDashboard', component: OrganisationComponent
  },
  {
    path: 'dashboard/organization/:datasetType/:id/:timePeriod', component: OrganisationComponent
  },
  {
    path: 'dashboard/course/:courseId/:timePeriod', component: CourseProgressComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
