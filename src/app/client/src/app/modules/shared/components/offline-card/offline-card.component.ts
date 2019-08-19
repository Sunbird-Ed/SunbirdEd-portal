import { ResourceService } from '../../services/index';
import { Component, Input, EventEmitter, Output, HostListener, OnChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { ConnectionService } from './../../../offline/services/connection-service/connection.service';

@Component({
  selector: 'app-offline-card',
  templateUrl: './offline-card.component.html',
  styleUrls: ['./offline-card.component.scss']
})

export class OfflineCardComponent implements OnInit, OnChanges {
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
  checkOfflineRoutes: string;
  contentId: string;
  showAddingToLibraryButton: boolean;
  isConnected = navigator.onLine;
  status = this.isConnected ? 'ONLINE' : 'OFFLINE';

  @HostListener('mouseenter') onMouseEnter() {
    this.hover = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover = false;
  }
  constructor(public resourceService: ResourceService, private router: Router,
    private cdr: ChangeDetectorRef, private connectionService: ConnectionService) {
    this.resourceService = resourceService;
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'dialCode', 'id': this.dialCode }];
    }
    this.route = this.router.url;
    if (_.includes(this.route, 'browse')) {
      this.checkOfflineRoutes = 'browse';
    } else if (!_.includes(this.route, 'browse')) {
      this.checkOfflineRoutes = 'library';
    }
  }

  ngOnInit() {
    if (_.includes(['video/youtube', 'video/x-youtube'], this.data.metaData.mimeType)) {
      this.data['youtubeContent'] = true;
    }
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = 'ONLINE';
      } else {
        this.status = 'OFFLINE';
      }
    });
  }

  public onAction(data, action) {
    this.contentId = data.metaData.identifier;
    if (action === 'download') {
      data.showAddingToLibraryButton = true;
    }
    this.clickEvent.emit({ 'action': action, 'data': data });
  }

  ngOnChanges () {
    this.cdr.detectChanges();
  }
}

