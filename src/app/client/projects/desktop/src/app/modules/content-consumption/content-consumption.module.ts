import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentConsumptionRoutingModule } from './content-consumption-routing.module';
import { ContentPlayerComponent, ContentMetadataComponent, ResourcePageComponent, TocPageComponent,
  ContentHeaderComponent
 } from './components';


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
    ContentConsumptionRoutingModule
  ],
  exports: [
    ContentPlayerComponent, ContentMetadataComponent
  ]
})
export class ContentConsumptionModule { }
