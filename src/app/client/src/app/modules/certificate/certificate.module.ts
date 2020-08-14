import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateRoutingModule } from './certificate-routing.module';
import { SuiModalModule, SuiSelectModule, SuiDropdownModule, SuiPopupModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { CertificateConfigurationComponent, CertificateDetailsComponent} from './components';

@NgModule({
  declarations: [
  CertificateDetailsComponent,
  CertificateConfigurationComponent
],
  imports: [
    CommonModule,
    SuiModalModule,
    CertificateRoutingModule,
    FormsModule,
    SharedModule,
    TelemetryModule,
    PlayerHelperModule,
    SuiSelectModule,
    SuiDropdownModule,
    SuiPopupModule,
    ReactiveFormsModule
  ]
})
export class CertificateModule { }
