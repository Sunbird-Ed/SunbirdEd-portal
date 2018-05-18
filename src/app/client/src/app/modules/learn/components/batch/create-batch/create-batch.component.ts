import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkSpaceService } from './../../../../workspace/services';
import { SearchService, UserService, LearnerService } from '@sunbird/core';
import { IMenter, Ibatch } from './../../../../workspace/interfaces';
import { WorkSpace } from './../../../../workspace/classes/workspace';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import * as _ from 'lodash';
@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.css']
})
export class CreateBatchComponent implements OnInit {

  /**
  * batchId
  */
  batchId: string;
  showCreateModal = false;
  disableSubmitBtn = true;
  courseId: string;
  courseCreatedBy: string;
  orgIds: Array<string>;
  /**
  * coursecreatedby
  */
  coursecreatedby: string;
  /**
  * selectedUsers for mentorlist
  */
  selectedUsers = [];
  /**
  * selectedMentors for mentorlist
  */
  selectedMentors = [];
  /**
  * userList for mentorlist
  */
  userList = [];

  /**
  * batchData for form
  */
  batchData: Ibatch;
  /**
  * menterList for mentors in the batch
  */
  menterList: Array<IMenter> = [];

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
  route: Router;

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
  private batchService: CourseBatchService;
  /**
    * Reference for WorkSpaceService
  */
  public workSpaceService: WorkSpaceService;
  /**
   * To navigate back to parent component
  */
  public routerNavigationService: RouterNavigationService;
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;

  public courseConsumptionService: CourseConsumptionService;
  public learnerService: LearnerService;



  /**
	 * Constructor to create injected service(s) object
	 * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
   * @param {WorkSpaceService} WorkSpaceService Reference of WorkSpaceService
   * @param {Router} route Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {UserService} UserService Reference of UserService
   * @param {SearchService} SearchService Reference of SearchService
  */
  constructor(routerNavigationService: RouterNavigationService,
    activatedRoute: ActivatedRoute,
    route: Router, workSpaceService: WorkSpaceService,
    resourceService: ResourceService, userService: UserService,
    public searchService: SearchService,
    batchService: CourseBatchService,
    toasterService: ToasterService,
    courseConsumptionService: CourseConsumptionService) {
    this.routerNavigationService = routerNavigationService;
    this.workSpaceService = workSpaceService;
    this.resourceService = resourceService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.batchService = batchService;
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
      }
    });

    this.getUserList();
    this.activatedRoute.parent.params.subscribe(params => {
      this.courseId = params.courseId;
      this.getCourseData();
    });
  }

  getCourseData () {


    this.courseConsumptionService.getCourseHierarchy(this.courseId).subscribe(
      (res) => {
        console.log('res', res);
        this.courseCreatedBy = res.createdBy;
      },
      (err) => {
        // this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    );


  }


  createBatch () {
    const data = this.batchAddUserForm ? this.batchAddUserForm.value : '';
    const requestBody = {
      'request': {
        'courseId': this.courseId,
        'name': data.name,
        'description': data.description,
        'enrollmentType': data.enrollmentType,
        'startDate': data.startDate,
        'endDate': data.startDate,
        'createdBy': this.userId,
        'createdFor': this.orgIds,
        'mentors': data.mentors
      }
    };

    this.batchService.createBatch(requestBody).subscribe(
      (res) => {
        console.log('res', res);
        // this.courseCreatedBy = res.createdBy;
      },
      (err) => {
        // this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    );

    console.log('requestBody', requestBody);
  }
  /**
  * Used to redirect user to batchlist   page.
  *
  * Function gets executed when user click close icon of batchAddUserForm form
  */
  redirectTobatches(): void {
    this.routerNavigationService.navigateToParentUrl(this.activatedRoute.snapshot);
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
    this.onFormValueChanges();
  }

  filterUserSearchResult(userData, query) {
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

  enableButton() {
    const data = this.batchAddUserForm ? this.batchAddUserForm.value : '';

    console.log('this.batchAddUserForm', this.batchAddUserForm);
    console.log('data', data);



    if (this.batchAddUserForm.status === 'VALID' && (data.name && data.startDate)) {
      this.disableSubmitBtn = false;
    } else {
      this.disableSubmitBtn = true;
    }
  }

  /**
  * Function used to detect form input value changes.
  * Set meta data modified flag to true when user enter new value
  */
  onFormValueChanges(): void {
    this.batchAddUserForm.valueChanges.subscribe(val => {
      this.enableButton();
    });
  }

  /**
  *  api call to get user list
  */
  getUserList(query?: string, users?: string[]) {
    // const request = this.batchService.getRequestBodyForUserSearch(query, users);
    const userId = this.userService.userid;
    const requestBody = {
      filters: {}
    };
    this.batchService.getUserList(requestBody).subscribe(
      (res: ServerResponse) => {
        if (res.result.response.count && res.result.response.content.length > 0) {
          _.forEach(res.result.response.content, (userData) => {
            if (userData.identifier !== userId) {
              if (this.filterUserSearchResult(userData, query)) {
                const user = {
                  id: userData.identifier,
                  name: userData.firstName + (userData.lastName ? ' ' + userData.lastName : ''),
                  avatar: userData.avatar,
                  otherDetail: this.getUserOtherDetail(userData)
                };
                _.forEach(userData.organisations, (userOrgData) => {
                  if (_.indexOf(userOrgData.roles, 'COURSE_MENTOR') !== -1) {
                    this.menterList.push(user);
                  }
                });
                this.userList.push(user);
              }
            }
          });
          this.userList = _.uniqBy(this.userList, 'id');
          this.menterList = _.uniqBy(this.menterList, 'id');
          this.initializeFormFields();
        } else {
          this.initializeFormFields();
        }
      },
      (err: ServerResponse) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
      }
    );
  }

  /**
  *  reset the Form
  */
  clearForm() {
    this.batchAddUserForm.reset();
  }
}



