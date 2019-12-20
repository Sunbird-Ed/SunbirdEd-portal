import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentConsumptionRoutingModule } from './content-consumption-routing.module';
import { ContentPlayerComponent, ContentMetadataComponent, ResourcePageComponent, TocPageComponent,
  ContentHeaderComponent
 } from './components';
import { SuiAccordionModule } from 'ng2-semantic-ui';


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
    ContentConsumptionRoutingModule,
    SuiAccordionModule
  ],
  exports: [
    ContentPlayerComponent, ContentMetadataComponent
  ]
})
export class ContentConsumptionModule { }
