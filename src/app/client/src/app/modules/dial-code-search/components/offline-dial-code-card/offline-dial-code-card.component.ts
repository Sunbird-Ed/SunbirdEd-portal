import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { ResourceService, ICard } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-offline-dial-code-card',
  templateUrl: './offline-dial-code-card.component.html',
  styleUrls: ['./offline-dial-code-card.component.scss']
})
export class OfflineDialCodeCardComponent implements OnInit {
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


  @HostListener('mouseenter') onMouseEnter() {
    this.hover = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover = false;
  }
  constructor(public resourceService: ResourceService, private router: Router) {
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
    this.clickEvent.emit({ 'action': action, 'data': data });
  }
}


