import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ResourceService, ConfigService, IUserProfile, IUserData, ToasterService } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditUserAdditionalInfoComponent } from '../../user-additional-info/edit-user-additional-info/edit-user-additional-info.component';
import { ProfileService } from './../../../services';
import * as _ from 'lodash';
import * as moment from 'moment';

/**
* Displays basic information of the user
*/
@Component({
  selector: 'app-user-additional-info',
  templateUrl: './user-additional-info.component.html',
  styleUrls: ['./user-additional-info.component.css']
})
export class UserAdditionalInfoComponent implements OnInit {
  @ViewChildren('edit') editChild: QueryList<EditUserAdditionalInfoComponent>;
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
  allowedAction = ['edit', 'add'];

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
  }
  editBasicInfo() {
    const editedInfo = [];
    const updatedInfo = {};
    this.editChild.forEach((child) => {
      if (child.basicInfoForm.touched === true && child.basicInfoForm.valid === true) {
        const addInfo: any = {};
        _.forIn(child.basicInfoForm.controls, (value, key) => {
          if (value.touched === true && value !== undefined && value.value !== '' && value !== null) {
            if (key === 'dob') {
              addInfo[key] = moment(value.value).format('YYYY-MM-DD');
            } else if (key === 'fb' || key === 'in' || key === 'twitter' || key === 'blog') {
              if (updatedInfo['webPages'] === undefined) {
                updatedInfo['webPages'] = [];
              }
              updatedInfo['webPages'].push({ type: key, url: value.value });
            } else {
              addInfo[key] = value.value;
            }
          } else {
          }
        });
        addInfo['id'] = child.basicInfo.id;
        addInfo.userId = child.basicInfo.userId;
        addInfo['webPages'] = updatedInfo[0];
        delete addInfo['blog'];
        delete addInfo['fb'];
        delete addInfo['in'];
        delete addInfo['twitter'];
        delete addInfo['email'];
        delete addInfo['phone'];
        editedInfo.push(addInfo);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0076);
        const addInfo = {};
        addInfo['userId'] = this.userService.userid;
        editedInfo.push(addInfo);
      }
    });
    const req = {
      basicInfo: editedInfo,
      userId: this.userService.userid
    };
    this.profileService.updateProfile(req.basicInfo[0]).subscribe(res => {
      this.router.navigate(['/profile']);
      this.toasterService.success(this.resourceService.messages.m0022);
    },
      err => {
        console.log('err', err);
        this.toasterService.error(err.error.params.errmsg);
        // toaster err
      });
  }
}
