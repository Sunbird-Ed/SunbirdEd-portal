import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore-group',
  templateUrl: './explore-group.component.html',
  styleUrls: ['./explore-group.component.scss']
})
export class ExploreGroupComponent implements OnInit {
  hideLoginContainer;
  showWelcomePopup = true;
  constructor() { }

  ngOnInit() {
  }

  redirectTologin() {
    window.location.href = '/groups';
  }

}
