// Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Modules
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SuiModule } from 'ng2-semantic-ui';
import { DashboardRoutingModule } from './dashboard-routing.module';
// Custome component(s) and services
import { CourseConsumptionService, DashboardUtilsService, OrganisationService,
  RendererService, LineChartService, DownloadService } from './services';
import { OrganisationComponent, CourseConsumptionComponent } from './components';
// SB core and shared services
import { SearchService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ChartsModule,
    SuiModule,
    SharedModule
  ],
  declarations: [CourseConsumptionComponent, OrganisationComponent],
  providers: [
    RendererService,
    DashboardUtilsService,
    SearchService,
    LineChartService,
    CourseConsumptionService,
    OrganisationService, DownloadService]
})
export class DashboardModule { }
