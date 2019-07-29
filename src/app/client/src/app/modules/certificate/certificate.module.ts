import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateRoutingModule } from './certificate-routing.module';
import { CertificateDetailsComponent } from './components/certificate-details/certificate-details.component';
import { SuiModalModule } from 'ng2-semantic-ui';

@NgModule({
  declarations: [
  CertificateDetailsComponent
],
  imports: [
    CommonModule,
    SuiModalModule,
    CertificateRoutingModule
  ]
})
export class CertificateModule { }
