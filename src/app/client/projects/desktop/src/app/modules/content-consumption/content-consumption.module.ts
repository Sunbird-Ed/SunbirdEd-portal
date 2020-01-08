import { PlayerHelperModule } from '@sunbird/player-helper';
import { PublicModule } from '@sunbird/public';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentConsumptionRoutingModule } from './content-consumption-routing.module';
import { ContentPlayerComponent, ContentMetadataComponent, ContentPlayerPageComponent, TocPageComponent,
  ContentHeaderComponent, ContentActionsComponent
 } from './components';
import { SuiAccordionModule, SuiModalModule } from 'ng2-semantic-ui';
import { OrderModule } from 'ngx-order-pipe';
import { TelemetryModule } from '@sunbird/telemetry';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';


@NgModule({
  declarations: [
    ContentPlayerComponent,
    ContentMetadataComponent,
    ContentPlayerPageComponent,
    TocPageComponent,
    ContentHeaderComponent,
    ContentActionsComponent,
  ],
  imports: [
    CommonModule,
    OrderModule,
    SharedModule,
    TelemetryModule,
    ContentConsumptionRoutingModule,
    SuiAccordionModule,
    CommonConsumptionModule,
    SharedModule,
    PublicModule,
    SuiModalModule,
    PlayerHelperModule
  ],
  exports: [
    ContentPlayerComponent, ContentMetadataComponent, ContentPlayerPageComponent
  ],
})
export class ContentConsumptionModule { }
