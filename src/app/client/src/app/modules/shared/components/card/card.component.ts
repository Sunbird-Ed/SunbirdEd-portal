import { ResourceService } from '../../services/index';
import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
import { environment } from '@sunbird/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent {
  /**
  * content is used to render IContents value on the view
  */
  @Input() data: ICard;
  @Input() dialCode: string;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();
  telemetryCdata: Array<{}> = [];
  isOffline: boolean = environment.isOffline;
  hover: Boolean;
  isConnected: Boolean = navigator.onLine;
  route: string;


  @HostListener('mouseenter') onMouseEnter() {
    this.hover = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover = false;
  }
  constructor(public resourceService: ResourceService, private router: Router) {
    this.resourceService = resourceService;
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'dialCode', 'id': this.dialCode }];
    }
    this.route = this.router.url;
  }

  public onAction(data, action) {
    if (this.route === '/browse' && this.isOffline) {
      return false;
    }
    this.clickEvent.emit({ 'action': action, 'data': data });
  }
}
