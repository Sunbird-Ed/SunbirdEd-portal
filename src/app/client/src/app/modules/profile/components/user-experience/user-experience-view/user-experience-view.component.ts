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
@Component({
  selector: 'app-user-experience-view',
  templateUrl: './user-experience-view.component.html',
  styleUrls: ['./user-experience-view.component.css']
})
export class UserExperienceViewComponent implements OnInit {
  @ViewChildren('edit') editChild: QueryList<EditExperienceComponent>;
  @ViewChild('add') addChild: EditExperienceComponent;
  userProfile: IUserProfile;
  privateProfileFields = true;
  action: string;
  isCurrentJobExist = false;
  allowedAction = ['edit', 'add'];

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
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
      if (params.section && params.section === 'experience' && this.allowedAction.indexOf(params.action) > -1) {
        this.action = params.action;
      } else if (params.section && params.section === 'experience' && this.allowedAction.indexOf(params.action) === -1) {
        this.router.navigate(['/profile']);
      } else {
        this.action = 'view';
      }
    });
  }

  deleteExperience(deletedExp) {
    const request = {
      jobProfile: [deletedExp]
    };
    this.profileService.updateProfile(request).subscribe(res => {
      // toaster suc
      this.toasterService.success(this.resourceService.messages.smsg.m0015);
    },
      err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0042);
      });
  }

  editExperience() {
    const editedExp = [];
    this.editChild.forEach((child) => {
      console.log('form check', child.experienceForm, child.experienceForm.touched);
      if (child.experienceForm.touched === true) {
        const addExp: any = {};
        _.forIn(child.experienceForm.value, (value, key) => {
          if (value !== undefined && value !== '' && value !== null) {
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

      }
    });
    editedExp['userId'] = this.userService.userid;
    const req = {
      jobProfile: editedExp
    };
    if (req.jobProfile.length > 0) {
      this.profileService.updateProfile(req).subscribe(res => {
        this.router.navigate(['/profile']);
        // toaster suc
        this.toasterService.success(this.resourceService.messages.smsg.m0021);
      },
        err => {
          // toaster err
          console.log('err', err);
          this.toasterService.error(err.error.params.errmsg);
        });
    } else {
      // this.toasterService.success(this.resourceService.messages.smsg.m0021);
      this.router.navigate(['/profile']);
    }
  }

  addExperience() {
    const addExp: any = {};
    _.forIn(this.addChild.experienceForm.value, (value, key) => {
      if (value && value !== '' && value !== null) {
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
      console.log('res', res);
      // if (res.responseCode === 'OK') {
      this.action = 'view';
      this.router.navigate(['/profile']);
      // toaster suc
      this.toasterService.success(this.resourceService.messages.smsg.m0025);
      // }
    },
      (err: ServerResponse) => {
        // toaster err
        this.toasterService.error(this.resourceService.messages.fmsg.m0076);
      });
  }
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
}
