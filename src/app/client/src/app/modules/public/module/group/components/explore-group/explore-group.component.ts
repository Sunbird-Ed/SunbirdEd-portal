import { MY_GROUPS } from '../routerLinks';
import { Component, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-explore-group',
  templateUrl: './explore-group.component.html',
  styleUrls: ['./explore-group.component.scss']
})
export class ExploreGroupComponent implements OnInit {
  showWelcomePopup = true;
  constructor(public resourceService: ResourceService) { }

  redirectTologin() {
    window.location.href = MY_GROUPS;
  }

  showFtuPopup(visibility: boolean = false) {
    this.showWelcomePopup = visibility;
  }

  ngOnInit() {
    this.showWelcomePopup = !localStorage.getItem('anonymous_ftu_groups');
  }

}
