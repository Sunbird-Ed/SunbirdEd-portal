import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { programDashboardRoutingModule } from './program-dashboard-routing.module';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { DatasetsComponent } from './components/program-datasets/program-datasets.component';


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
    ToasterService
  ]
})
export class programDashboardModule {

}
