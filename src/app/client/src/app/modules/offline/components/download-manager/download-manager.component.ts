
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

  @Input() contentId: string;
  downloadResponse: any;

  constructor(public downloadManagerService: DownloadManagerService,
    public resourceService: ResourceService, public toasterService: ToasterService) { }

  ngOnInit() {
    this.getDownloadList();
  }

  getDownloadList() {
    const result = timer(1, 5000).pipe(
      switchMap(() => this.downloadManagerService.getDownloadList(this.contentId))
    );

    const subscription = result.subscribe(
      (apiResponse: any) => {
        this.downloadResponse = apiResponse.result.response.downloads;
        if (_.isEmpty(apiResponse.result.response.downloads.inprogress) && _.isEmpty(apiResponse.result.response.downloads.submitted)) {
          subscription.unsubscribe();
        }
      });
  }

  showProgressValue(progressSize, totalSize) {
    return (progressSize / totalSize) * 100;
  }

}
