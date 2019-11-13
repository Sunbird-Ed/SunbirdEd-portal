import { Component, OnInit, Input, EventEmitter, Output, HostListener, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ResourceService, ICard, UtilService, OfflineCardService } from '@sunbird/shared';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-offline-dial-code-card',
  templateUrl: './offline-dial-code-card.component.html',
  styleUrls: ['./offline-dial-code-card.component.scss']
})
export class OfflineDialCodeCardComponent implements OnInit, OnChanges {
  /**
  * content is used to render IContents value on the view
  */
  @Input() data: ICard;
  @Input() dialCode: string;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();
  telemetryCdata: Array<{}> = [];
  hover: Boolean;
  isConnected: Boolean = navigator.onLine;
  route: string;
  currentRoute: string;
  contentId: string;
  showModal = false;
  message;
  public telemetryInteractObject: IInteractEventObject;
  public downloadContentEdata: IInteractEventEdata;
  public cancelDownloadYoutubeContentEdata: IInteractEventEdata;

  @HostListener('mouseenter') onMouseEnter() {
    this.hover = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover = false;
  }
  constructor(public resourceService: ResourceService, private router: Router,
    private cdr: ChangeDetectorRef,
    public utilService: UtilService, public offlineCardService: OfflineCardService, public activatedRoute: ActivatedRoute) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.setTelemetryData();
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'dialCode', 'id': this.dialCode }];
    }
    this.route = this.router.url;
    this.currentRoute = _.includes(this.route, 'browse') ? 'browse' : 'library';
  }

  public onAction(data, action) {
    this.contentId = data.metaData.identifier;
    if (action === 'download') {
      this.showModal = this.offlineCardService.isYoutubeContent(data);
      if (this.showModal === false)  {
        data['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
        this.clickEvent.emit({ 'action': action, 'data': data });
      } else {
        this.message = data.metaData.mimeType !== 'application/vnd.ekstep.content-collection' ? this.resourceService.messages.stmsg.m0141 :
        this.resourceService.messages.stmsg.m0137;
      }
    } else {
      this.clickEvent.emit({ 'action': action, 'data': data });
    }
  }

  download(data, action) {
    data['downloadStatus'] = this.resourceService.messages.stmsg.m0140;
    this.clickEvent.emit({ 'action': action, 'data': data });
  }

  ngOnChanges () {
    this.cdr.detectChanges();
  }

  checkStatus(status) {
    return this.utilService.getPlayerDownloadStatus(status, this.data, this.currentRoute);
  }

  setTelemetryData() {
    this.telemetryInteractObject = {
      id: this.contentId,
      type: this.data.contentType,
      ver: '1.0'
    };
    this.downloadContentEdata = {
      id: 'download-content',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    this.cancelDownloadYoutubeContentEdata = {
      id: 'cancel-download-content',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }
}
