
import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { DownloadManagerService } from './../../services';

@Component({
  selector: 'app-download-manager',
  templateUrl: './download-manager.component.html',
  styleUrls: ['./download-manager.component.scss']
})
export class DownloadManagerComponent implements OnInit {

  downloadResponse: any;

  isOpen = false;

  constructor(public downloadManagerService: DownloadManagerService,
    public resourceService: ResourceService, public toasterService: ToasterService) { }

  ngOnInit() {
    this.downloadManagerService.downloadEvent.subscribe((data) => {
      this.isOpen = true;
      this.getDownloadList();
    });
  }

  getDownloadList() {
    const result = timer(1, 2000).pipe(
      switchMap(() => this.downloadManagerService.getDownloadList())
    );

    const subscription = result.subscribe(
      (apiResponse: any) => {
        this.downloadResponse = apiResponse.result.response.downloads;
        if (_.isEmpty(apiResponse.result.response.downloads.inprogress) && _.isEmpty(apiResponse.result.response.downloads.submitted)) {
          this.toasterService.success(this.resourceService.messages.smsg.m0051);
          this.isOpen = false;
          subscription.unsubscribe();
        }
      }, err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0091);
      });
  }

  showProgressValue(progressSize, totalSize) {
    return (progressSize / totalSize) * 100;
  }

}
