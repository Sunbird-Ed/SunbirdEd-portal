import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsoRoutingModule } from './sso-routing.module';
import {SelectOrgComponent, UpdateContactComponent, AuthFailedComponent} from './components';
import {TelemetryModule} from '@sunbird/telemetry';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';

@NgModule({
  imports: [
    CommonModule,
    SsoRoutingModule,
    SuiModule,
    TelemetryModule,
    SharedFeatureModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [SelectOrgComponent, UpdateContactComponent, AuthFailedComponent]
})
export class SsoModule { }
