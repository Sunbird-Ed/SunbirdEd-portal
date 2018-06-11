import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash';

@Component({
  selector: 'app-update-course-batch',
  templateUrl: './update-course-batch.component.html',
  styleUrls: ['./update-course-batch.component.css']
})
export class UpdateCourseBatchComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('updateBatchModal') updateBatchModal;
  /**
  * batchId
  */
  batchId: string;
  showUpdateModal = false;
  disableSubmitBtn = false;
  courseId: string;
  orgIds: Array<string>;
  selectedUsers: any = [];
  selectedMentors: any = [];
  userSearchTime: any;
  /**
  * courseCreatedBy
  */
  courseCreatedBy: string;
  /**
  * userList for mentorlist
  */
  userList = [];

  /**
  * batchDetails for form
  */
  batchDetails: any;
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
  batchUpdateForm: FormGroup;
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
	 * telemetryImpression object for update batch page
	*/
  telemetryImpression: IImpressionEventInput;
  pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
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
        this.getUserList();
      }
    });
    Observable.combineLatest(this.activatedRoute.params, this.activatedRoute.parent.params,
      (params, parentParams) => { return { ...params, ...parentParams };
    }).subscribe((params) => {
        this.batchId = params.batchId;
        this.courseId = params.courseId;

        // Create the telemetry impression event for update batch page
        this.telemetryImpression = {
          context: {
            env: this.activatedRoute.snapshot.data.telemetry.env
          },
          edata: {
            type: this.activatedRoute.snapshot.data.telemetry.type,
            pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
            uri: '/update/batch/' + this.batchId
          },
          object: {
            id: this.batchId,
            type: this.activatedRoute.snapshot.data.telemetry.object.type,
            ver: this.activatedRoute.snapshot.data.telemetry.object.ver,
            rollup: {
              l1: this.courseId,
              l2: this.batchId
            }
          }
        };

        this.getCourseData();
        this.getBatchDetails();
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
    this.courseBatchService.getUserList(requestBody).subscribe((res) => {
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
    if (this.updateBatchModal && this.updateBatchModal.deny) {
      this.updateBatchModal.deny();
    }
  }
  getBatchDetails() {
    this.courseBatchService.getUpdateBatchDetails(this.batchId).subscribe((data) => {
      this.batchDetails = data;
      this.initializeFormFields();
      this.fetchParticipantsMentorsDetails();
    }, (err) => {
      if (err.error && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0054);
      }
      this.redirect();
    });
  }
  /**
  * It helps to initialize form fields and apply field level validation
  */
  initializeFormFields(): void {
    const endDate = this.batchDetails.endDate ? new Date(this.batchDetails.endDate) : null;
    this.batchUpdateForm = new FormGroup({
      name: new FormControl(this.batchDetails.name, [Validators.required]),
      description: new FormControl(this.batchDetails.description),
      enrollmentType: new FormControl(this.batchDetails.enrollmentType, [Validators.required]),
      startDate: new FormControl(new Date(this.batchDetails.startDate), [Validators.required]),
      endDate: new FormControl(endDate),
      mentors: new FormControl(),
      users: new FormControl()
    });
    // this.batchUpdateForm.valueChanges.subscribe(val => {
    //   this.enableButton();
    // });
  }

  fetchParticipantsMentorsDetails() {
    if (this.batchDetails.participant || ( this.batchDetails.mentors && this.batchDetails.mentors.length > 0)) {
      const request =  {
        filters: {
          identifier: _.union(_.keys(this.batchDetails.participant), this.batchDetails.mentors)
        }
      };
      this.courseBatchService.getUserDetails(request).subscribe((res) => {
        // this.batchDetails.participantDetails = res.result.response.content;
        this.processParticipantsMentorsDetails(res);
        this.showUpdateModal = true;
      }, (err) => {
        if (err.error && err.error.params.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0056);
        }
        this.redirect();
      });
    } else {
      this.showUpdateModal = true;
    }
  }
  processParticipantsMentorsDetails(res) {
    const users = this.formatUserList(res);
    const userList = users.userList;
    const mentorList = users.mentorList;
    _.forEach(this.batchDetails.participant, (value, key) => {
      if (!_.isUndefined(_.find(userList, ['id', key]))) {
        this.selectedUsers.push(_.find(userList, ['id', key]));
      }
    });
    this.selectedUsers = _.uniqBy(this.selectedUsers, 'id');
    _.forEach(this.batchDetails.mentors, (mentorVal, key) => {
      if (!_.isUndefined(_.find(mentorList, ['id', mentorVal]))) {
        this.selectedMentors.push(_.find(mentorList, ['id', mentorVal]));
      }
    });
    this.selectedMentors = _.uniqBy(this.selectedMentors, 'id');
  }
  getCourseData() {
    this.courseConsumptionService.getCourseHierarchy(this.courseId).subscribe((res) => {
      this.courseCreatedBy = res.createdBy;
    },
    (err) => {
        // this.toasterService.error(this.resourceService.messages.fmsg.m0056);
    });
  }

  updateBatch() {
    let users = [];
    let mentors = [];
    if (this.batchUpdateForm.value.enrollmentType !== 'open') {
      users = $('#users').dropdown('get value').split(',');
      mentors = $('#mentors').dropdown('get value').split(',');
    }
    const startDate = new Date(this.batchUpdateForm.value.startDate.setHours(23, 59, 59, 999));
    const endDate = this.batchUpdateForm.value.endDate ?
    new Date(this.batchUpdateForm.value.endDate.setHours(23, 59, 59, 999)) : null;
    const requestBody = {
      'id': this.batchId,
      'name': this.batchUpdateForm.value.name,
      'description': this.batchUpdateForm.value.description,
      'enrollmentType': this.batchUpdateForm.value.enrollmentType,
      'startDate': startDate,
      'endDate': endDate,
      'createdFor': this.orgIds,
      'mentors': _.compact(mentors)
    };
    if (this.batchUpdateForm.value.enrollmentType !== 'open') {
      const selected = [];
      _.forEach(this.selectedMentors, (value) => {
        selected.push(value.id);
      });
      requestBody['mentors'] = _.concat(_.compact(requestBody['mentors']), selected);
    }
    this.courseBatchService.updateBatch(requestBody).subscribe((response) => {
      if (users && users.length > 0) {
        this.updateUserToBatch(this.batchId, users);
      } else {
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        this.reload();
      }
    },
    (err) => {
      if (err.error && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0052);
      }
    });
  }
  updateUserToBatch(batchId, users) {
    const userRequest = {
      userIds: _.compact(users)
    };
    setTimeout(() => {
      this.courseBatchService.addUsersToBatch(userRequest, batchId).subscribe((res) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        this.reload();
      },
      (err) => {
        if (err.params && err.error.params.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0053);
        }
      });
    }, 1000);
  }
  redirect() {
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }
  reload() {
    this.courseBatchService.updateEvent.emit({event: 'update'});
    this.router.navigate(['./'], {relativeTo: this.activatedRoute.parent});
  }

  enableButton() {
    const data = this.batchUpdateForm ? this.batchUpdateForm.value : '';
    if (this.batchUpdateForm.status === 'VALID' && (data.name && data.startDate)) {
      this.disableSubmitBtn = false;
    } else {
      this.disableSubmitBtn = true;
    }
  }
  /**
  *  api call to get user list
  */
  // getUserList() {
  //   const requestBody = {
  //     filters: {}
  //   };
  //   this.courseBatchService.getUserList(requestBody).subscribe((res) => {
  //     const users = this.formatUserList(res);
  //     this.userList = users.userList;
  //     this.mentorList = users.mentorList;
  //   },
  //   (err) => {
  //     if (err.params && err.errorparams.errmsg) {
  //       this.toasterService.error(err.error.params.errmsg);
  //     } else {
  //       this.toasterService.error(this.resourceService.messages.fmsg.m0056);
  //     }
  //     this.toasterService.error(this.resourceService.messages.fmsg.m0056);
  //   });
  // }
  // formatUserList(res) {
  //   const userList = [];
  //   const mentorList = [];
  //   if (res.result.response.content && res.result.response.content.length > 0) {
  //     _.forEach(res.result.response.content, (userData) => {
  //       if (userData.identifier !== this.userService.userid) {
  //         const user = {
  //           id: userData.identifier,
  //           name: userData.firstName + (userData.lastName ? ' ' + userData.lastName : ''),
  //           avatar: userData.avatar,
  //           otherDetail: this.getUserOtherDetail(userData)
  //         };
  //         _.forEach(userData.organisations, (userOrgData) => {
  //           if (_.indexOf(userOrgData.roles, 'COURSE_MENTOR') !== -1) {
  //             mentorList.push(user);
  //           }
  //         });
  //         userList.push(user);
  //       }
  //     });
  //     return {
  //       userList : _.uniqBy(userList, 'id'),
  //       mentorList : _.uniqBy(mentorList, 'id')
  //     };
  //   }
  // }
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
