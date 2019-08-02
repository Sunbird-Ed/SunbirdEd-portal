
import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { DownloadManagerService } from './../../services';
import { ConnectionService } from './../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-download-manager',
  templateUrl: './download-manager.component.html',
  styleUrls: ['./download-manager.component.scss']
})
export class DownloadManagerComponent implements OnInit {

  downloadResponse: any;
  isConnected: boolean = navigator.onLine;
  isOpen = false;
  count = 0;
  localCount: 0;
  panelOpened = false;

  constructor(public downloadManagerService: DownloadManagerService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public connectionService: ConnectionService,
    public configService: ConfigService,
    public router: Router) { }

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
      this.isOpen = true;
      this.getDownloadList();
    });
  }

  getDownloadList() {
    this.downloadManagerService.getDownloadList().subscribe(
      (apiResponse: any) => {
        this.downloadResponse = apiResponse.result.response.downloads;
        this.localCount = apiResponse.result.response.downloads.inprogress.length + apiResponse.result.response.downloads.submitted.length;
        if (this.localCount > 0 && this.isConnected) {
          this.getDownloadListUsingTimer();
        }
      });
  }

  private getDownloadListUsingTimer() {
    const result = timer(1, 2000).pipe(
      switchMap(() => this.downloadManagerService.getDownloadList())
    );

    const subscription = result.subscribe(
      (apiResponse: any) => {
        this.downloadResponse = apiResponse.result.response.downloads;
        this.count = apiResponse.result.response.downloads.inprogress.length + apiResponse.result.response.downloads.submitted.length;
        if ((this.localCount > this.count) || !this.isConnected) {
          subscription.unsubscribe();
          this.getDownloadList();
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
}
