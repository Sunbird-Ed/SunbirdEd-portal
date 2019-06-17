import { ResourceService } from '../../services/index';
import { Component, Input, EventEmitter, Output, HostListener, OnChanges, ChangeDetectorRef, DoCheck } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-offline-card',
  templateUrl: './offline-card.component.html',
  styleUrls: ['./offline-card.component.scss']

})

export class OfflineCardComponent implements OnChanges, DoCheck {
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
  @Input() firstOfflineCard;
  @Input() firstPageSection;
  shepeheredClass = true;
  @HostListener('mouseenter') onMouseEnter() {
    this.hover = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover = false;
  }
  constructor(public resourceService: ResourceService, private router: Router,
    private cdr: ChangeDetectorRef) {
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
  ngDoCheck () {
    const tour_5 = document.querySelector('.tour-5.shepherd-modal-target.highlight');
    const tour_8 = document.querySelector('.tour-8.shepherd-modal-target.highlight');
    const tour_10 = document.querySelector('.tour-10.shepherd-modal-target.highlight');
    this.firstOfflineCard && this.firstPageSection && document.getElementById('cardhover') &&
    document.querySelector('.shepherd-buttons') ? this.shepeheredClass = true : this.shepeheredClass = false;
    (!!tour_5 || !!tour_8) || (!!tour_8 ||  !!tour_10) && this.shepeheredClass ?
    // tslint:disable-next-line:no-unused-expression
  document.getElementById('cardhover').style.display = 'block' : '' ;
  }
}

