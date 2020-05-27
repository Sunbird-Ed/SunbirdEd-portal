import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { ExploreGroupComponent } from './components';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { GroupRoutingModule } from './group-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    GroupRoutingModule,
    SharedFeatureModule
  ],
  declarations: [ ExploreGroupComponent ],
  exports: []
})
export class GroupModule { }
