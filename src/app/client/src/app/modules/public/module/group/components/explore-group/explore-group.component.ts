import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-explore-group',
  templateUrl: './explore-group.component.html',
  styleUrls: ['./explore-group.component.scss']
})
export class ExploreGroupComponent {
  showWelcomePopup = true;
  constructor(public resourceService: ResourceService) { }

  redirectTologin() {
    window.location.href = '/groups';
  }

}
