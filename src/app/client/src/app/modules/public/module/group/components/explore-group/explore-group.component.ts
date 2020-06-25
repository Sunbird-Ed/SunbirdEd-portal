import { MY_GROUPS } from '../routerLinks';
import { Component, OnInit, Output, HostListener } from '@angular/core';
import { ResourceService, NavigationHelperService } from '@sunbird/shared';

@Component({
  selector: 'app-explore-group',
  templateUrl: './explore-group.component.html',
  styleUrls: ['./explore-group.component.scss']
})
export class ExploreGroupComponent implements OnInit {
  showWelcomePopup = true;
  constructor(public resourceService: ResourceService
  ) { }

  ngOnInit() {
  }
  redirectTologin() {
    window.location.href = MY_GROUPS;
  }
}
