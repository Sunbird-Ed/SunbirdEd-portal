import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ResourceService, IUserProfile, IUserData, ToasterService, WindowScrollService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfileService } from '../../../services';
import * as _ from 'lodash';

@Component({
  selector: 'app-edit-user-skills',
  templateUrl: './edit-user-skills.component.html',
  styleUrls: ['./edit-user-skills.component.css']
})
export class EditUserSkillsComponent implements OnInit {
  userProfile: IUserProfile;
  skillForm: FormGroup;
  skill: any;
  profileData: any;

  constructor(public userService: UserService, public resourceService: ResourceService, public router: Router,
    public profileService: ProfileService, public toasterService: ToasterService,
    public windowScrollService: WindowScrollService) { }

  ngOnInit() {
    this.windowScrollService.smoothScroll('skills');
    this.profileService.getSkills().subscribe((data) => {
      if (data) {
        this.profileData = data.result;
      }
    });
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.userProfile = this.userService.userProfile;
  }
  addSkill(addedSkill) {
    const req = {
      skillName: addedSkill,
      endorsedUserId: this.userService.userid
    };
    if (addedSkill !== undefined) {
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
  redirect() {
    this.router.navigate(['/profile']);
  }
}
