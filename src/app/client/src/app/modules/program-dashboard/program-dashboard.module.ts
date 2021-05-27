import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService, ToasterService, SharedModule,SbDatatableComponent } from '@sunbird/shared';
import { programDashboardRoutingModule } from './program-dashboard-routing.module';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { programManagerService } from './services/program-dashboard/program-dashboard'


@NgModule({
  declarations: [
  DatasetsComponent
],
  imports: [
    CommonModule,
    SharedModule,
    SharedFeatureModule,
    SuiModule,
    HttpClientModule,
    TelemetryModule,
    FormsModule,
    ReactiveFormsModule,
    programDashboardRoutingModule,
    NgInviewModule
  ],
  providers: [
    ResourceService,
    ToasterService,
    programManagerService
  ]
})
export class programDashboardModule {

}
