import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkSpaceService } from './../../../../workspace/services';
import { UserService } from '@sunbird/core';
import { WorkSpace } from './../../../../workspace/classes/workspace';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import * as _ from 'lodash';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.css']
})
export class CreateBatchComponent implements OnInit, OnDestroy {

  @ViewChild('updateBatch') updateBatch;
  /**
  * batchId
  */
  batchId: string;
  showCreateModal = false;
  disableSubmitBtn = true;
  courseId: string;
  orgIds: Array<string>;
  /**
  * courseCreatedBy
  */
  courseCreatedBy: string;
  /**
  * userList for mentorlist
  */
  userList = [];

  /**
  * batchData for form
  */
  batchData: any;
  /**
  * menterList for mentors in the batch
  */
  mentorList: Array<any> = [];

  /**
  * userId for checking the enrollment type.
  */
  userId: string;
  /**
   * form group for batchAddUserForm
  */
  batchAddUserForm: FormGroup;
  /**
  * To navigate to other pages
  */
  router: Router;
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to update batch  component
  */
  private activatedRoute: ActivatedRoute;
  /**
  * Refrence of UserService
  */
  private userService: UserService;
  /**
  * Refrence of UserService
  */
  private courseBatchService: CourseBatchService;
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;

  public courseConsumptionService: CourseConsumptionService;
  /**
	 * Constructor to create injected service(s) object
	 * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
   * @param {Router} router Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {UserService} UserService Reference of UserService
  */
  constructor(routerNavigationService: RouterNavigationService,
    activatedRoute: ActivatedRoute,
    route: Router,
    resourceService: ResourceService, userService: UserService,
    courseBatchService: CourseBatchService,
    toasterService: ToasterService,
    courseConsumptionService: CourseConsumptionService) {
    this.resourceService = resourceService;
    this.router = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.courseBatchService = courseBatchService;
    this.toasterService = toasterService;
    this.courseConsumptionService = courseConsumptionService;
  }

  /**
   * Initialize form fields and getuserlist
  */
  ngOnInit() {
    this.userService.userData$.subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.userId = userdata.userProfile.userId;
        this.orgIds = userdata.userProfile.organisationIds;
        this.initializeFormFields();
      }
    });
    this.getUserList();
    this.activatedRoute.parent.params.subscribe(params => {
      this.courseId = params.courseId;
      this.getCourseData();
    });
  }
  ngOnDestroy() {
    if (this.updateBatch && this.updateBatch.deny) {
      this.updateBatch.deny();
    }
  }
  getCourseData() {
    this.courseConsumptionService.getCourseHierarchy(this.courseId).subscribe((res) => {
      this.courseCreatedBy = res.createdBy;
    },
    (err) => {
        // this.toasterService.error(this.resourceService.messages.fmsg.m0056);
    });
  }

  createBatch() {
    console.log(this.batchAddUserForm);
    const requestBody = {
      'courseId': this.courseId,
      'name': this.batchAddUserForm.value.name,
      'description': this.batchAddUserForm.value.description,
      'enrollmentType': this.batchAddUserForm.value.enrollmentType,
      'startDate': this.batchAddUserForm.value.startDate,
      'endDate': this.batchAddUserForm.value.endDate,
      'createdBy': this.userId,
      'createdFor': this.orgIds,
      'mentors': this.batchAddUserForm.value.mentors
    };
    this.courseBatchService.createBatch(requestBody).subscribe((response) => {
      if (this.batchAddUserForm.value.users && this.batchAddUserForm.value.users.length > 0) {
        this.addUserToBatch(response.result.batchId);
      } else {
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        this.reload();
      }
    },
    (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0052);
    });
  }
  addUserToBatch(batchId) {
    const userRequest = {
      userIds: this.batchAddUserForm.value.users
    };
    setTimeout(() => {
      this.courseBatchService.addUsersToBatch(userRequest, batchId).subscribe((res) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        this.reload();
      },
      (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0053);
      }
    );
    }, 1000);
  }
  redirect() {
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }
  reload() {
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }

  /**
  * It helps to initialize form fields and apply field level validation
  */
  initializeFormFields(): void {
    this.batchAddUserForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      enrollmentType: new FormControl('invite-only', [Validators.required]),
      startDate: new FormControl(new Date(), [Validators.required]),
      endDate: new FormControl(new Date()),
      mentors: new FormControl(''),
      users: new FormControl(''),
    });
    this.showCreateModal = true;
    this.batchAddUserForm.valueChanges.subscribe(val => {
      this.enableButton();
    });
  }

  filterUserSearchResult(userData, query?) {
    if (query) {
      const fname = userData.firstName !== null && userData.firstName.includes(query);
      const lname = userData.lastName !== null && userData.lastName.includes(query);
      const email = userData.email !== null && userData.email.includes(query);
      const phone = userData.phone !== null && userData.phone.includes(query);
      return fname || lname || email || phone;
    } else {
      return true;
    }
  }

  enableButton() {
    const data = this.batchAddUserForm ? this.batchAddUserForm.value : '';
    if (this.batchAddUserForm.status === 'VALID' && (data.name && data.startDate)) {
      this.disableSubmitBtn = false;
    } else {
      this.disableSubmitBtn = true;
    }
  }
  /**
  *  api call to get user list
  */
  getUserList() {
    const requestBody = {
      filters: {}
    };
    this.courseBatchService.getUserList(requestBody).subscribe((res: ServerResponse) => {
      this.formatUserList(res);
    },
    (err: ServerResponse) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0056);
    });
  }
  formatUserList(res) {
    if (res.result.response.content && res.result.response.content.length > 0) {
      _.forEach(res.result.response.content, (userData) => {
        if (userData.identifier !== this.userService.userid) {
          const user = {
            id: userData.identifier,
            name: userData.firstName + (userData.lastName ? ' ' + userData.lastName : ''),
            avatar: userData.avatar,
            otherDetail: this.getUserOtherDetail(userData)
          };
          _.forEach(userData.organisations, (userOrgData) => {
            if (_.indexOf(userOrgData.roles, 'COURSE_MENTOR') !== -1) {
              this.mentorList.push(user);
            }
          });
          this.userList.push(user);
        }
      });
      this.userList = _.uniqBy(this.userList, 'id');
      this.mentorList = _.uniqBy(this.mentorList, 'id');
    }
  }
  getUserOtherDetail(userData) {
    if (userData.email && userData.phone) {
      return ' (' + userData.email + ', ' + userData.phone + ')';
    }
    if (userData.email && !userData.phone) {
      return ' (' + userData.email + ')';
    }
    if (!userData.email && userData.phone) {
      return ' (' + userData.phone + ')';
    }
  }
}



