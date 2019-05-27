
import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { timer, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { DownloadManagerService } from './../../services';
import { ConnectionService } from './../../services/connection-service/connection.service';

@Component({
  selector: 'app-download-manager',
  templateUrl: './download-manager.component.html',
  styleUrls: ['./download-manager.component.scss']
})
export class DownloadManagerComponent implements OnInit {

  downloadResponse: any;
  isConnected = navigator.onLine;
  isOpen = false;
  count = 0;
  localCount: 0;
  isMultipleDownloadListCalled = false;

  constructor(public downloadManagerService: DownloadManagerService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public connectionService: ConnectionService) { }

  ngOnInit() {
    // Call download list initailly
    this.getDownloadList();

    // Subscribe connection service to check online/offline and call download list
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      this.getDownloadList();
    });

    // Call download list when clicked on add to library
    this.downloadManagerService.downloadEvent.subscribe((data) => {
      this.getDownloadList();
    });
  }

  getDownloadList() {
    const subscription = this.downloadManagerService.getDownloadList().subscribe(
      (apiResponse: any) => {
        this.downloadResponse = apiResponse.result.response.downloads;
        this.localCount = apiResponse.result.response.downloads.inprogress.length + apiResponse.result.response.downloads.submitted.length;

        if (this.isMultipleDownloadListCalled && this.localCount === 0) {
          this.toasterService.success(this.resourceService.messages.smsg.m0051);
          this.isMultipleDownloadListCalled = false;
        }

        if (this.localCount > 0 && this.isConnected) {
          this.getDownloadListUsingTimer();
        }
      });
  }

  private getDownloadListUsingTimer() {
    this.isMultipleDownloadListCalled = true;
    this.isOpen = true;
    const result = timer(1, 2000).pipe(
      switchMap(() => this.downloadManagerService.getDownloadList())
    );

    const subscription = result.subscribe(
      (apiResponse: any) => {
        this.downloadResponse = apiResponse.result.response.downloads;
        this.count = apiResponse.result.response.downloads.inprogress.length + apiResponse.result.response.downloads.submitted.length;

        if (this.localCount > this.count) {
          subscription.unsubscribe();
          this.getDownloadList();
        }
      });
  }

  showProgressValue(progressSize, totalSize) {
    return (progressSize / totalSize) * 100;
  }

}
