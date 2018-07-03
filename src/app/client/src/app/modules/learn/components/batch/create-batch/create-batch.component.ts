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

  @ViewChild('createBatchModel') private createBatchModel;

  private userSearchTime: any;
  /**
  * batchId
  */
  private batchId: string;

  showCreateModal = false;

  disableSubmitBtn = false;

  private courseId: string;
  /**
  * courseCreatedBy
  */
  courseCreatedBy: string;
  /**
  * participantList for mentorList
  */
  participantList = [];
  /**
  * batchData for form
  */
  batchData: any;
  /**
  * mentorList for mentors in the batch
  */
  mentorList: Array<any> = [];
  /**
   * form group for batchAddUserForm
  */
  createBatchForm: FormGroup;
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
  * Reference of UserService
  */
  private userService: UserService;
  /**
  * Reference of UserService
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

  private userDataSubscription: Subscription;

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
    this.activatedRoute.parent.params.subscribe(params => {
      this.courseId = params.courseId;
      this.getCourseData();
      this.setTelemetryImpressionData();
      this.getUserList();
      this.initializeFormFields();
    });
  }
  /**
  * It helps to initialize form fields and apply field level validation
  */
  private initializeFormFields(): void {
    this.createBatchForm = new FormGroup({
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
    this.createBatchForm.valueChanges.subscribe(val => {
      this.enableButton();
    });
  }
  /**
  *  api call to get user list
  */
  private getUserList(query: string = '', type?) {
    const requestBody = {
      filters: {},
      query: query
    };
    this.courseBatchService.getUserList(requestBody).takeUntil(this.unsubscribe)
      .subscribe((res) => {
        const list = this.sortUsers(res);
        if (type) {
          if (type === 'participant') {
            this.participantList = list.participantList;
          } else {
            this.mentorList = list.mentorList;
          }
        } else {
          this.participantList = list.participantList;
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
  private sortUsers(res) {
    const participantList = [];
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
          participantList.push(user);
        }
      });
    }
    return {
      participantList: _.uniqBy(participantList, 'id'),
      mentorList: _.uniqBy(mentorList, 'id')
    };
  }
  private getCourseData() {
    this.courseConsumptionService.getCourseHierarchy(this.courseId).takeUntil(this.unsubscribe)
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

  public createBatch() {
    this.disableSubmitBtn = true;
    let participants = [];
    let mentors = [];
    if (this.createBatchForm.value.enrollmentType !== 'open') {
      participants = $('#participants').dropdown('get value') ? $('#participants').dropdown('get value').split(',') : [];
      mentors = $('#mentors').dropdown('get value') ? $('#mentors').dropdown('get value').split(',') : [];
    }
    const startDate = new Date(this.createBatchForm.value.startDate.setHours(23, 59, 59, 999));
    const endDate = this.createBatchForm.value.endDate && new Date(this.createBatchForm.value.endDate.setHours(23, 59, 59, 999));
    const requestBody = {
      'courseId': this.courseId,
      'name': this.createBatchForm.value.name,
      'description': this.createBatchForm.value.description,
      'enrollmentType': this.createBatchForm.value.enrollmentType,
      'startDate': startDate,
      'endDate': endDate || null,
      'createdBy': this.userService.userid,
      'createdFor': this.userService.userProfile.organisationIds,
      'mentors': _.compact(mentors)
    };
    this.courseBatchService.createBatch(requestBody).takeUntil(this.unsubscribe)
      .subscribe((response) => {
        if (participants && participants.length > 0) {
          this.addParticipantToBatch(response.result.batchId, participants);
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
  private addParticipantToBatch(batchId, participants) {
    const userRequest = {
      userIds: _.compact(participants)
    };
    this.courseBatchService.addUsersToBatch(userRequest, batchId).takeUntil(this.unsubscribe)
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
      });
  }
  public redirect() {
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }
  private reload() {
    setTimeout(() => {
      this.courseBatchService.updateEvent.emit({ event: 'create' });
      this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    }, 1000);
  }

  private enableButton() {
    const data = this.createBatchForm ? this.createBatchForm.value : '';
    if (this.createBatchForm.status === 'VALID' && (data.name && data.startDate)) {
      this.disableSubmitBtn = false;
    } else {
      this.disableSubmitBtn = true;
    }
  }

  private getUserOtherDetail(userData) {
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
  ngAfterViewInit() {
    setTimeout(() => {
      $('#participants').dropdown({
        forceSelection: false,
        fullTextSearch: true,
        onAdd: () => {
        }
      });
      $('#mentors').dropdown({
        fullTextSearch: true,
        forceSelection: false,
        onAdd: () => {
        }
      });
      $('#participants input.search').on('keyup', (e) => {
        this.getUserListWithQuery($('#participants input.search').val(), 'participant');
      });
      $('#mentors input.search').on('keyup', (e) => {
        this.getUserListWithQuery($('#mentors input.search').val(), 'mentor');
      });
    }, 1000);
  }
  private getUserListWithQuery(query, type) {
    this.disableSubmitBtn = false;
    if (this.userSearchTime) {
      clearTimeout(this.userSearchTime);
    }
    this.userSearchTime = setTimeout(() => {
      this.getUserList(query, type);
    }, 1000);
  }
  private setTelemetryImpressionData() {
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
}
