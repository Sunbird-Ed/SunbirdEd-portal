import { DialCodeSearchRoutingModule } from './dial-code-search.routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgInviewModule } from 'angular-inport';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { SuiModule } from 'ng2-semantic-ui';
import { GetComponent } from './components';
import { DialCodeComponent } from './components';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    NgInviewModule,
    DialCodeSearchRoutingModule,
    SharedFeatureModule,
    SuiModule,
    FormsModule
  ],
  declarations: [ GetComponent, DialCodeComponent]
})
export class DialCodeSearchModule { }
