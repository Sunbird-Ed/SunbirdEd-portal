import { Component, OnInit, OnDestroy, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ResourceService } from '../../services/index';

@Component({
  selector: 'app-contentlock-info-popup',
  templateUrl: './contentlock-info-popup.component.html'
})

export class LockInfoPopupComponent implements OnInit {

  @ViewChild('modal') modal;
  @Input() content;
  @Output() closeEvent = new EventEmitter<any>();
  /**
	 * Constructor to create injected service(s) object
	 *
   * @param {ResourceService} resourceService Reference of ResourceService
	 */

  constructor(public resourceService: ResourceService) {
  }

  ngOnInit() {
  }

  public closeModal() {
    this.modal.approve();
    this.closeEvent.emit();
  }
}
