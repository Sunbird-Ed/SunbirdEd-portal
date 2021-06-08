import { Component, Input, Output, OnInit, ViewChild, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { ToasterService, ResourceService} from '@sunbird/shared';
import { UserService, LearnerService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ProfileService } from '@sunbird/profile';
import { IInteractEventObject } from '@sunbird/telemetry';

@Component({
  selector: 'app-certificate-name-update-popup',
  templateUrl: './certificate-name-update-popup.component.html',
  styleUrls: ['./certificate-name-update-popup.component.scss']
})
export class CertificateNameUpdatePopupComponent implements OnInit, OnDestroy {
  @Input() showProfileUpdatePopup;
  @Input() profileInfo;
  @ViewChild('modal', {static: false}) modal;
  @Output() close = new EventEmitter();
  @ViewChild('crtFirstName', {static: false}) fNameInputEl: ElementRef;
  @ViewChild('crtLastName', {static: false}) lNameInputEl: ElementRef;


  disableContinueBtn = false;
  isNameEditable = false;
  isLastNameEditable = false;
  certificateNameChecked = false;
  instance: string;
  public learner: LearnerService;
  courseInteractObject: IInteractEventObject;

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
    this.isNameEditable = false;
    this.isLastNameEditable = false;
  }

  closePopup() {
    this.modal.deny();
    this.close.emit();
  }

  allowToEdit(inputType) {
    if (inputType === 'firstName') {
      this.isNameEditable = true;
      setTimeout(() => {
        this.fNameInputEl.nativeElement.focus();
      }, 100);
    } else if (inputType === 'lastName') {
      this.isLastNameEditable = true;
      setTimeout(() => {
        this.lNameInputEl.nativeElement.focus();
      }, 100);
    }
  }

  /**
   * This method used to submit profile Update
   */
  updateProfileName() {
    const data = {
      firstName: _.trim(this.profileInfo.firstName),
      lastName: _.trim(this.profileInfo.lastName)
    };
    this.disableContinueBtn = true;
    localStorage.setItem('isCertificateNameUpdated_' + this.profileInfo.id, 'true');

    this.profileService.updateProfile(data).subscribe(res => {
      this.closePopup();
    }, err => {
      this.disableContinueBtn = false;
      this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    });
  }

  ngOnDestroy() {
    if (_.get(this.modal, 'deny')) {
      this.modal.deny();
    }
  }
}
