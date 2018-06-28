import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkSpaceService } from './../../../../workspace/services';
import { UserService } from '@sunbird/core';
import { WorkSpace } from './../../../../workspace/classes/workspace';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.css']
})
export class CreateBatchComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('createBatchModel') createBatchModel;
  /**
  * batchId
  */
  userSearchTime: any;
  batchId: string;
  showCreateModal = false;
  disableSubmitBtn = false;
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
  createBatchUserForm: FormGroup;
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

  /**
	 * telemetryImpression object for create batch page
	*/
  telemetryImpression: IImpressionEventInput;
  userDataSubscription: Subscription;
  public unsubscribe = new Subject<void>();

  public courseConsumptionService: CourseConsumptionService;
  pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
  pickerMinDateForEndDate = new Date(this.pickerMinDate.getTime() + (24 * 60 * 60 * 1000));

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
    this.userDataSubscription = this.userService.userData$.subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.userId = userdata.userProfile.userId;
        this.orgIds = userdata.userProfile.organisationIds;
        this.getUserList();
        this.initializeFormFields();
      }
    });
    this.activatedRoute.parent.params.subscribe(params => {
      this.courseId = params.courseId;

      // Create the telemetry impression event for create batch page
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: '/create/batch'
        }
      };

      this.getCourseData();
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      $('#users').dropdown({
        forceSelection: false,
        fullTextSearch: true,
        onAdd: () =>  {
        }
      });
      $('#mentors').dropdown({
        fullTextSearch: true,
        forceSelection: false,
        onAdd: () =>  {
        }
      });
      $('#users input.search').on('keyup', (e) =>  {
        this.getUserListWithQuery($('#users input.search').val(), 'userList');
      });
      $('#mentors input.search').on('keyup', (e) => {
        this.getUserListWithQuery($('#mentors input.search').val(), 'mentorList');
      });
    }, 1000);
  }
  getUserListWithQuery(query, type) {
    this.disableSubmitBtn = false;
    if (this.userSearchTime) {
      clearTimeout(this.userSearchTime);
    }
    this.userSearchTime = setTimeout(() => {
      this.getUserList(query, type);
    }, 1000);
  }
  /**
  *  api call to get user list
  */
  getUserList(query: string = '', type?) {
    const requestBody = {
      filters: {},
      query: query
    };
    this.courseBatchService.getUserList(requestBody)
    .takeUntil(this.unsubscribe)
    .subscribe((res) => {
      const list = this.formatUserList(res);
      if (type) {
        if (type === 'userList') {
          this.userList = list.userList;
        } else {
          this.mentorList = list.mentorList;
        }
        this[type] = list[type];
      } else {
        this.userList = list.userList;
        this.mentorList = list.mentorList;
      }

    },
    (err) => {
      if (err.error && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    });
  }
  formatUserList(res) {
    const userList = [];
    const mentorList = [];
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
              mentorList.push(user);
            }
          });
          userList.push(user);
        }
      });
    }
    return {
      userList: _.uniqBy(userList, 'id'),
      mentorList: _.uniqBy(mentorList, 'id')
    };
  }
  ngOnDestroy() {
    if (this.createBatchModel && this.createBatchModel.deny) {
      this.createBatchModel.deny();
    }
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  getCourseData() {
    this.courseConsumptionService.getCourseHierarchy(this.courseId)
    .takeUntil(this.unsubscribe)
    .subscribe((res) => {
      this.courseCreatedBy = res.createdBy;
    },
    (err) => {
      if (err.error && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    });
  }

  createBatch() {
    let users = [];
    let mentors = [];
    if ( this.createBatchUserForm.value.enrollmentType !== 'open') {
      users = $('#users').dropdown('get value') ? $('#users').dropdown('get value').split(',') : [];
      mentors = $('#mentors').dropdown('get value') ? $('#mentors').dropdown('get value').split(',') : [];
    }
    const startDate = new Date(this.createBatchUserForm.value.startDate.setHours(23, 59, 59, 999));
    const endDate = this.createBatchUserForm.value.endDate ?
    new Date(this.createBatchUserForm.value.endDate.setHours(23, 59, 59, 999)) : null;
    const requestBody = {
      'courseId': this.courseId,
      'name': this.createBatchUserForm.value.name,
      'description': this.createBatchUserForm.value.description,
      'enrollmentType': this.createBatchUserForm.value.enrollmentType,
      'startDate': startDate,
      'endDate': endDate,
      'createdBy': this.userId,
      'createdFor': this.orgIds,
      'mentors': _.compact(mentors)
    };
this.disableSubmitBtn = true;
this.courseBatchService.createBatch(requestBody)
    .takeUntil(this.unsubscribe)
    .subscribe((response) => {
      if (users && users.length > 0) {
        this.addUserToBatch(response.result.batchId, users);
      } else {
        this.disableSubmitBtn = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        this.reload();
      }
    },
    (err) => {
      this.disableSubmitBtn = false;
      if (err.error && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0052);
      }
    });
  }
  addUserToBatch(batchId, users) {
    const userRequest = {
      userIds: _.compact(users)
    };
    setTimeout(() => {
      this.courseBatchService.addUsersToBatch(userRequest, batchId)
      .takeUntil(this.unsubscribe)
      .subscribe((res) => {
        this.disableSubmitBtn = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        this.reload();
      },
      (err) => {
        this.disableSubmitBtn = false;
        if (err.error && err.error.params.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0053);
        }
      }
    );
    }, 1000);
  }
  redirect() {
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }
  reload() {
    this.courseBatchService.updateEvent.emit({event: 'create'});
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }

  /**
  * It helps to initialize form fields and apply field level validation
  */
  initializeFormFields(): void {
    this.createBatchUserForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      enrollmentType: new FormControl('invite-only', [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(),
      mentors: new FormControl(),
      users: new FormControl(),
    });
    this.disableSubmitBtn = true;
    this.showCreateModal = true;
    this.createBatchUserForm.valueChanges
    .takeUntil(this.unsubscribe)
    .subscribe(val => {
      this.enableButton();
    });
  }

  enableButton() {
    const data = this.createBatchUserForm ? this.createBatchUserForm.value : '';
    if (this.createBatchUserForm.status === 'VALID' && (data.name && data.startDate)) {
      this.disableSubmitBtn = false;
    } else {
      this.disableSubmitBtn = true;
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
