import { CertificateService } from '@sunbird/core';
import { ServerResponse, ResourceService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import * as moment from 'moment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-certificate-details',
  templateUrl: './certificate-details.component.html'
})
export class CertificateDetailsComponent implements OnInit {
  showSuccessModal: boolean;
  loader: boolean;
  viewCertificate: boolean;
  error = false;
  enableVerifyButton = false;
  certificateCode: string;
  wrongCertificateCode = false;
  instance: string;
  watchVideoLink: SafeResourceUrl;
  certificateDetails: any;

  @ViewChild('codeInputField') codeInputField: ElementRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public certificateService: CertificateService,
    public resourceService: ResourceService,
    public router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.watchVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/2Xgff-gsf0A?rel=0&autoplay=1');
  }

  certificateVerify() {
    this.loader = true;
    const request = {
      request: {
        'certId': this.activatedRoute.snapshot.params.uuid,
        'accessCode': _.trim(this.certificateCode),
        'verifySignature': true,
      }
    };
    this.certificateService.validateCertificate(request).subscribe(
      (data: ServerResponse) => {
        this.loader = false;
        this.certificateDetails = data;
       /**  manipulate response data here
            watch video link needs to be secured by bypassSecurityTrustResourceUrl()
        */
      },
      (err) => {
        this.wrongCertificateCode = true;
        this.loader = false;
        this.codeInputField.nativeElement.value = '';
        this.codeInputField.nativeElement.focus();
        this.enableVerifyButton = false;
      }
    );
  }
  getCodeLength(event: any) {
    this.wrongCertificateCode = false;
    if (event.target.value.length === 6) {
      this.enableVerifyButton = true;
    } else {
      this.enableVerifyButton = false;
    }
  }

  navigateToWatchVideoModal() {
    this.showSuccessModal = true;
  }

  navigateToCoursesPage() {
    this.router.navigate(['/explore-course']);
  }

}
