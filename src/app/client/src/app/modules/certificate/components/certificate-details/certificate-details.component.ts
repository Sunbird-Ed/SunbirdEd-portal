import { CertificateService, PlayerService } from '@sunbird/core';
import { ServerResponse, ResourceService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import * as moment from 'moment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-certificate-details',
  templateUrl: './certificate-details.component.html',
  styleUrls: ['./certificate-details.component.scss']
})
export class CertificateDetailsComponent implements OnInit {
  loader: boolean;
  viewCertificate: boolean;
  error = false;
  enableVerifyButton = false;
  certificateCode: string;
  wrongCertificateCode = false;
  instance: string;
  telemetryImpressionData: IImpressionEventInput;
  telemetryCdata: Array<{}> = [];
  pageId: string;

  /** To store the certificate details data */
  recipient: string;
  courseName: string;
  issuedOn: string;
  watchVideoLink: SafeResourceUrl;
  @ViewChild('codeInputField') codeInputField: ElementRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public certificateService: CertificateService,
    public resourceService: ResourceService,
    public router: Router,
    private sanitizer: DomSanitizer,
    public playerService: PlayerService
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.pageId = this.activatedRoute.snapshot.data.telemetry.pageid;
    this.setTelemetryData();
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
        this.getCourseVideoUrl(_.get(data, 'result.response.courseId'));
        const certData = _.get(data, 'result.response.json');
        this.loader = false;
        this.viewCertificate = true;
        this.recipient = _.get(certData, 'recipient.name');
        this.courseName = _.get(certData, 'badge.name');
        this.issuedOn = moment(new Date(_.get(certData, 'issuedOn'))).format('DD MMM YYYY');
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

  navigateToCoursesPage() {
    this.router.navigate(['/explore-course']);
  }

  setTelemetryData() {
    this.telemetryImpressionData = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.pageId,
        uri: this.router.url
      }
    };
    this.telemetryCdata = [
      {
        id: 'course:qrcode:scan:cert',
        type: 'Feature'
      },
      {
        id: 'SB-13854',
        type: 'Task'
      }
    ];
  }

  getCourseVideoUrl(courseId) {
    this.playerService.getCollectionHierarchy(courseId).subscribe(
      (response: ServerResponse) => {
        this.watchVideoLink = _.get(response, 'result.content.certVideoUrl') ?
          this.sanitizer.bypassSecurityTrustResourceUrl(_.get(response, 'result.content.certVideoUrl')) : '';
      }, (error) => {
      });
  }
}
