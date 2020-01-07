import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentConsumptionRoutingModule } from './content-consumption-routing.module';
import { ContentPlayerComponent, ContentMetadataComponent, ResourcePageComponent, TocPageComponent,
  ContentHeaderComponent
 } from './components';
import { SuiAccordionModule } from 'ng2-semantic-ui';
import { OrderModule } from 'ngx-order-pipe';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';


@NgModule({
  declarations: [
    ContentPlayerComponent,
    ContentMetadataComponent,
    ResourcePageComponent,
    TocPageComponent,
    ContentHeaderComponent
  ],
  imports: [
    CommonModule,
    OrderModule,
    SharedModule,
    TelemetryModule,
    ContentConsumptionRoutingModule,
    SuiAccordionModule
  ],
  exports: [
    ContentPlayerComponent, ContentMetadataComponent, ResourcePageComponent
  ],
})
export class ContentConsumptionModule { }
