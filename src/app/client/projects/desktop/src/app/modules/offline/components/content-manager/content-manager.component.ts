
import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { timer } from 'rxjs';
import { switchMap, delay, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ContentManagerService, ElectronDialogService } from '../../services';
import { ConnectionService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.scss']
})
export class ContentManagerComponent implements OnInit {

  contentResponse: any;
  isConnected: boolean = navigator.onLine;
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
  pauseInteractData: IInteractEventEdata;
  cancelInteractData: IInteractEventEdata;
  resumeInteractData: IInteractEventEdata;
  confirmCancelInteractData: IInteractEventEdata;
  denyCancelInteractData: IInteractEventEdata;
  localStatusArr = ['inProgress', 'inQueue', 'resume', 'resuming'];
  cancelId: string;

  constructor(public contentManagerService: ContentManagerService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public connectionService: ConnectionService, public electronDialogService: ElectronDialogService,
    public configService: ConfigService,
    public activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    this.setTelemetryInteractData();
    // Call download list initially
    this.getContentList();

    // Subscribe connection service to check online/offline and call download list
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      this.getContentList();
    });

    // Call content list when clicked on add to library
    this.contentManagerService.downloadEvent.subscribe((data) => {
      this.isOpen = true;
      this.getContentList();
    });

    // Call content list while uploading content
    this.electronDialogService.uploadEvent.subscribe((data) => {
      this.isOpen = true;
      this.getContentList();
    });
  }

  getContentList() {
    this.contentManagerService.getContentList()
      .pipe(
        map((resp: any) => {
          this.callContentListTimer = false;
          // Changing content status if local content status is changed
          _.forEach(_.get(resp, 'result.response.contents'), (value) => {
            const data = this.contentStatusObject[value.id];
            if (data) { value.status = data.currentStatus; }
            if (_.includes(this.localStatusArr, value.status)) {
              this.callContentListTimer = true;
            }
          });
          return _.get(resp, 'result.response.contents');
        }))
      .subscribe(
        (apiResponse: any) => {
          this.contentResponse = apiResponse;
          if (this.callContentListTimer && this.isConnected) {
            this.getContentListUsingTimer();
          }
        });
  }

  private getContentListUsingTimer() {
    const result = timer(1, 3000).pipe(
      switchMap(() => this.contentManagerService.getContentList())
    );

    this.subscription = result
      .pipe(
        map((resp: any) => {
          this.callContentList = false;
          // Changing content status if local content status is changed
          _.forEach(_.get(resp, 'result.response.contents'), (value) => {
            const data = this.contentStatusObject[value.id];
            if (data) { value.status = data.currentStatus; }
            if (_.includes(this.localStatusArr, value.status)) {
              this.callContentList = true;
            }
          });
          return _.get(resp, 'result.response.contents');
        }))
      .subscribe(
        (apiResponse: any) => {
          this.contentResponse = apiResponse;
          if (this.callContentList === false || !this.isConnected) {
            this.subscription.unsubscribe();
            this.getContentList();
          }
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

  cancelImportContent(contentId) {
    this.subscription.unsubscribe();
    this.contentManagerService.cancelImportContent(contentId).subscribe(
      (apiResponse: any) => {
        this.getContentList();
        this.deleteLocalContentStatus(contentId);
      },
      (err) => {
        this.toasterService.info(this.resourceService.messages.fmsg.m0097);
        this.getContentList();
        this.deleteLocalContentStatus(contentId);
      });
  }

  pauseImportContent(contentId) {
    this.subscription.unsubscribe();
    this.contentManagerService.pauseImportContent(contentId).subscribe(
      (apiResponse: any) => {
        this.getContentList();
        this.deleteLocalContentStatus(contentId);
      },
      (err) => {
        this.toasterService.info(this.resourceService.messages.fmsg.m0097);
        this.getContentList();
        this.deleteLocalContentStatus(contentId);
      });
  }

  resumeImportContent(contentId) {
    this.subscription.unsubscribe();
    this.contentManagerService.resumeImportContent(contentId).subscribe(
      (apiResponse: any) => {
        this.getContentList();
        this.deleteLocalContentStatus(contentId);
      },
      (err) => {
        this.toasterService.info(this.resourceService.messages.fmsg.m0097);
        this.getContentList();
        this.deleteLocalContentStatus(contentId);
      });
  }

  deleteLocalContentStatus(contentId) {
    delete this.contentStatusObject[contentId];
  }

  showProgressValue(progressSize, totalSize) {
    return (progressSize / totalSize) * 100;
  }

  openContent(contentId, mimeType) {
    if (mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
      this.router.navigate(['play/collection', contentId]);
    } else {
      this.router.navigate(['play/content', contentId]);
    }
  }

  getTelemetryInteractData() {
    return {
      id: this.isOpen ? 'content-manager-close' : 'content-manager-open',
      type: 'click',
      pageid: 'content-manager'
    };
  }

  setTelemetryInteractData() {
    this.pauseInteractData = {
      id: 'pause',
      type: 'click',
      pageid: 'content-manager'
    };
    this.cancelInteractData = {
      id: 'cancel',
      type: 'click',
      pageid: 'content-manager'
    };
    this.resumeInteractData = {
      id: 'resume',
      type: 'click',
      pageid: 'content-manager'
    };
    this.confirmCancelInteractData = {
      id: 'confirm-cancel',
      type: 'click',
      pageid: 'content-manager'
    };
    this.denyCancelInteractData = {
      id: 'deny-cancel',
      type: 'click',
      pageid: 'content-manager'
    };
  }
}
