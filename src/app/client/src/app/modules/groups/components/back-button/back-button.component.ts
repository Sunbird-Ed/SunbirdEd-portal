import { ResourceService } from '@sunbird/shared';
import { Component } from '@angular/core';
import { GroupsService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { MY_GROUPS } from '../../interfaces';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {

  constructor(public resourceService: ResourceService,
    private groupService: GroupsService, private activatedRoute: ActivatedRoute) { }

  goBack() {
    const groupId = _.get(this.activatedRoute.snapshot, 'params.groupId');
    const cdata = groupId ? [{id: groupId , type : 'group'}] : [];
    this.groupService.addTelemetry({id: 'back-button'}, this.activatedRoute.snapshot, cdata);
    this.groupService.goBack();
  }
}
