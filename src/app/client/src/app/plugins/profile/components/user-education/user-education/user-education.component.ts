import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { UserService } from '@sunbird/core';
import {
  ResourceService, ConfigService, IUserProfile, IUserData, ToasterService, ServerResponse
} from '@sunbird/shared';
import * as _ from 'lodash';
import * as moment from 'moment';
import { EditUserEducationComponent } from '../../user-education/edit-user-education/edit-user-education.component';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-user-education',
  templateUrl: './user-education.component.html',
  styleUrls: ['./user-education.component.css']
})
export class UserEducationComponent implements OnInit {
  /**
   * Reference of view children
   */
  @ViewChildren('edit') editChild: QueryList<EditUserEducationComponent>;
  /**
   * Reference of view child
   */
  @ViewChild('add') addChild: EditUserEducationComponent;
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * Reference for profile visibility
   */
  privateProfileFields = true;
  /**
   * Contains add/edit action
   */
  action: string;
  /**
   * Is an array that stores action
   */
  allowedAction = ['edit', 'add'];
  editEducationInteractEdata: IInteractEventEdata;
  addEducationInteractEdata: IInteractEventEdata;
  deleteEducationInteractEdata: IInteractEventEdata;
  saveEditEducationInteractEdata: IInteractEventEdata;
  saveAddEducationInteractEdata: IInteractEventEdata;
  closeEducationInteractEdata: IInteractEventEdata;
  lockEducationInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public userService: UserService, public profileService: ProfileService,
    public activatedRoute: ActivatedRoute, private router: Router) { }
  /**
 * This method is used to fetch user profile details
 * and to assign specified actions
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
      if (params.section && params.section === 'education' &&
        this.allowedAction.indexOf(params.action) > -1) {
        this.action = params.action;
      } else if (params.section && params.section === 'education' &&
        this.allowedAction.indexOf(params.action) === -1) {
        this.router.navigate(['/profile']);
      } else {
        this.action = 'view';
      }
    });
    this.setInteractEventData();
  }
  /**
   * This method is used to edit education details
   */
  editEducation() {
    const editedEdu = [];
    let formStatus = true;
    this.editChild.forEach((child) => {
      if (child.educationForm.valid === true) {
        const addEdu: any = {};
        _.forIn(child.educationForm.value, (value, key) => {
          if (value !== undefined && value !== '' && value !== null) {
            if (key === 'yearOfPassing') {
              addEdu[key] = Number(moment(value).format('YYYY'));
            } else {
              addEdu[key] = value;
            }
          }
        });
        addEdu['id'] = child.education.id;
        addEdu.userId = child.education.userId;
        editedEdu.push(addEdu);
      } else {
        formStatus = false;
      }
    });
    if (formStatus === true) {
      editedEdu['userId'] = this.userService.userid;
      const req = {
        education: editedEdu
      };
      this.profileService.updateProfile(req).subscribe((res: ServerResponse) => {
        this.router.navigate(['/profile']);
        this.toasterService.success(this.resourceService.messages.smsg.m0020);
      },
        (err) => {
          this.toasterService.error(err.error.params.errmsg);
        });
    } else {
      this.toasterService.error(this.resourceService.messages.fmsg.m0076);
    }
  }
  /**
   * This method is used to add new education
   */
  addEducation() {
    const addEdu: any = {};
    if (this.addChild.educationForm.touched === true && this.addChild.educationForm.valid === true) {
      _.forIn(this.addChild.educationForm.value, (value, key) => {
        if (value && value !== '' && value !== null) {
          if (key === 'yearOfPassing') {
            addEdu[key] = Number(moment(value).format('YYYY'));
          } else {
            addEdu[key] = value;
          }
        } else {

        }
      });
      addEdu.userId = this.userService.userid;
      const req = {
        education: [addEdu]
      };
      this.profileService.updateProfile(req).subscribe((res: ServerResponse) => {
        this.action = 'view';
        this.router.navigate(['/profile']);
        this.toasterService.success(this.resourceService.messages.smsg.m0024);
      },
        err => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0076);
        });
    } else {
      this.toasterService.error(this.resourceService.messages.fmsg.m0076);
    }
  }
  /**
   * This method is used to delete existing education
   */
  deleteEducation(deletedEdu) {
    const request = {
      education: [deletedEdu]
    };
    this.profileService.updateProfile(request).subscribe(res => {
      this.toasterService.success(this.resourceService.messages.smsg.m0014);
    },
      err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0041);
      });
  }
  setInteractEventData() {
    this.editEducationInteractEdata = {
      id: 'profile-update-education',
      type: 'click',
      pageid: 'profile-read'
    };
    this.addEducationInteractEdata = {
      id: 'profile-add-education',
      type: 'click',
      pageid: 'profile-read'
    };
    this.deleteEducationInteractEdata = {
      id: 'profile-delete-education',
      type: 'click',
      pageid: 'profile-read'
    };
    this.closeEducationInteractEdata = {
      id: 'profile-close-education',
      type: 'click',
      pageid: 'profile-read'
    };
    this.saveEditEducationInteractEdata = {
      id: 'profile-save-edit-education',
      type: 'click',
      pageid: 'profile-read'
    };
    this.saveAddEducationInteractEdata = {
      id: 'profile-save-add-education',
      type: 'click',
      pageid: 'profile-read'
    };
    this.lockEducationInteractEdata = {
      id: 'lock-education',
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
