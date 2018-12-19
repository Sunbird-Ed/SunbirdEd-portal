import { Component, OnInit, OnDestroy, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ResourceService } from '../../services/index';

/**
 * The info popup component can be used from all the places by passing
  heading and body text and action for button
 */
@Component({
  selector: 'app-popup-info',
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.css']
})
export class InfoPopupComponent implements OnInit, OnDestroy {

  @ViewChild('modal') modal;
  @Input() popupContent: object;
  @Output() closeEvent = new EventEmitter<any>();

  /**
	 * Constructor to create injected service(s) object
	 *
   * @param {ResourceService} resourceService Reference of ResourceService
	 */

  constructor(resourceService: ResourceService) {
  }

  ngOnInit() {
  }

  public closeModal() {
    this.onCloseEvent.emit();
  }

  ngOnDestroy() {
  }
}
