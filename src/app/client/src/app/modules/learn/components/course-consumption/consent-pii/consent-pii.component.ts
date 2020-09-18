import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Consent, ConsentStatus } from '@project-sunbird/client-services/models';
import { CsUserService } from '@project-sunbird/client-services/services/user/interface';
import { UserService } from '@sunbird/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-consent-pii',
  templateUrl: './consent-pii.component.html',
  styleUrls: ['./consent-pii.component.scss']
})
export class ConsentPiiComponent implements OnInit {

  @Input() showConsentPopup: boolean;
  @Input() consent: string;
  @Input() collection;
  @ViewChild('profileDetailsModal') profileDetailsModal;
  consentPii: boolean;
  userInformation = [];
  editSetting = false;
  showTncPopup = false;
  unsubscribe = new Subject<void>();
  private usersProfile: any;
  constructor(
    @Inject('CS_USER_SERVICE') private csUserService: CsUserService,
    private toasterService: ToasterService,
    public userService: UserService,
    public resourceService: ResourceService
  ) { }

  ngOnInit() {
    this.consentPii = !(this.consent === 'Yes');
    this.usersProfile = this.userService.userProfile;
    this.getUserInformation();
    this.getUserConsent();
    this.updateUserConsent(true);
  }

  getUserInformation() {
    this.userInformation['name'] = `${this.usersProfile.firstName} ${this.usersProfile.lastName}`;
    this.userInformation['userid'] = this.usersProfile.userId;
    this.userInformation['emailId'] = this.usersProfile.email;
    this.userInformation['phone'] = this.usersProfile.phone;

    if (_.get(this.usersProfile, 'userLocations.length')) {
      this.usersProfile.userLocations.forEach(locDetail => {
        if (locDetail.type === 'state') {
          this.userInformation['state'] = locDetail.name;
        }
        if (locDetail.type === 'district') {
          this.userInformation['district'] = locDetail.name;
        }
      });
    }

    if (_.get(this.usersProfile, 'declarations.length')) {
      for (const [key, value] of Object.entries(this.usersProfile.declarations[0].info)) {
        switch (key) {
          case 'declared-email':
            this.userInformation['emailId'] = value;
            break;
          case 'declared-phone':
            this.userInformation['phone'] = value;
            break;
          case 'declared-ext-id':
            this.userInformation['schoolId'] = value;
            break;
          case 'declared-school-udise-code':
            this.userInformation['schoolName'] = value;
            break;
        }
      }
    }
  }

  saveConsent() {
    console.log();
    const newConsent = this.consentPii ? 'Yes' : 'No';
    if (this.consent !== newConsent) {
      this.toasterService.success(_.get(this.resourceService, 'messages.smsg.dataSettingSubmitted'));
      this.showConsentPopup = false;
    }
  }

  toggleEditSetting() {
    this.editSetting = !this.editSetting;
  }

  getUserConsent() {
    const request = {
      userId: this.userService.userid,
      consumerId: this.collection.channel,
      objectId: this.collection.identifier
    };
    this.csUserService.getConsent(request, { apiPath: '/learner/user/v1' })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        console.log('res', res);
      }, error => {
        console.error('error', error);
      });
  }

  updateUserConsent(isActive: boolean) {
    const request: Consent = {
      status: isActive ? ConsentStatus.ACTIVE : ConsentStatus.REVOKED,
      userId: this.userService.userid,
      consumerId: this.collection.channel, //course channel id
      objectId: this.collection.identifier,
      objectType: 'Collection'
    };
    this.csUserService.updateConsent(request, { apiPath: '/learner/user/v1' })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        console.log('Update consent status', res);
      }, error => {
        console.error('Error while updating user consent', error);
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    if (_.get(this.profileDetailsModal, 'deny')) {
      this.profileDetailsModal.deny();
    }
  }
}
