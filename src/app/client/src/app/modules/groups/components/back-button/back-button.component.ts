import { ResourceService, NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {

  constructor(private navigationHelperService: NavigationHelperService, public resourceService: ResourceService) { }

  ngOnInit() {
  }

  goBack() {
    this.navigationHelperService.goBack();
  }
}
