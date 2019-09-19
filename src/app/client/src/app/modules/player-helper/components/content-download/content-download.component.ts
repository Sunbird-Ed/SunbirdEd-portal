import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { takeUntil, first, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { PublicPlayerService } from '@sunbird/public';
import { DownloadManagerService } from '@sunbird/offline';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, ICard, UtilService, ToasterService, ContentData } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-content-download',
  templateUrl: './content-download.component.html',
  styleUrls: ['./content-download.component.scss']
})
export class ContentDownloadComponent implements OnInit, OnDestroy {

  @Input() contentData: ContentData;
  contentId: string;
  @Output() clickEvent = new EventEmitter<any>();
  public unsubscribe$ = new Subject<void>();
  currentRoute: string;
  telemetryCdata: Array<{}>;
  private contentType: string ;
  public telemetryInteractObject: IInteractEventObject;
  public downloadContentInteractEdata: IInteractEventEdata;
  public downloadCollectionInteractEdata: IInteractEventEdata;

  constructor(public resourceService: ResourceService, public utilService: UtilService,
    public router: Router,  public downloadManagerService: DownloadManagerService,
    public toasterService: ToasterService, public playerService: PublicPlayerService,
    public activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
    this.currentRoute = _.includes(this.router.url, 'browse') ? 'browse' : 'library';
    this.setTelemetryData();

    this.downloadManagerService.downloadListEvent.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.checkDownloadStatus(data);
    });
  }

  setTelemetryData() {

    this.telemetryInteractObject = {
      id: this.contentData['identifier'],
      type: this.contentType,
      ver: this.contentData['pkgVersion'] || '1.0'
    };

    this.downloadContentInteractEdata = {
      id: this.contentData['mimeType'] !== 'application/vnd.ekstep.content-collection' ? 'download-content' : 'download-collection',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };

  }

  startDownload(content) {
    this.downloadManagerService.downloadContentId = content.identifier;
    this.downloadManagerService.startDownload({}).subscribe(data => {
      this.downloadManagerService.downloadContentId = '';
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0135;
    }, error => {
      this.downloadManagerService.downloadContentId = '';
      content['downloadStatus'] = this.resourceService.messages.stmsg.m0138;
      this.toasterService.error(this.resourceService.messages.fmsg.m0090);
    });
  }

  checkStatus(status) {
  return this.utilService.getPlayerDownloadStatus(status, this.contentData, this.currentRoute);
  }

  checkDownloadStatus(downloadListdata) {
    return this.playerService.updateDownloadStatus(downloadListdata, this.contentData);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
