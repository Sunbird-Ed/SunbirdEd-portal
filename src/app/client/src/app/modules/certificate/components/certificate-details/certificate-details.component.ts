import { PublicPlayerService } from '@sunbird/public';
import { CertificateService, UserService } from '@sunbird/core';
import { ServerResponse, ResourceService, ConfigService, PlayerConfig, IUserData } from '@sunbird/shared';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import * as moment from 'moment';
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
  playerConfig: PlayerConfig;
  contentId: string;
  showVideoThumbnail = true;

  /** To store the certificate details data */
  recipient: string;
  courseName: string;
  issuedOn: string;
  watchVideoLink: string;
  @ViewChild('codeInputField') codeInputField: ElementRef;

  constructor(
    public activatedRoute: ActivatedRoute,
    public certificateService: CertificateService,
    public resourceService: ResourceService,
    public configService: ConfigService,
    public userService: UserService,
    public playerService: PublicPlayerService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.pageId = this.activatedRoute.snapshot.data.telemetry.pageid;
    this.setTelemetryData();
  }

  /** It will call the validate cert. api and course_details api (after taking courseId) */
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
  /** To handle verify button enable/disable fucntionality */
  getCodeLength(event: any) {
    this.wrongCertificateCode = false;
    if (event.target.value.length === 6) {
      this.enableVerifyButton = true;
    } else {
      this.enableVerifyButton = false;
    }
  }
  /** To redirect to courses tab (for mobile device, they will handle 'href' change) */
  navigateToCoursesPage() {
    if (this.activatedRoute.snapshot.queryParams.clientId === 'android') {
      window.location.href = '/explore-course';
    } else {
      this.router.navigate(['/explore-course']);
    }
  }
  /** To set the telemetry*/
  setTelemetryData() {
    const context = { env: this.activatedRoute.snapshot.data.telemetry.env };
    if (_.get(this.activatedRoute, 'snapshot.queryParams.clientId') === 'android' &&
    _.get(this.activatedRoute, 'snapshot.queryParams.context')) {
      const telemetryData = JSON.parse(decodeURIComponent(_.get(this.activatedRoute, 'snapshot.queryParams.context')));
      context['env'] = telemetryData.env;
    }
    this.telemetryImpressionData = {
      context: context,
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

  /** to get the certtificate video url and courseId from that url */
  getCourseVideoUrl(courseId: string) {
    this.playerService.getCollectionHierarchy(courseId).subscribe(
      (response: ServerResponse) => {
        this.watchVideoLink = _.get(response, 'result.content.certVideoUrl');
        if (this.watchVideoLink) {
          const splitedData = this.watchVideoLink.split('/');
          splitedData.forEach((value) => {
            if (value.includes('do_')) {
              this.contentId = value;
            }
          });
        }
      }, (error) => {
      });
  }

  /** to play content on the certificate details page */
  playContent(contentId: string) {
    this.showVideoThumbnail = false;
    const option = { params: this.configService.appConfig.ContentPlayer.contentApiQueryParams };
    this.playerService.getContent(contentId, option).subscribe(
      (response) => {
        const contentDetails = {
          contentId: contentId,
          contentData: response.result.content
        };
        this.playerConfig = this.playerService.getConfig(contentDetails);
      },
      (err) => {
      });
  }
}
