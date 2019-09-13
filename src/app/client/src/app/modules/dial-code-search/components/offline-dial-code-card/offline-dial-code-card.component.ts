import { Component, OnInit, Input, EventEmitter, Output, HostListener, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ResourceService, ICard, UtilService } from '@sunbird/shared';
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
  currentRoute: string;
  contentId: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.hover = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover = false;
  }
  constructor(public resourceService: ResourceService, private router: Router,
    public utilService: UtilService,
    private cdr: ChangeDetectorRef) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'dialCode', 'id': this.dialCode }];
    }
    this.route = this.router.url;
    this.currentRoute = _.includes(this.route, 'browse') ? 'browse' : 'library';
  }

  public onAction(data, action) {
    this.contentId = data.metaData.identifier;
    if (action === 'download') {
      data['downloadStatus'] = 'DOWNLOADING';
    }
    this.clickEvent.emit({ 'action': action, 'data': data });
  }

  ngOnChanges () {
    this.cdr.detectChanges();
  }

  checkStatus(status) {
    return this.utilService.getPlayerDownloadStatus(status, this.data, this.currentRoute);
  }
}
