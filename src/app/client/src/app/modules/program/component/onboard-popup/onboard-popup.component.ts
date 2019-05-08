import { FormService, UserService, ExtPluginService } from '@sunbird/core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-onboard-popup',
  templateUrl: './onboard-popup.component.html',
  styleUrls: ['./onboard-popup.component.scss']
})
export class OnboardPopupComponent implements OnInit {

  @Input() programDetails: any;

  @Output() updateEvent = new EventEmitter<any>();

  selectedOption: any = {};

  formFieldOptions: Array<any>;

  showButton = false;

  constructor(public formService: FormService, public extPluginService: ExtPluginService, public userService: UserService,
    public resourceService: ResourceService) { }

  ngOnInit() {
    console.log('program onboard form', this.programDetails);
    this.formFieldOptions = _.get(this.programDetails, 'config.onBoardForm.fields');
  }
  handleFieldChange(event) {
    this.showButton = true;
  }
  handleSubmit(event) {
    console.log('', this.selectedOption);
    const req = {
      // url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
      url: `program/v1/add/participant`,
      data: {
        request : {
          programId: this.programDetails.programId,
          userId: this.userService.userid,
          onBoardingData: this.selectedOption,
          onBoarded: true
        }
    }
    };
    this.extPluginService.post(req).subscribe((data) => {
      console.log(data);
      this.updateEvent.emit(true);
    }, error => {
      this.updateEvent.emit(false);
      console.log('fetching program details failed', error);
    });
  }
}
