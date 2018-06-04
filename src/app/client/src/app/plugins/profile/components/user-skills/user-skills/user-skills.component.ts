import { ISkill } from '../../../../../modules/shared/interfaces/userProfile';
import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { UserService } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData } from '@sunbird/shared';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-user-skills',
  templateUrl: './user-skills.component.html',
  styleUrls: ['./user-skills.component.css']
})
export class UserSkillsComponent implements OnInit {
  /**
   * Boolean value to toggle viewMore/viewLess
   */
  viewMore = true;
  /**
   * Contains default limit to show awards
   */
  defaultLimit = this.configService.appConfig.PROFILE.defaultViewMoreLimit;
  /**
   * Used to store limit to show/hide awards
   */
  limit = this.defaultLimit;
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * Boolean value to show/hide visibility
   */
  privateProfileFields = true;
  /**
   * Contains add action
   */
  action: string;
  /**
   * Conatins an array of acitons
   */
  allowedAction = ['add'];
  addSkillsInteractEdata: IInteractEventEdata;
  viewMoreSkillsInteractEdata: IInteractEventEdata;
  viewLessSkillsInteractEdata: IInteractEventEdata;
  lockSkillsInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor(public resourceService: ResourceService,
    public userService: UserService, public profileService: ProfileService, public configService: ConfigService,
    public activatedRoute: ActivatedRoute, private router: Router) { }
  /**
   * This method is used to invoke user service to fetch user profile data
   */
  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.userProfile = this.userService.userProfile;
    this.activatedRoute.params.subscribe(params => {
      if (params.section && params.section === 'skills' &&
        this.allowedAction.indexOf(params.action) > -1) {
        this.action = params.action;
      } else if (params.section && params.section === 'skills' &&
        this.allowedAction.indexOf(params.action) === -1) {
        this.router.navigate(['/profile']);
      } else {
        this.action = 'view';
      }
    });
    this.setInteractEventData();
  }
  /**
   * This method checks for the limit of skills array and updates the limit accordingly
   */
  toggle(lim) {
    if (lim === true) {
      this.limit = this.userProfile.skills.length;
      this.viewMore = false;
    } else {
      this.viewMore = true;
      this.limit = 3;
    }
  }
  setInteractEventData() {
    this.addSkillsInteractEdata = {
      id: 'profile-add-skills',
      type: 'click',
      pageid: 'profile-read'
    };
    this.viewMoreSkillsInteractEdata = {
      id: 'profile-view-more-skills',
      type: 'click',
      pageid: 'profile-read'
    };
    this.viewLessSkillsInteractEdata = {
      id: 'profile-view-less-skills',
      type: 'click',
      pageid: 'profile-read'
    };
    this.lockSkillsInteractEdata = {
      id: 'lock-skills',
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
