import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentConsumptionRoutingModule } from './content-consumption-routing.module';
import { ContentPlayerComponent, ContentMetadataComponent, ContentPlayerPageComponent, TocPageComponent,
  ContentHeaderComponent
 } from './components';
import { SuiAccordionModule } from 'ng2-semantic-ui';
import { OrderModule } from 'ngx-order-pipe';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { CreditsAndLicenceComponent } from './components/credits-and-licence/credits-and-licence.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';


@NgModule({
  declarations: [
    ContentPlayerComponent,
    ContentMetadataComponent,
    ContentPlayerPageComponent,
    TocPageComponent,
    ContentHeaderComponent,
    CreditsAndLicenceComponent
  ],
  imports: [
    CommonModule,
    OrderModule,
    SharedModule,
    TelemetryModule,
    ContentConsumptionRoutingModule,
    SuiAccordionModule,
    CommonConsumptionModule
  ],
  exports: [
    ContentPlayerComponent, ContentMetadataComponent, ContentPlayerPageComponent
  ],
})
export class ContentConsumptionModule { }
