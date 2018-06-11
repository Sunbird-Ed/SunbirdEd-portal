import { Component, OnInit, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { ResourceService, IUserProfile, IUserData, ToasterService, WindowScrollService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfileService } from '../../../services';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
declare var jQuery: any;
@Component({
  selector: 'app-edit-user-skills',
  templateUrl: './edit-user-skills.component.html',
  styleUrls: ['./edit-user-skills.component.css']
})
export class EditUserSkillsComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * Used for binding
   */
  skill: any;
  /**
   * Contains skills data of the user
   */
  profileData: any;
  cancelAddSKillsInteractEdata: IInteractEventEdata;
  finishAddSkillsInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor(public userService: UserService, public resourceService: ResourceService, public router: Router,
    public profileService: ProfileService, public toasterService: ToasterService,
    public windowScrollService: WindowScrollService) { }
  /**
   * This method invokes profile service to fetch all the skills of respective user
   * Also invokes user service to fetch user profile data
   */
  ngOnInit() {
    this.windowScrollService.smoothScroll('skills');
    this.profileService.getSkills().subscribe((data) => {
      if (data) {
        this.profileData = data.result;
      }
    });
    this.userProfile = this.userService.userProfile;
    this.setInteractEventData();
    setTimeout(() => {
      $('#addSkill').dropdown({
        allowAdditions: true,
        hideAdditions: false
      });
    }, 1000);
  }
  /**
   * This method is used to add new skills
   */
  addSkill() {
    let skills = [];
    skills = $('#addSkill').dropdown('get value').split(',');
    const req = {
      skillName: skills,
      endorsedUserId: this.userService.userid
    };
    if (skills !== undefined) {
      this.profileService.add(req).subscribe(res => {
        this.router.navigate(['/profile']);
        this.toasterService.success(this.resourceService.messages.smsg.m0038);
      },
        err => {
          // toaster err
        });
    } else {
      this.router.navigate(['/profile']);
    }
  }
  /**
   * This method is used to navigate back to profile
   */
  redirect() {
    this.router.navigate(['/profile']);
  }
  setInteractEventData() {
    this.cancelAddSKillsInteractEdata = {
      id: 'profile-add-skills',
      type: 'click',
      pageid: 'profile-read'
    };
    this.finishAddSkillsInteractEdata = {
      id: 'profile-save-skills',
      type: 'click',
      pageid: 'profile-read'
    };
    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'user',
      ver: '1.0'
    };
  } ngOnDestroy() {
    this.modal.deny();
  }
}
