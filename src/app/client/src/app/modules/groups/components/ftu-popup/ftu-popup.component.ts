import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-ftu-popup',
  templateUrl: './ftu-popup.component.html',
  styleUrls: ['./ftu-popup.component.scss']
})
export class FtuPopupComponent implements OnInit {
  @Input() showWelcomePopup;
  @Output() close = new EventEmitter();
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }

  closeModal() {
    this.showWelcomePopup = false;
    this.close.emit(true);
  }

}
