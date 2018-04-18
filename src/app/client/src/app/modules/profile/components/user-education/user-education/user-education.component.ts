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
@Component({
  selector: 'app-user-education',
  templateUrl: './user-education.component.html',
  styleUrls: ['./user-education.component.css']
})
export class UserEducationComponent implements OnInit {
  @ViewChildren('edit') editChild: QueryList<EditUserEducationComponent>;
  @ViewChild('add') addChild: EditUserEducationComponent;
  userProfile: IUserProfile;
  privateProfileFields = true;
  action: string;
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
  }
  editEducation() {
    const editedEdu = [];
    this.editChild.forEach((child) => {
      if (child.educationForm.touched === true && child.educationForm.valid === true) {
        const addEdu: any = {};
        _.forIn(child.educationForm.value, (value, key) => {
          if (value !== undefined && value !== '' && value !== null) {
            if (key === 'joiningDate' || key === 'endDate') {
              addEdu[key] = moment(value).format('YYYY-MM-DD');
            } else {
              addEdu[key] = value;
            }
          }
        });
        addEdu['id'] = child.education.id;
        addEdu.userId = child.education.userId;
        editedEdu.push(addEdu);
      } else {
        alert('invalid');
      }
    });
    editedEdu['userId'] = this.userService.userid;
    const req = {
      education: editedEdu
    };
    this.profileService.updateProfile(req).subscribe(res => {
      this.router.navigate(['/profile']);
      // toaster suc
    },
      err => {
        // toaster err
      });
  }
  addEducation() {
    const addEdu: any = {};
    _.forIn(this.addChild.educationForm.value, (value, key) => {
      console.log('value', value);
      if (value && value !== '' && value !== null) {
        if (key === 'joiningDate' || key === 'endDate') {
          addEdu[key] = moment(value).format('YYYY-MM-DD');
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
      // if (res.responseCode === 'OK') {
        this.action = 'view';
        this.router.navigate(['/profile']);
        // toaster suc
        this.toasterService.success(this.resourceService.messages.smsg.m0024);
      // }
    },
      err => {
        // toaster err
        this.toasterService.error(this.resourceService.messages.fmsg.m0076);
      });
  }
  deleteEducation(deletedEdu) {
    const request = {
      education: [deletedEdu]
    };
    this.profileService.updateProfile(request).subscribe(res => {
      // toaster suc
    },
      err => {
        // toaster err
      });
  }
}
