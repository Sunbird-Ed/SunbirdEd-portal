import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, WindowScrollService } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { ProfileService } from '../../../services/profile/profile.service';

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
  @Input() basicInfo: any;
  subjects: any;
  initDate = new Date();
  languages: any;
  grades: any;
  gender: any;
  basicInfoForm: FormGroup;
  webPages: any = {};
  isEdit: boolean;

  constructor(public resourceService: ResourceService, public userService: UserService, public configService: ConfigService,
    public profileService: ProfileService, public windowScrollService: WindowScrollService) {
    this.subjects = this.configService.dropDownConfig.COMMON.subjects;
    this.languages = this.configService.dropDownConfig.COMMON.languages;
    this.grades = this.configService.dropDownConfig.COMMON.grades;
    this.gender = this.configService.dropDownConfig.COMMON.gender;
  }

  ngOnInit() {
    this.windowScrollService.smoothScroll('additionalInfo');
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.userProfile.webPages.forEach(element => {
            this.webPages[element.type] = element.url;
          });
        }
      });
    if (this.basicInfo) {
      const dob = this.basicInfo.dob ? new Date(this.basicInfo.dob) : null;
      this.isEdit = true;
      this.basicInfo.webPages.forEach(element => {
        this.basicInfo.webPages[element.type] = element.url;
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
        fb: new FormControl(this.basicInfo.webPages.fb),
        twitter: new FormControl(this.basicInfo.webPages.twitter),
        in: new FormControl(this.basicInfo.webPages.in),
        blog: new FormControl(this.basicInfo.webPages.blog)
      });
    } else {
      this.basicInfoForm = new FormGroup({
        firstName: new FormControl(null, [Validators.required]),
        lastName: new FormControl(null),
        phone: new FormControl(null),
        email: new FormControl(null),
        gender: new FormControl(null),
        dob: new FormControl(null),
        location: new FormControl(null),
        grade: new FormControl(null),
        language: new FormControl(null, [Validators.required]),
        subject: new FormControl(null),
        fb: new FormControl(null),
        twitter: new FormControl(null),
        in: new FormControl(null),
        blog: new FormControl(null)
      });
    }
  }
}
