import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { FormService } from '@sunbird/core';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit {
  @Output() nextClick = new EventEmitter<{ activityType: string }>();

  activityTypes;
  selectedActivity: any;
  constructor(public resourceService: ResourceService, private formService: FormService) { }

  ngOnInit() {
    this.getFormDetails();
  }

  private getFormDetails() {
    const formServiceInputParams = {
      formType: 'group',
      contentType: 'activities',
      formAction: 'list'
    };
    this.formService.getFormConfig(formServiceInputParams).subscribe(fields => {
      fields.forEach(item => { item.title = this.resourceService.frmelmnts.lbl[item.title]; });
      this.activityTypes = [...fields];
      this.chooseActivity(this.activityTypes[0]);
    }, error => {
      console.error('Error while getting activity form data', error);
    });

  }

  chooseActivity(value: any) {
    this.selectedActivity = value;
  }

  next() {
    this.nextClick.emit({ activityType: this.selectedActivity.name });
    // TODO: Handle telemetry here
  }
}
