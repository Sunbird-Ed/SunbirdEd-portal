
import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { timer } from 'rxjs';
import { switchMap, delay } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ContentManagerService } from '../../services';
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
  count = 0;
  localCount: 0;
  telemetryInteractEdata: IInteractEventEdata = {
    id: 'content-click',
    type: 'click',
    pageid: 'content-manager'
  };

  contentStatus = {
    pause: this.resourceService.frmelmnts.btn.pause,
    pausing: this.resourceService.frmelmnts.btn.pausing,
    resume: this.resourceService.frmelmnts.btn.resume,
    resuming: this.resourceService.frmelmnts.btn.resuming,
    cancel: this.resourceService.frmelmnts.btn.cancel,
    canceling: this.resourceService.frmelmnts.btn.canceling,
    canceled: this.resourceService.frmelmnts.btn.canceled,
    completed: this.resourceService.frmelmnts.btn.completed
  };

  subscription: any;
  pauseInteractData: IInteractEventEdata;
  cancelInteractData: IInteractEventEdata;
  resumeInteractData: IInteractEventEdata;

  constructor(public contentManagerService: ContentManagerService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public connectionService: ConnectionService,
    public configService: ConfigService,
    public activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    this.setTelemetryInteractData();
    // Call download list initailly
    this.getContentList();

    // Subscribe connection service to check online/offline and call download list
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      this.getContentList();
    });

    // Call download list when clicked on add to library
    this.contentManagerService.downloadEvent.subscribe((data) => {
      this.isOpen = true;
      this.getContentList();
    });
  }

  getContentList() {
    this.contentManagerService.getContentList().subscribe(
      (apiResponse: any) => {
        this.contentResponse = apiResponse.result.response.downloads;
        this.localCount = apiResponse.result.response.downloads.inprogress.length + apiResponse.result.response.downloads.submitted.length;
        if (this.localCount > 0 && this.isConnected) {
          this.getContentListUsingTimer();
        }
      });
  }

  cancelImportContent(importId) {
    this.subscription.unsubscribe();
    this.contentManagerService.cancelImportContent(importId).pipe(
      delay(2000), // wait for user to see canceling
    ).subscribe(
      (apiResponse: any) => {
        this.getContentList();
      },
      (err) => {
        this.getContentList();
      });
  }

  pauseImportContent(importId) {
    this.subscription.unsubscribe();
    this.contentManagerService.pauseImportContent(importId).pipe(
      delay(2000), // wait for user to see pausing
    ).subscribe(
      (apiResponse: any) => {
        this.getContentList();
      },
      (err) => {
        this.getContentList();
      });
  }

  resumeImportContent(importId) {
    this.subscription.unsubscribe();
    this.contentManagerService.resumeImportContent(importId).pipe(
      delay(2000), // wait for user to see resuming
    ).subscribe(
      (apiResponse: any) => {
        this.getContentList();
      },
      (err) => {
        this.getContentList();
      });
  }

  private getContentListUsingTimer() {
    const result = timer(1, 2000).pipe(
      switchMap(() => this.contentManagerService.getContentList())
    );

    this.subscription = result.subscribe(
      (apiResponse: any) => {
        this.contentResponse = apiResponse.result.response.downloads;
        this.count = apiResponse.result.response.downloads.inprogress.length + apiResponse.result.response.downloads.submitted.length;
        if ((this.localCount > this.count) || !this.isConnected) {
          this.subscription.unsubscribe();
          this.getContentList();
        }
      });
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
    return  {
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
  }

}
