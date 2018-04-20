import { ISkill } from './../../../../shared/interfaces/userProfile';
import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './../../../services';
import { UserService } from '@sunbird/core';
import { ResourceService, ConfigService, IUserProfile, IUserData } from '@sunbird/shared';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'app-user-skills',
  templateUrl: './user-skills.component.html',
  styleUrls: ['./user-skills.component.css']
})
export class UserSkillsComponent implements OnInit {
  viewMore = true;
  limit = 3; // config
  defaultLimit = 3;
  userProfile: IUserProfile;
  privateProfileFields = true;
  action: string;
  allowedAction = ['add'];
  constructor(public resourceService: ResourceService,
    public userService: UserService, public profileService: ProfileService,
    public activatedRoute: ActivatedRoute, private router: Router) { }

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
  }
  toggle(lim) {
    if (lim === true) {
      this.limit = this.userProfile.skills.length;
      this.viewMore = false;
    } else {
      this.viewMore = true;
      this.limit = 3;
    }
  }
}
