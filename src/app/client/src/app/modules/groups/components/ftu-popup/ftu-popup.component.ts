import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ftu-popup',
  templateUrl: './ftu-popup.component.html',
  styleUrls: ['./ftu-popup.component.scss']
})
export class FtuPopupComponent implements OnInit {

  showWelcomePopup = true;
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }

}
