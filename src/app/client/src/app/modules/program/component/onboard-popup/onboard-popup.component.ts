import { FormService, UserService, ExtPluginService } from '@sunbird/core';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-onboard-popup',
  templateUrl: './onboard-popup.component.html',
  styleUrls: ['./onboard-popup.component.scss']
})
export class OnboardPopupComponent implements OnInit {

  @Input() userDetails: any;

  @Input() programDetails: any;

  constructor(public formService: FormService, public extPluginService: ExtPluginService, public userService: UserService) { }

  ngOnInit() {
    this.getFormDetails().subscribe((formData) => {
      console.log(formData);
    }, error => {
      console.log(error);
    });
  }

  private getFormDetails() {
    const formServiceInputParams = {
      formType: 'program',
      formAction: 'onboarding',
      contentType: this.programDetails.programId
    };
    return this.formService.getFormConfig(formServiceInputParams, this.userService.hashTagId);
  }
}
