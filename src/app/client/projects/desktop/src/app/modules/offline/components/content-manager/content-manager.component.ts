import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { timer, Subject, combineLatest } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ContentManagerService, ElectronDialogService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.scss']
})
export class ContentManagerComponent implements OnInit {

  contentResponse: any;
  isOpen = false;
  callContentList = false;
  callContentListTimer = false;
  contentStatusObject = {};
  telemetryInteractEdata: IInteractEventEdata = {
    id: 'content-click',
    type: 'click',
    pageid: 'content-manager'
  };
  subscription: any;
  interactData: IInteractEventEdata;
  localStatusArr = ['inProgress', 'inQueue', 'resume', 'resuming'];
  cancelId: string;
  apiCallTimer = timer(1000, 3000).pipe(filter(data => !data || (this.callContentList)));
  apiCallSubject = new Subject();
  constructor(public contentManagerService: ContentManagerService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public electronDialogService: ElectronDialogService,
    public configService: ConfigService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
    this.getList();
  }

  getList() {
    combineLatest(this.apiCallTimer, this.apiCallSubject, (data1, data2) => true)
      .pipe(switchMap(() => this.contentManagerService.getContentList()),
        map((resp: any) => {
          this.callContentList = false;
          _.forEach(_.get(resp, 'result.response.contents'), (value) => {
            const data = this.contentStatusObject[value.id];
            if (data) { value.status = data.currentStatus; }
            if (_.includes(this.localStatusArr, value.status)) {
              this.callContentList = true;
            }
          });
          return _.get(resp, 'result.response.contents');
        })).subscribe((apiResponse: any) => {
          this.contentResponse = apiResponse;
        });
  }
  ngOnInit() {
    // Call download list initially
    this.apiCallSubject.next();

    // Call content list when clicked on add to library
    this.contentManagerService.downloadEvent.subscribe((data) => {
      this.isOpen = true;
      this.apiCallSubject.next();
    });

    // Call content list while uploading content
    this.electronDialogService.uploadEvent.subscribe((data) => {
      this.isOpen = true;
      this.apiCallSubject.next();
    });
  }


  updateLocalStatus(contentData, currentStatus) {
    this.contentStatusObject[contentData.id] = {
      currentStatus: currentStatus,
      previousState: contentData.status
    };
    const data = _.find(this.contentResponse, { id: contentData.id });
    data.status = currentStatus;
  }

  private getSubscription(contentId) {
    const _this = this;
    return ({
      next(apiResponse: any) {
        _this.apiCallSubject.next();
        _this.deleteLocalContentStatus(contentId);
      },
      error(err) {
        _this.toasterService.error(this.resourceService.messages.fmsg.m0097);
        _this.apiCallSubject.next();
        _this.deleteLocalContentStatus(contentId);
      }
    });
  }

  cancelImportContent(contentId) {
    this.contentManagerService.cancelImportContent(contentId).subscribe(this.getSubscription(contentId));
  }

  pauseImportContent(contentId) {
    this.contentManagerService.pauseImportContent(contentId).subscribe(this.getSubscription(contentId));
  }

  resumeImportContent(contentId) {
    this.contentManagerService.resumeImportContent(contentId).subscribe(this.getSubscription(contentId));
  }

  deleteLocalContentStatus(contentId) {
    delete this.contentStatusObject[contentId];
  }

  getContentPercentage(progressSize, totalSize) {
    return (progressSize / totalSize) * 100;
  }

  openContent(contentId, mimeType, status) {
    if (status === 'completed') {
      if (mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
        this.router.navigate(['play/collection', contentId]);
      } else {
        this.router.navigate(['play/content', contentId]);
      }
    }
  }

  getTelemetryInteractData() {
    return {
      id: this.isOpen ? 'content-manager-close' : 'content-manager-open',
      type: 'click',
      pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid') ?
        _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid') : ''
    };
  }

  setTelemetryInteractEdataData(id, percentage) {
    this.interactData = {
      id: id,
      type: 'click',
      pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid') ?
        _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid') : ''
    };

    if (percentage) {
      this.interactData['extra'] = {
        percentage: percentage
      };
    }
  }
}
