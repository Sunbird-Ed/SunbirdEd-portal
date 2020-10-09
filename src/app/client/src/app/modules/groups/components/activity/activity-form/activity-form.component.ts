import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { FormService } from '@sunbird/core';
import { GroupsService } from '../../../services';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit {
  @Output() nextClick = new EventEmitter<{ activityType: string }>();

  activityTypes;
  selectedActivity: any;
  constructor(public resourceService: ResourceService, private formService: FormService, private toasterService: ToasterService,
    private groupService: GroupsService, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getFormDetails();
  }

  private getFormDetails() {
    const formServiceInputParams = {
      formType: 'group',
      contentType: 'activities',
      formAction: 'list',
      component: 'portal'
    };
    this.formService.getFormConfig(formServiceInputParams).subscribe(fields => {
      fields.forEach(item => { item.title = this.resourceService.frmelmnts.lbl[item.title]; });
      this.activityTypes = [...fields];
      this.chooseActivity(this.activityTypes[0]);
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });

  }

  chooseActivity(value: any) {
    this.selectedActivity = value;
  }

  next() {
    const cdata = [{id: this.selectedActivity.title, type: 'activityType'}, {id: _.get(this.activateRoute.snapshot, 'params.groupId'), type: 'group'}]
    this.groupService.addTelemetry({id: 'activity-type'}, this.activateRoute.snapshot, cdata);
    this.nextClick.emit({ activityType: this.selectedActivity.title });
    // TODO: Handle telemetry here
  }
}
