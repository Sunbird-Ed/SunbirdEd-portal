import { EditExperienceComponent } from './../edit-experience/edit-experience.component';
import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { UserService } from '@sunbird/core';
import {
  ResourceService, ConfigService, IUserProfile, IUserData,
  ToasterService, ServerResponse
} from '@sunbird/shared';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-user-experience-view',
  templateUrl: './user-experience-view.component.html',
  styleUrls: ['./user-experience-view.component.css']
})
export class UserExperienceViewComponent implements OnInit {
  /**
   * Contains reference of ViewChildren
   */
  @ViewChildren('edit') editChild: QueryList<EditExperienceComponent>;
  /**
   * Contains reference of ViewChild
   */
  @ViewChild('add') addChild: EditExperienceComponent;
  /**
   * Contains reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * Contains reference of profile visibility
   */
  privateProfileFields = true;
  /**
   * Contains edit/add action
   */
  action: string;
  /**
   * Boolean value to show/hide error message
   */
  isCurrentJobExist = false;
  /**
   * Contains array of actions
   */
  allowedAction = ['edit', 'add'];
  editExperienceInteractEdata: IInteractEventEdata;
  addExperienceInteractEdata: IInteractEventEdata;
  deleteExperienceInteractEdata: IInteractEventEdata;
  closeExperienceInteractEdata: IInteractEventEdata;
  saveEditExperienceInteractEdata: IInteractEventEdata;
  saveAddExperienceInteractEdata: IInteractEventEdata;
  lockExperienceInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public userService: UserService, public profileService: ProfileService,
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
      if (params.section && params.section === 'experience' && this.allowedAction.indexOf(params.action) > -1) {
        this.action = params.action;
      } else if (params.section && params.section === 'experience' && this.allowedAction.indexOf(params.action) === -1) {
        this.router.navigate(['/profile']);
      } else {
        this.action = 'view';
      }
    });
    this.setInteractEventData();
  }
  /**
   * This method is used to delete existing user experience
   */
  deleteExperience(deletedExp) {
    const request = {
      jobProfile: [deletedExp]
    };
    this.profileService.updateProfile(request).subscribe(res => {
      this.toasterService.success(this.resourceService.messages.smsg.m0015);
    },
      err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0042);
      });
  }
  /**
   * This method is used to edit existing user experience
   */
  editExperience() {
    const editedExp = [];
    let formStatus = true;
    this.editChild.forEach((child) => {
      if (child.experienceForm.valid === true) {
        const addExp: any = {};
        _.forIn(child.experienceForm.value, (value, key) => {
          if (value !== undefined && value !== null) {
            if (key === 'joiningDate' || key === 'endDate') {
              addExp[key] = moment(value).format('YYYY-MM-DD');
            } else {
              addExp[key] = value;
            }
          }
        });
        addExp['id'] = child.experience.id;
        addExp.userId = child.experience.userId;
        editedExp.push(addExp);
      } else {
        formStatus = false;
      }
    });
    if (formStatus === true) {
      editedExp['userId'] = this.userService.userid;
      const req = {
        jobProfile: editedExp
      };
      this.profileService.updateProfile(req).subscribe(res => {
        this.router.navigate(['/profile']);
        this.toasterService.success(this.resourceService.messages.smsg.m0021);
      },
        err => {
          this.toasterService.error(err.error.params.errmsg);
        });
    } else {
      this.toasterService.error(this.resourceService.messages.fmsg.m0076);
    }
  }
  /**
   * This method is used to add new user experience
   */
  addExperience() {
    const addExp: any = {};
    if (this.addChild.experienceForm.touched === true && this.addChild.experienceForm.valid === true) {
      _.forIn(this.addChild.experienceForm.value, (value, key) => {
        if (value !== undefined && value !== '' && value !== null) {
          if (key === 'joiningDate' || key === 'endDate') {
            addExp[key] = moment(value).format('YYYY-MM-DD');
          } else {
            addExp[key] = value;
          }
        }
      });
      addExp.userId = this.userService.userid;
      const req = {
        jobProfile: [addExp]
      };
      this.profileService.updateProfile(req).subscribe((res: ServerResponse) => {
        this.action = 'view';
        this.router.navigate(['/profile']);
        this.toasterService.success(this.resourceService.messages.smsg.m0025);
      },
        (err: ServerResponse) => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0076);
        });
    } else {
      this.toasterService.error(this.resourceService.messages.fmsg.m0076);
    }
  }
  /**
   * This method watches for the changes and updates the form
   */
  checkCurrentJob() {
    let curJobId = 0;
    setTimeout(() => {
      this.editChild.forEach((child) => {
        if (child.experienceForm.value.isCurrentJob === true) {
          curJobId++;
        }
      });
      if (curJobId > 1) {
        this.isCurrentJobExist = true;
      } else {
        this.isCurrentJobExist = false;
      }
    }, 0);
  }
  /**
   * This method watches for the changes to add new user experience
   */
  checkCurrentJobAdd() {
    setTimeout(() => {
      if (this.addChild.experienceForm.value.isCurrentJob === true) {
        let curJobId = 0;
        this.userProfile.jobProfile.forEach((job) => {
          if (job.isCurrentJob === true) {
            curJobId++;
          }
        });
        if (curJobId >= 1) {
          this.isCurrentJobExist = true;
        } else {
          this.isCurrentJobExist = false;
        }
      } else {
        this.isCurrentJobExist = false;
      }
    }, 0);
  }
  setInteractEventData() {
    this.editExperienceInteractEdata = {
      id: 'profile-update-experience',
      type: 'click',
      pageid: 'profile-read'
    };
    this.addExperienceInteractEdata = {
      id: 'profile-add-experience',
      type: 'click',
      pageid: 'profile-read'
    };
    this.deleteExperienceInteractEdata = {
      id: 'profile-delete-experience',
      type: 'click',
      pageid: 'profile-read'
    };
    this.closeExperienceInteractEdata = {
      id: 'profile-close-experience',
      type: 'click',
      pageid: 'profile-read'
    };
    this.saveEditExperienceInteractEdata = {
      id: 'profile-save-edit-experience',
      type: 'click',
      pageid: 'profile-read'
    };
    this.saveAddExperienceInteractEdata = {
      id: 'profile-save-add-experience',
      type: 'click',
      pageid: 'profile-read'
    };
    this.lockExperienceInteractEdata = {
      id: 'lock-experience',
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
