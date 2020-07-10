import { ResourceService, NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {

  constructor(private navigationHelperService: NavigationHelperService, public resourceService: ResourceService,
    private groupService: GroupsService, private activatedRoute: ActivatedRoute) { }

  goBack() {
    this.groupService.addTelemetry('back-button', this.activatedRoute.snapshot);
    this.navigationHelperService.goBack();
  }
}
