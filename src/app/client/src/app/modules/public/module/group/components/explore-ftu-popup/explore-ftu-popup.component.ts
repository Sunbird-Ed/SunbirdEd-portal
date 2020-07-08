import { ResourceService } from '@sunbird/shared';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-explore-ftu-popup',
  templateUrl: './explore-ftu-popup.component.html',
  styleUrls: ['./explore-ftu-popup.component.scss']
})
export class ExploreFtuPopupComponent {
  @Output() close = new EventEmitter();
  constructor(public resourceService: ResourceService) { }

  userVisited() {
    if (!localStorage.getItem('anonymous_ftu_groups')) {
      localStorage.setItem('anonymous_ftu_groups', 'anonymous_user');
    }
    this.close.emit();
  }

}
