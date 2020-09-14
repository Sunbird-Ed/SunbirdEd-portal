import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '@sunbird/core';
import { ToasterService } from '@sunbird/shared';

@Component({
  selector: 'app-consent-pii',
  templateUrl: './consent-pii.component.html',
  styleUrls: ['./consent-pii.component.scss']
})
export class ConsentPiiComponent implements OnInit {

  @Input() showConsentPopup: boolean;
  @Input() consent: string;
  private usersProfile: any;
  consentPii: boolean;
  userInformations = [];
  editSetting = false;
  constructor(public userService: UserService, private toasterService: ToasterService) { }

  ngOnInit() {
    this.consentPii = this.consent === 'Yes' ? true : false;
    this.usersProfile = this.userService.userProfile;
    this.getUserInformations();
  }

  getUserInformations() {
    this.userInformations['name'] = `${this.usersProfile.firstName} ${this.usersProfile.lastName}`;
    this.userInformations['userid'] = this.usersProfile.userId;
    this.userInformations['emailId'] = this.usersProfile.email;
    this.userInformations['phone'] = this.usersProfile.phone;
    if (this.usersProfile.userLocations && this.usersProfile.userLocations.length) {
      this.usersProfile.userLocations.forEach(locDetail => {
        if (locDetail.type === 'state') {
          this.userInformations['state'] = locDetail.name;
        }
        if (locDetail.type === 'district') {
          this.userInformations['district'] = locDetail.name;
        }
      });
    }

    if (this.usersProfile.declarations && this.usersProfile.declarations.length) {
      for (const [key, value] of Object.entries(this.usersProfile.declarations[0].info)) {
        switch (key) {
          case 'declared-email':
            this.userInformations['emailId'] = value;
            break;
          case 'declared-phone':
            this.userInformations['phone'] = value;
            break;
          case 'declared-ext-id':
            this.userInformations['schoolId'] = value;
            break;
          case 'declared-school-udise-code':
            this.userInformations['schoolName'] = value;
            break;
        }
      }
    }
  }

  saveConsent() {
    const newConsent = this.consentPii ? 'Yes' : 'No';
    if (this.consent !== newConsent) {
      this.toasterService.success(`You have successfully changed your consent to share your data from 
                                    "${this.consent}" to "${newConsent}"`);
      this.showConsentPopup = false;
    }
  }

  toggleEditSetting() {
    this.editSetting = !this.editSetting;
  }

}
