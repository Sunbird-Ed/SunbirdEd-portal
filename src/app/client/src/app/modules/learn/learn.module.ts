import { TelemetryModule } from '@sunbird/telemetry';
import { LearnRoutingModule } from './learn-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { SharedModule } from '@sunbird/shared';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import { LearnPageComponent } from './components/learn-page/learn-page.component';
import { CoreModule } from '@sunbird/core';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { ContentSearchModule } from '@sunbird/content-search';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SlickModule,
    FormsModule,
    LearnRoutingModule,
    CoreModule,
    TelemetryModule,
    SharedFeatureModule,
    ContentSearchModule
  ],
  providers: [],
  declarations: [LearnPageComponent]
})
export class LearnModule { }
