
import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { DownloadManagerService } from './../../services';
import { ConnectionService } from './../../services';

@Component({
  selector: 'app-download-manager',
  templateUrl: './download-manager.component.html',
  styleUrls: ['./download-manager.component.scss']
})
export class DownloadManagerComponent implements OnInit {

  downloadResponse: any;

  isOpen = false;

  count = 0;
  localCount: 0;

  constructor(public downloadManagerService: DownloadManagerService,
    public resourceService: ResourceService, public toasterService: ToasterService,
    public connectionService: ConnectionService) { }

  ngOnInit() {
    this.singleDownloadListCall();
    this.downloadManagerService.downloadEvent.subscribe((data) => {
      this.singleDownloadListCall();
    });
  }

  singleDownloadListCall() {
    const subscription = this.downloadManagerService.getDownloadList().subscribe(
      (apiResponse: any) => {
        this.downloadResponse = apiResponse.result.response.downloads;
        this.localCount = apiResponse.result.response.downloads.inprogress.length + apiResponse.result.response.downloads.submitted.length;
        if (this.localCount > 0) {
          this.multipleDownloadListCall();
        }
      });
  }

  private multipleDownloadListCall() {
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
          this.singleDownloadListCall();
        }
      });
  }

  showProgressValue(progressSize, totalSize) {
    return (progressSize / totalSize) * 100;
  }

}
