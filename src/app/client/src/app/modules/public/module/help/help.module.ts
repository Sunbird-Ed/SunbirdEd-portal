import { HelpRoutingModule } from './help-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent } from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';

@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    HelpRoutingModule,
    CommonConsumptionModule
  ],
  declarations: [FaqComponent],
  exports: [FaqComponent]
})
export class HelpModule { }
