import { DialCodeSearchRoutingModule } from './dial-code-search.routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { GetComponent, DialCodeComponent, DialCodeCardComponent } from './components';
import { FormsModule } from '@angular/forms';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';

@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    DialCodeSearchRoutingModule,
    FormsModule,
    PlayerHelperModule,
    SharedFeatureModule,
    CommonConsumptionModule
  ],
  declarations: [ GetComponent, DialCodeComponent, DialCodeCardComponent]
})
export class DialCodeSearchModule { }
