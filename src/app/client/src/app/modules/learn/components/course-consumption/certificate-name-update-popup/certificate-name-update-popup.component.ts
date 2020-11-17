import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ToasterService, ResourceService} from '@sunbird/shared';
import { UserService, LearnerService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ProfileService } from '@sunbird/profile';

@Component({
  selector: 'app-certificate-name-update-popup',
  templateUrl: './certificate-name-update-popup.component.html',
  styleUrls: ['./certificate-name-update-popup.component.scss']
})
export class CertificateNameUpdatePopupComponent implements OnInit {
  @ViewChild('modal') modal;
  @Output() close = new EventEmitter();

  disableContinueBtn = false;
  certificateNameChecked = false;
  isNameEditable = false;
  instance: string;
  public learner: LearnerService;

  constructor( public userService: UserService,
    public resourceService: ResourceService,
    private toasterService: ToasterService,
    public learnerService: LearnerService,
    private profileService: ProfileService) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }

  onClickCheckbox(tncChecked) {
    this.disableContinueBtn = !tncChecked;
  }

  closePopup() {
    this.modal.deny();
    this.close.emit();
  }

  /**
   * This method used to submit profile Update
   */
  updateProfileName() {
    const data = { firstName: _.trim(this.userService.userProfile.firstName) };
    this.disableContinueBtn = true;
    localStorage.setItem('isCertificateNameUpdated', 'true');

    this.profileService.updateProfile(data).subscribe(res => {
      this.closePopup();
    }, err => {
      this.disableContinueBtn = false;
      this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    });
  }
}
