import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganisationComponent, CourseConsumptionComponent } from './components/';


const routes: Routes = [
  {
    path: 'my-activity', component: CourseConsumptionComponent
  },
  {
    path: 'dashboard/course/consumption/:id/:timePeriod', component: CourseConsumptionComponent
  },
  {
    path: 'org-dashboard', component: OrganisationComponent
  },
  {
    path: 'dashboard/organization/:datasetType/:id/:timePeriod', component: OrganisationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
