import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule , ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewAllComponent } from './components';
import { SlickModule } from 'ngx-slick';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    SlickModule,
    SharedModule,
    CoreModule,
    TelemetryModule,
    NgInviewModule,
    RouterModule
  ],
  declarations: [ViewAllComponent],
  exports: [ViewAllComponent]
})
export class SharedFeatureModule { }
