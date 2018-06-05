import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, WindowScrollService, IBasicInfo } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { ProfileService } from '../../../services';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';

@Component({
  selector: 'app-edit-user-additional-info',
  templateUrl: './edit-user-additional-info.component.html',
  styleUrls: ['./edit-user-additional-info.component.css']
})
export class EditUserAdditionalInfoComponent implements OnInit {
  /**
  * Reference of User Profile interface
  */
  userProfile: IUserProfile;
  /**
  * Reference of Input annotation
  */
  @Input() basicInfo: IBasicInfo;
  /**
  * Contains array of subjects which comes from config
  */
  subjects: Array<string>;
  /**
  * Contains Date object instance
  */
  initDate = new Date();
  /**
  * Conatins array of languages which comes from config
  */
  languages: Array<string>;
  /**
  * Conatins array of grades which comes from config
  */
  grades: Array<string>;
  /**
  * Contains gender array which comes from config
  */
  gender: Array<string>;
  /**
  * Reference of FormGroup
  */
  basicInfoForm: FormGroup;
  /**
  * Contains webpage Object
  */
  webPages: any = {};
  /**
  * Boolean value to disable/enable phone and email input fields
  */
  isEdit: boolean;
  phoneNumberVisibilityInteractEdata: IInteractEventEdata;
  emailVisibilityInteractEdata: IInteractEventEdata;
  genderVisibilityInteractEdata: IInteractEventEdata;
  locationVisibilityInteractEdata: IInteractEventEdata;
  dobVisibilityInteractEdata: IInteractEventEdata;
  webPagesVisibilityInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor(public resourceService: ResourceService, public userService: UserService, public configService: ConfigService,
    public profileService: ProfileService, public windowScrollService: WindowScrollService) {
    this.subjects = this.configService.dropDownConfig.COMMON.subjects;
    this.languages = this.configService.dropDownConfig.COMMON.languages;
    this.grades = this.configService.dropDownConfig.COMMON.grades;
    this.gender = this.configService.dropDownConfig.COMMON.gender;
  }
  /**
  * This method is used to fetch user profile data
  * Also used to create instance of formgroup
  */
  ngOnInit() {
    this.windowScrollService.smoothScroll('additionalInfo');
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    if (this.basicInfo) {
      const dob = this.basicInfo.dob ? new Date(this.basicInfo.dob) : undefined;
      this.isEdit = true;
      this.basicInfo.webPages.forEach(element => {
        this.webPages[element.type] = element.url;
      });
      this.basicInfoForm = new FormGroup({
        firstName: new FormControl(this.basicInfo.firstName, [Validators.required]),
        lastName: new FormControl(this.basicInfo.lastName),
        phone: new FormControl(this.basicInfo.phone),
        email: new FormControl(this.basicInfo.email),
        gender: new FormControl(this.basicInfo.gender),
        dob: new FormControl(dob),
        location: new FormControl(this.basicInfo.location),
        grade: new FormControl(this.basicInfo.grade),
        language: new FormControl(this.basicInfo.language, [Validators.required]),
        subject: new FormControl(this.basicInfo.subject),
        fb: new FormControl(this.webPages.fb),
        twitter: new FormControl(this.webPages.twitter),
        in: new FormControl(this.webPages.in),
        blog: new FormControl(this.webPages.blog)
      });
    }
    this.setInteractEventData();
  }
  setInteractEventData() {
    this.phoneNumberVisibilityInteractEdata = {
      id: 'phn-number-lock',
      type: 'click',
      pageid: 'profile-read'
    };
    this.emailVisibilityInteractEdata = {
      id: 'email-lock',
      type: 'click',
      pageid: 'profile-read'
    };
    this.genderVisibilityInteractEdata = {
      id: 'gender-lock',
      type: 'click',
      pageid: 'profile-read'
    };
    this.dobVisibilityInteractEdata = {
      id: 'birthdate-lock',
      type: 'click',
      pageid: 'profile-read'
    };
    this.locationVisibilityInteractEdata = {
      id: 'current-location-lock',
      type: 'click',
      pageid: 'profile-read'
    };
    this.webPagesVisibilityInteractEdata = {
      id: 'social-media-link-lock',
      type: 'click',
      pageid: 'profile-read'
    };
    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'user',
      ver: '1.0'
    };
  }
}
