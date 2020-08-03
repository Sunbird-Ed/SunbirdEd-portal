import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { CertRegService } from '@sunbird/core';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { IUserCertificate } from '../../interfaces';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-re-issue-certificate',
  templateUrl: './re-issue-certificate.component.html',
  styleUrls: ['./re-issue-certificate.component.scss']
})
export class ReIssueCertificateComponent implements OnInit, OnDestroy {
  courseId: string;
  @Input() userName;
  userData: IUserCertificate;
  certList: Array<{}>;
  disableBtn = false;
  instance: string;
  batchList = [];
  showModal = false;
  userBatch: {};
  telemetryImpression: IImpressionEventInput;

  public unsubscribe$ = new Subject<void>();
  constructor(
    public resourceService: ResourceService,
    private certService: CertRegService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private navigationhelperService: NavigationHelperService,
    private router: Router,
    private telemetryService: TelemetryService
    ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.activatedRoute.parent.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.courseId = _.get(params, 'courseId');
      this.setImpressionEvent();
    });
  }

  getCertList() {
    this.disableBtn = true;
    this.certService.getUserCertList(this.userName.trim(), this.courseId).pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.disableBtn = false;
      this.userName = '';
      if (_.isEmpty(_.get(data, 'result.response.err'))) {
        this.userData = _.get(data, 'result.response');
        this.batchList = _.get(data, 'result.response.courses.batches');
        // tslint:disable-next-line: no-unused-expression
        _.isEmpty(this.batchList) ? this.toasterService.error(this.resourceService.messages.dashboard.emsg.m002) : [];
      } else {
        this.toasterService.error(this.resourceService.messages.dashboard.emsg.m001);
      }
    }, err => {
      this.userName = '';
      this.disableBtn = false;
      this.toasterService.error(this.resourceService.messages.dashboard.emsg.m001);
    });
  }

  reIssueCert (batch) {
    const request = {
      request: {
        courseId: this.courseId,
        batchId: _.get(batch, 'batchId'),
        userIds: [_.get(this.userData, 'userId')]
      }
    };
    this.certService.reIssueCertificate(request).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.toggleModal(false);
      this.toasterService.success(this.resourceService.messages.dashboard.smsg.m001);
    }, err => {
      this.toggleModal(false);
      this.toasterService.error(this.resourceService.messages.dashboard.emsg.m003);
    });
  }

  toggleModal(visibility = false, batch?: {}) {
    this.showModal = visibility;
    this.userBatch = batch ? batch : this.userBatch;
  }

    // To set telemetry impression
    setImpressionEvent() {
      this.telemetryImpression = {
        context: {
          env: _.get(this.activatedRoute.snapshot, 'data.telemetry.env')
        },
        edata: {
          type: _.get(this.activatedRoute.snapshot, 'data.telemetry.type'),
          pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
          uri: this.router.url,
          duration: this.navigationhelperService.getPageLoadTime()
        },
        object: {
            id: this.courseId,
            type: _.get(this.activatedRoute.snapshot, 'data.telemetry.object.type'),
            ver: _.get(this.activatedRoute.snapshot, 'data.telemetry.object.ver'),
        }
      };
    }

    addTelemetry (id, extra) {
      const interactData = {
        context: {
          env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env'),
          cdata: []
        },
        edata: {
          id: id,
          type: 'click',
          pageid:  _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid')
        },
        object: {
          id: this.courseId,
          type: _.get(this.userData, 'courses.contentType') || _.get(this.activatedRoute.snapshot, 'data.telemetry.object.type'),
          ver: _.get(this.userData, 'courses.pkgVersion') ? `${_.get(this.userData, 'courses.pkgVersion')}` : '1.0',
        }
      };

      if (extra) {
          interactData.edata['extra'] = extra;
      }

      this.telemetryService.interact(interactData);
    }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
