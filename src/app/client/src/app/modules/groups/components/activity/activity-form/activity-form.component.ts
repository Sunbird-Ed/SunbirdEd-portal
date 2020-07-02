import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit {

  @Output() nextClick = new EventEmitter<{ activityType: string }>();

  activityTypes = [
    {
      name: 'course',
      title: this.resourceService.frmelmnts.lbl.courses,
      disabled: false
    }, {
      name: 'textbooks',
      title: `${this.resourceService.frmelmnts.lbl.textbooks} (${this.resourceService.frmelmnts.lbl.comingSoon})`,
      disabled: true
    },
  ];

  selectedActivity: any;
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
    this.chooseActivity(this.activityTypes[0]);
  }

  chooseActivity(value: any) {
    // TODO: Handle telemetry here
    this.selectedActivity = value;
  }

  next() {
    this.nextClick.emit({ activityType: this.selectedActivity.name });
    // TODO: Handle telemetry here
  }
}
