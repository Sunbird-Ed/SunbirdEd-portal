import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-certificate-details',
  templateUrl: './certificate-details.component.html',
  styleUrls: ['./certificate-details.component.scss']
})
export class CertificateDetailsComponent implements OnInit {
  showSuccessModal: boolean;
  loader: boolean;
  error: boolean;
  viewCertificate: boolean;
  viewCertificateHtml: boolean;

  constructor() { }
  ngOnInit() {
  }

}
