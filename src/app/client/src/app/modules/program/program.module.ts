import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramRoutingModule } from './program-routing.module';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { ProgramComponent} from './component';
import {  } from './service/index';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';

@NgModule({
  imports: [
    SuiModule,
    CommonModule,
    ProgramRoutingModule,
    SlickModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    NgInviewModule,
    TelemetryModule
  ],
  declarations: [
    ProgramComponent,
  ],
  providers: []
})
export class ProgramModule {
}
