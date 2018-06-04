import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, ToasterService } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditUserAdditionalInfoComponent } from '../../user-additional-info/edit-user-additional-info/edit-user-additional-info.component';
import { ProfileService } from './../../../services';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
/**
* Displays basic information of the user
*/
@Component({
  selector: 'app-user-additional-info',
  templateUrl: './user-additional-info.component.html',
  styleUrls: ['./user-additional-info.component.css']
})
export class UserAdditionalInfoComponent implements OnInit {
  @ViewChild('edit') editChild: EditUserAdditionalInfoComponent;
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * Contains social media links
   */
  webPages: any = {};
  /**
   * Contains action performed - add/edit/view
   */
  action: string;
  /**
   * Stores actions that are allowed
   */
  allowedAction = ['edit'];
  editAdditionalInfoInteractEdata: IInteractEventEdata;
  saveEditAdditionalInfoInteractEdata: IInteractEventEdata;
  closeAdditionalInfoInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor(public resourceService: ResourceService, public activatedRoute: ActivatedRoute,
    public router: Router, public userService: UserService, public profileService: ProfileService,
    public toasterService: ToasterService) { }
  /**
  * Invokes user service to fetch user data and user profile data
  *
  */
  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.userProfile.webPages.forEach(element => {
            this.webPages[element.type] = element.url;
          });
        }
      });
    this.userProfile = this.userService.userProfile;
    this.activatedRoute.params.subscribe(params => {
      if (params.section && params.section === 'additionalInfo' &&
        this.allowedAction.indexOf(params.action) > -1) {
        this.action = params.action;
      } else if (params.section && params.section === 'additionalInfo' &&
        this.allowedAction.indexOf(params.action) === -1) {
        this.router.navigate(['/profile']);
      } else {
        this.action = 'view';
      }
    });
    this.setInteractEventData();
  }
  /**
  * Invokes profile service to edit additional information of the user
  */
  editBasicInfo() {
    const editedInfo = [];
    let formStatus = true;
    const updatedInfo = {};
    const addInfo: any = {};
    if (this.editChild.basicInfoForm.valid === true) {
      _.forIn(this.editChild.basicInfoForm.controls, (value, key) => {
        if (value && value !== undefined && value !== null) {
          if (key === 'dob' && value.value !== null) {
            addInfo[key] = moment(value.value).format('YYYY-MM-DD');
          } else if ((value.value !== null && value.value !== undefined) && (key === 'fb' || key === 'in'
            || key === 'twitter' || key === 'blog')) {
            if (updatedInfo['webPages'] === undefined) {
              updatedInfo['webPages'] = [];
            }
            updatedInfo['webPages'].push({ type: key, url: value.value });
            updatedInfo['webPages'] = _.reject(updatedInfo['webPages'], ['url', '']);
          } else {
            addInfo[key] = value.value;
          }
        } else {
        }
      });
      addInfo['id'] = this.editChild.basicInfo.id;
      addInfo['userId'] = this.userService.userid;
      addInfo['webPages'] = updatedInfo['webPages'];
      delete addInfo['blog'];
      delete addInfo['fb'];
      delete addInfo['in'];
      delete addInfo['twitter'];
      delete addInfo['email'];
      delete addInfo['phone'];
    } else {
      if ((this.editChild.basicInfoForm.controls.phone.valid === true || this.editChild.basicInfoForm.controls.email.valid === true) &&
        (this.editChild.basicInfoForm.controls.firstName.valid === true && this.editChild.basicInfoForm.controls.language.valid === true)) {
      } else {
        formStatus = false;
      }
    }
    if (formStatus === true) {
      const req = {
        basicInfo: addInfo
      };
      this.profileService.updateProfile(req.basicInfo).subscribe(res => {
        this.router.navigate(['/profile']);
        this.toasterService.success(this.resourceService.messages.smsg.m0022);
      },
        err => {
          this.toasterService.error(err.error.params.errmsg);
        });
    } else {
      this.toasterService.error(this.resourceService.messages.fmsg.m0076);
    }
  }
  setInteractEventData() {
    this.editAdditionalInfoInteractEdata = {
      id: 'profile-edit-additional-info',
      type: 'click',
      pageid: 'profile-read'
    };
    this.closeAdditionalInfoInteractEdata = {
      id: 'profile-close-additional-info',
      type: 'click',
      pageid: 'profile-read'
    };
    this.saveEditAdditionalInfoInteractEdata = {
      id: 'profile-save-edit-additional-info',
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
