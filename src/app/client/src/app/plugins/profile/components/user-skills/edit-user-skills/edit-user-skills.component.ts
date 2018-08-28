import { Component, OnInit, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
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
export class EditUserSkillsComponent implements OnInit, AfterViewInit {
  @ViewChild('modal') modal;
  /**
   * Reference of User Profile interface
   */
  userProfile: IUserProfile;
  /**
   * Used for binding
   */
  skill: any;

  skillsPrefillValues: string;
  disableAddSkillButton = false;

  /**
   * Contains skills data of the user
   */
  skillsMasterData: Array<string>;
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
    this.profileService.getSkills().subscribe((data) => {
      if (data) {
        this.skillsMasterData = data.result.skills;
      }
    });
    this.userProfile = this.userService.userProfile;
    if ( this.userService.userProfile.skills && this.userService.userProfile.skills.length ) {
      this.skillsPrefillValues = _.map(this.userService.userProfile.skills, 'skillName').toString();
    }
     // prefill existing values in input form
    $('#skillinput').val(this.skillsPrefillValues);
    this.setInteractEventData();
  }
  ngAfterViewInit() {
    $('#addSkill').dropdown({
      allowAdditions: true,
      hideAdditions: false,
      forceSelection: false
    });
  }

  /**
   * This method is used to add new skills
   */
  addSkill() {
    const skills = $('#addSkill').dropdown('get value') ? $('#addSkill').dropdown('get value').split(',') : [];
    const req = {
      skills: skills,
      userId: this.userService.userid
    };
    this.disableAddSkillButton = true;
    this.profileService.add(req).subscribe(res => {
      this.disableAddSkillButton = false;
      this.router.navigate(['/profile']);
      this.toasterService.success(this.resourceService.messages.smsg.m0038);
    },
    err => {
      this.disableAddSkillButton = false;
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
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
  }
}
