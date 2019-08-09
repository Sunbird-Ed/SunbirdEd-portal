import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateRoutingModule } from './certificate-routing.module';
import { CertificateDetailsComponent } from './components/certificate-details/certificate-details.component';
import { SuiModalModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';

@NgModule({
  declarations: [
  CertificateDetailsComponent
],
  imports: [
    CommonModule,
    SuiModalModule,
    CertificateRoutingModule,
    FormsModule,
    SharedModule,
    TelemetryModule
  ]
})
export class CertificateModule { }
