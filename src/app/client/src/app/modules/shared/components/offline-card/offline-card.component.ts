import { UtilService } from '../../services';
import { ResourceService, OfflineCardService } from '../../services/index';
import { Component, Input, EventEmitter, Output, HostListener, OnChanges, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { ConnectionService } from './../../../offline/services/connection-service/connection.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-offline-card',
  templateUrl: './offline-card.component.html',
  styleUrls: ['./offline-card.component.scss']
})

export class OfflineCardComponent implements OnInit, OnChanges, OnDestroy {
  /**
  * content is used to render IContents value on the view
  */
  @Input() data: ICard;
  @Input() dialCode: string;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();
  telemetryCdata: Array<{}> = [];
  hover: Boolean;
  route: string;
  currentRoute: string;
  contentId: string;
  isConnected = navigator.onLine;
  status = this.isConnected ? 'ONLINE' : 'OFFLINE';
  onlineContent = false;
  public unsubscribe = new Subject<void>();
  showModal = false;

  @HostListener('mouseenter') onMouseEnter() {
    this.hover = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover = false;
  }
  constructor(public resourceService: ResourceService, private router: Router,
    private cdr: ChangeDetectorRef, private connectionService: ConnectionService,
    public offlineCardService: OfflineCardService, public utilService: UtilService) {
    this.resourceService = resourceService;
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'dialCode', 'id': this.dialCode }];
    }
    this.route = this.router.url;
    this.currentRoute = _.includes(this.route, 'browse') ? 'browse' : 'library';
  }

  ngOnInit() {
    if (_.includes(['video/youtube', 'video/x-youtube'], this.data.metaData.mimeType)) {
      this.onlineContent = true;
    }
    this.connectionService.monitor().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(isConnected => {
        this.isConnected = isConnected;
        this.status = isConnected ? 'ONLINE' : 'OFFLINE';
      });
  }

  public onAction(data, action) {
    this.contentId = data.metaData.identifier;
    if (action === 'download') {
      this.showModal = this.offlineCardService.checkYoutubeContent(data);
      if (this.showModal === false)  {
        data['downloadStatus'] = 'DOWNLOADING';
        this.clickEvent.emit({ 'action': action, 'data': data });
      }
    } else {
      this.clickEvent.emit({ 'action': action, 'data': data });
    }
  }

  download(data, action) {
    data['downloadStatus'] = 'DOWNLOADING';
    this.clickEvent.emit({ 'action': action, 'data': data });
  }

  ngOnChanges () {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  checkStatus(status) {
    return this.utilService.getPlayerDownloadStatus(status, this.data, this.currentRoute);
  }
}

