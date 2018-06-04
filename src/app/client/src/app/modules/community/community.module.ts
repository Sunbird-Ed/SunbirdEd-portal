import { CommunityListComponent } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import { TelemetryModule } from '@sunbird/telemetry';
@NgModule({
  imports: [
    CommonModule,
    CommunityRoutingModule,
    TelemetryModule
  ],
  declarations: [CommunityListComponent]
})
export class CommunityModule { }
