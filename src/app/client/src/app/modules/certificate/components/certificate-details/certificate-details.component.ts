import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-certificate-details',
  templateUrl: './certificate-details.component.html',
  styleUrls: ['./certificate-details.component.scss']
})
export class CertificateDetailsComponent implements OnInit {
  showSuccessModal: boolean;
  loader: boolean;
  viewCertificate: boolean;
  viewCertificateHtml: boolean;

  constructor() { }
  ngOnInit() {
  }

}
