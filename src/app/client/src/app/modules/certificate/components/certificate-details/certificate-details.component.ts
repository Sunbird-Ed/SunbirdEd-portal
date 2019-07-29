import { Component, OnInit } from '@angular/core';
import { ConfigService, ResourceService, IUserProfile, IUserData } from '@sunbird/shared';

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

  constructor(public resourceService: ResourceService) { }
  ngOnInit() {
  }

}
