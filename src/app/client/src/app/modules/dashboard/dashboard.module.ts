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
  RendererService, LineChartService, DownloadService, CourseProgressService } from './services';
import { OrganisationComponent, CourseConsumptionComponent, CourseProgressComponent } from './components';
// SB core and shared services
import { SearchService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ChartsModule,
    SuiModule,
    SharedModule,
    OrderModule
  ],
  declarations: [CourseConsumptionComponent, OrganisationComponent, CourseProgressComponent],
  providers: [
    RendererService,
    DashboardUtilsService,
    SearchService,
    LineChartService,
    CourseConsumptionService,
    OrganisationService, DownloadService, CourseProgressService]
})
export class DashboardModule { }
