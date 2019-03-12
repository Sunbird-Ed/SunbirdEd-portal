import { ResourceRoutingModule } from './resource-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceComponent, CollectionPlayerComponent, ContentPlayerComponent } from './components';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@sunbird/core';
import { SharedPlayerModule } from '@sunbird/shared-player';
import { NotesModule } from '@sunbird/notes';
import { BadgingModule } from '@sunbird/badge';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import {SharedFeatureModule} from '@sunbird/shared-feature';
@NgModule({
  imports: [
    CommonModule,
    ResourceRoutingModule,
    SharedModule,
    SuiModule,
    SlickModule,
    FormsModule,
    CoreModule,
    SharedPlayerModule,
    NotesModule,
    BadgingModule,
    TelemetryModule,
    NgInviewModule,
    SharedFeatureModule
  ],
  declarations: [ResourceComponent, CollectionPlayerComponent, ContentPlayerComponent]
})
export class ResourceModule {
  }
