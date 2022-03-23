import { PublicPlayerService } from '@sunbird/public';
import {CertificateService, UserService, TenantService} from '@sunbird/core';
import { ServerResponse, ResourceService, ConfigService, PlayerConfig, IUserData, ToasterService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import dayjs from 'dayjs';
import { IImpressionEventInput } from '@sunbird/telemetry';
import {Subject, Subscription} from 'rxjs';
import { CsCertificateService, CsVerifyCertificateResponse } from '@project-sunbird/client-services/services/certificate/interface';
@Component({
  selector: 'app-certificate-details',
  templateUrl: './certificate-details.component.html',
  styleUrls: ['./certificate-details.component.scss']
})
export class CertificateDetailsComponent implements OnInit , OnDestroy {
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
  logo: string;
  tenantName: string;
  tenantDataSubscription: Subscription;

  /** To store the certificate details data */
  recipient: string;
  courseName: string;
  issuedOn: string;
  watchVideoLink: string;
  @ViewChild('codeInputField') codeInputField: ElementRef;
  validateRCCertificate: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public certificateService: CertificateService,
    public resourceService: ResourceService,
    public configService: ConfigService,
    public userService: UserService,
    public playerService: PublicPlayerService,
    public router: Router,
    public tenantService: TenantService,
    @Inject('CS_CERTIFICATE_SERVICE') private CsCertificateService: CsCertificateService,
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.pageId = this.activatedRoute.snapshot.data.telemetry.pageid;
    if (_.get(this.activatedRoute, 'snapshot.queryParams.data')) {
      this.validateRCCertificate = true;
      this.validateCertificate();
    }
    this.setTelemetryData();
    this.tenantDataSubscription = this.tenantService.tenantData$.subscribe(data => {
      if (data && !data.err && data.tenantData) {
        this.logo = data.tenantData.logo;
        this.tenantName = data.tenantData.titleName;
      }
    });
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
        if (_.get(data, 'result.response.related.certVideoUrl')) {
          this.watchVideoLink = _.get(data, 'result.response.related.certVideoUrl');
          this.processVideoUrl(this.watchVideoLink);
        } else {
          this.getCourseVideoUrl(_.get(data, 'result.response.related.courseId'));
        }
        const certData = _.get(data, 'result.response.json');
        this.loader = false;
        this.viewCertificate = true;
        this.recipient = _.get(certData, 'recipient.name');
        this.courseName = _.get(certData, 'badge.name');
        this.issuedOn = dayjs(new Date(_.get(certData, 'issuedOn'))).format('DD MMM YYYY');
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
        this.processVideoUrl(this.watchVideoLink);
      }, (error) => {
      });
  }

  processVideoUrl(url: string) {
    if (url) {
      const splitedData = url.split('/');
      splitedData.forEach((value) => {
        if (value.includes('do_')) {
          this.contentId = value;
        }
      });
    }
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

  ngOnDestroy() {
    if (this.tenantDataSubscription) {
      this.tenantDataSubscription.unsubscribe();
    }
  }

  validateCertificate() {
    const certificatePublicKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtu87YH+XEkHB+Id7/xmN\nxG6UNCPYyNQeWGvD73oCoPTy6f+L8OOpfEK+P2BCkyKR59L/QL8Mkyn4KTw39LUk\nDtD4ijJC5wt2+f1Si1/d/ZguZ/LFXhqXSZHN18f1sedJjPPr20EyJp0IAoBPap5U\nkCeLGMv0lto+iqasEVRC0o7hbICFrnzFTOl5CTUDYMOndn3XEcK0KdLlhsPfQp0n\nZXCZHbisL1LPD3vqZ/7HKWfr+qsIxYt9aikBaOFg5mMoMvE4sLZTwMm+ElB1HH3h\nhaVnFjycGBwy4A8jzGWy/y++YQy5n0VUlKT2gk62/dHgPKK3NUY2YPBOfuOyBmYp\nwQIDAQAB\n-----END PUBLIC KEY-----';
    this.loader = true;
    let url = _.get(this.activatedRoute, 'snapshot.queryParams.data').toString();
    url = url.replace(/ /g, "+");
    this.CsCertificateService
      .getEncodedData(url)
      .then((resp) => {
        let requestBody = {
          publicKey: certificatePublicKey,
          certificateData: resp,
          schemaName: 'certificate',
          certificateId: _.get(this.activatedRoute, 'snapshot.params.uuid'),
        };
        this.CsCertificateService.verifyCertificate(requestBody).subscribe(
          (data: CsVerifyCertificateResponse) => {
            console.log('Portal :: verifyCertificate response ', data); // TODO: log!
            const certData = _.get(data, 'certificateData');
            this.loader = false;
            if (_.get(data, 'verified')) {
              this.viewCertificate = true;
              this.recipient = _.get(certData, 'issuedTo');
              this.courseName = _.get(certData, 'trainingName');
              this.issuedOn = dayjs(new Date(_.get(certData, 'issuanceDate'))).format('DD MMM YYYY');
            } else {
              this.viewCertificate = false;
            }
          },
          (err) => {
            this.loader = false;
            this.toasterService.error(this.resourceService.messages.emsg.m0005);
            console.log('Portal :: verifyCertificate err ', err); // TODO: log!
          }
        );
      }).catch(error => {
        console.log('Portal :: CSL : Get Encode CSL API failed ', error);
      });
  }
}
