import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { CertRegService, UserService } from '@sunbird/core';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, ViewChild, HostListener } from '@angular/core';
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
  @ViewChild('searchBtn') button;
  @Input() userName;
  courseId: string;
  userData: IUserCertificate;
  channelName: string;
  showModal = false;
  userBatch: {};
  telemetryImpression: IImpressionEventInput;
  criteriaMet: boolean;

  public unsubscribe$ = new Subject<void>();
  constructor(
    public resourceService: ResourceService,
    private certService: CertRegService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private navigationhelperService: NavigationHelperService,
    private router: Router,
    private telemetryService: TelemetryService,
    private userService: UserService,
    ) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.showModal) {
      this.showModal = false;
    }
  }

  ngOnInit() {
    this.channelName = _.upperCase(this.resourceService.instance);
    this.activatedRoute.parent.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.courseId = _.get(params, 'courseId');
      this.setImpressionEvent();
    });
  }

  searchCertificates() {
    let value = !_.isEmpty(this.userData) ? this.userData['courses'].batches = [] : [];
    this.button.nativeElement.disabled = true;
    this.button.nativeElement.classList.add('sb-btn-disabled');
    this.button.nativeElement.classList.remove('sb-btn-outline-primary');
    this.certService.getUserCertList(this.userName.trim(), this.courseId, this.userService.userid)
    .pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.modifyCss();
      if (!this.isErrorOccurred(_.get(data, 'result.response'))) {
        this.userData = _.get(data, 'result.response');
        this.criteriaMet = this.certService.checkCriteria(_.get(this.userData, 'courses.batches'));
      }
    }, (err) => {
      this.modifyCss();
      this.showErrorMsg(this.resourceService.messages.dashboard.emsg.m001);
      value = !_.isEmpty(this.userData) ? this.userData['courses'].batches = [] : [];
    });
  }

  isErrorOccurred(response) {
    const errMsg = _.isEmpty(response) ? (this.resourceService.messages.emsg.m004).replace('{instance}', this.channelName) :
        (_.isEmpty(_.get(response, 'courses.batches')) ? this.resourceService.messages.dashboard.emsg.m002 : '');
      if (!_.isEmpty(errMsg)) {
        this.showErrorMsg(errMsg);
        return true;
      }
      return false;
  }

  modifyCss() {
    this.button.nativeElement.disabled = false;
    this.button.nativeElement.classList.remove('sb-btn-disabled');
    this.button.nativeElement.classList.add('sb-btn-outline-primary');
  }

  showErrorMsg(msg)  {
    this.toasterService.error(msg);
  }

  reIssueCert (batch) {
    const request = {
      request: {
        courseId: this.courseId,
        batchId: _.get(batch, 'batchId'),
        userIds: [_.get(this.userData, 'userId')],
        createdBy: _.get(batch, 'createdBy')
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
    this.userBatch  = !_.isEmpty(batch) ? batch : this.userBatch;
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
        object: this.setObject()
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
        object: this.setObject()
      };

      if (extra) {
        interactData.edata['extra'] = extra;
        _.map(extra, ((value, key) =>  interactData.context.cdata.push({id: value, type: key})));
      }

      this.telemetryService.interact(interactData);
    }

    setObject() {
      return {
        id: this.courseId,
        type: _.get(this.userData, 'courses.contentType') || _.get(this.activatedRoute.snapshot, 'data.telemetry.object.type'),
        ver: _.get(this.userData, 'courses.pkgVersion') ? _.get(this.userData, 'courses.pkgVersion') ? `${_.get(this.userData, 'courses.pkgVersion')}` : '1.0' : '1.0',
      };
    }

  toLowerCase(msg: string) {
    if (msg) {
      return msg[0].toUpperCase() + msg.substring(1).toLowerCase();
    }
    return '';
  }

  resetValues() {
    this.userName = this.userName ? this.userName.trim() : this.userName;
    const value = !_.isEmpty(this.userData) ? this.userData['courses'].batches = [] : [];
  }

  enableReIssueCert(batch) {
    return ((!_.isEmpty(_.get(batch, 'certificates')) || !_.isEmpty(_.get(batch, 'issuedCertificates')))  || _.get(batch, 'status') === 2);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
