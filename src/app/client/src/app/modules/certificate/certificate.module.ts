import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateRoutingModule } from './certificate-routing.module';
import { CertificateDetailsComponent } from './components/certificate-details/certificate-details.component';

@NgModule({
  declarations: [
  CertificateDetailsComponent
],
  imports: [
    CommonModule,
    CertificateRoutingModule
  ]
})
export class CertificateModule { }
