import { Component, OnInit, Input, EventEmitter, Output, HostListener, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ResourceService, ICard } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
import { Router } from '@angular/router';
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
  checkOfflineRoutes: string;
  contentId: string;
  showAddingToLibraryButton: boolean;
  showModal = false;

  @HostListener('mouseenter') onMouseEnter() {
    this.hover = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover = false;
  }
  constructor(public resourceService: ResourceService, private router: Router,
    private cdr: ChangeDetectorRef) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
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

  public onAction(data, action) {
    this.contentId = data.metaData.identifier;
    if (action === 'download') {
      data.showAddingToLibraryButton = true;
      this.checkYoutubeContent(data, action);
    } else {
      this.clickEvent.emit({ 'action': action, 'data': data });
    }
  }

  checkYoutubeContent(data, action) {
    this.showModal = false;
    let isYoutube;
    try { isYoutube = JSON.parse(data.mimeTypesCount); } catch (error) { isYoutube = undefined; }
    if (_.includes(['video/youtube', 'video/x-youtube'], data.metaData.mimeType)
      || _.has(isYoutube, 'video/youtube') || _.has(isYoutube, 'video/x-youtube')) {
      this.showModal = true;
    } else {
      this.clickEvent.emit({ 'action': action, 'data': data });
    }
  }

  download(data, action) {
    this.clickEvent.emit({ 'action': action, 'data': data });
  }

  ngOnChanges () {
    this.cdr.detectChanges();
  }
}


