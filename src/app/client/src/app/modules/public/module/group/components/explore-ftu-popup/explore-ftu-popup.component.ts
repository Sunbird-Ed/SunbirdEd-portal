import { ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore-ftu-popup',
  templateUrl: './explore-ftu-popup.component.html',
  styleUrls: ['./explore-ftu-popup.component.scss']
})
export class ExploreFtuPopupComponent implements OnInit {
  showWelcomePopup = true;
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }

}
