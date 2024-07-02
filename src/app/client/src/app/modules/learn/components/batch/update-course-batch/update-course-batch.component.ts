import { IInteractEventEdata } from './../../../../telemetry/interfaces/telemetry';

import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {combineLatest, Subject, forkJoin} from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { RouterNavigationService, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import { IImpressionEventInput, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import dayjs from 'dayjs';
import { LazzyLoadScriptService } from 'LazzyLoadScriptService';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from '../../../../../service/CsLibInitializer/cs-lib-initializer.service';
import { IFetchForumConfig } from '../../../../groups/interfaces';
import { DiscussionService } from '../../../../../../app/modules/discussion/services/discussion/discussion.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-update-course-batch',
  templateUrl: './update-course-batch.component.html'
})
export class UpdateCourseBatchComponent implements OnInit, OnDestroy, AfterViewInit {

  private updateBatchModal;

  @ViewChild('updateBatchModal') set setBatchModal(element) {
    if (element) {
      this.updateBatchModal = element;
    }
    // this.initDropDown();
  }
  /**
  * batchId
  */
  private batchId: string;

  public showUpdateModal = false;

  public disableSubmitBtn = false;

  private courseId: string;

  public selectedParticipants: any = [];

  public showFormInViewMode: boolean;

  public selectedMentors: any = [];

  private userSearchTime: any;
  private removedUsers: any = [];

  forumIds: any;
  fetchForumIdReq: any;
  private discussionCsService: any;
  createForumRequest: any;
  showDiscussionForum: string;

  /**
   * To fetch create-forum request payload for batch
   */
   fetchForumConfigReq: Array<IFetchForumConfig>;
  /**
	 * This variable hepls to show and hide loader.
   * It is kept true by default as at first when we comes
   * to a popup the loader should be displayed before the
   * data is loaded
	 */
  public showLoader = true;

  /**
  * courseCreator
  */
  public courseCreator = false;
  /**
  * participantList for users
  */
  public participantList = [];
  /**
  * batchDetails for form
  */
  private batchDetails: any;
  /**
  * mentorList for mentors in the batch
  */
  public mentorList: Array<any> = [];
  /**
   * form group for batchAddUserForm
  */
  public batchUpdateForm: UntypedFormGroup;
  /**
  * To navigate to other pages
  */
  public router: Router;
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
  public telemetryImpression: IImpressionEventInput;

  public pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));

  public pickerMinDateForEndDate = new Date(this.pickerMinDate.getTime() + (24 * 60 * 60 * 1000));

  public pickerMinDateForEnrollmentEndDate;

  public courseConsumptionService: CourseConsumptionService;

  public unsubscribe = new Subject<void>();
  public enrolmentType: string;

  updateBatchInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  clearButtonInteractEdata: IInteractEventEdata;
  telemetryCdata: Array<{}> = [];
  isCertificateIssued: string;
  isEnableDiscussions: string;
  callCreateDiscussion = true;
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
    courseConsumptionService: CourseConsumptionService,
    public navigationhelperService: NavigationHelperService, private lazzyLoadScriptService: LazzyLoadScriptService,
    private telemetryService: TelemetryService,
    private csLibInitializerService: CsLibInitializerService,
    private discussionService: DiscussionService) {
    this.resourceService = resourceService;
    this.router = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.courseBatchService = courseBatchService;
    this.toasterService = toasterService;
    this.courseConsumptionService = courseConsumptionService;
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.discussionCsService = CsModule.instance.discussionService;
  }

  /**
   * Initialize form fields and getuserlist
  */
  ngOnInit() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.parent.params,
      this.activatedRoute.queryParams,
      (params, parentParams, queryParams) => ({ ...params, ...parentParams, ...queryParams })).pipe(
        mergeMap((params) => {
          this.batchId = params.batchId;
          this.courseId = params.courseId;
          this.enrolmentType = params.enrollmentType;
          this.setTelemetryInteractData();
          return this.fetchBatchDetails();
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe((data) => {
        this.showDiscussionForum = _.get(data.courseDetails, 'discussionForum.enabled');
        this.generateDataForDF();
        if (this.showDiscussionForum === 'Yes') {
          this.fetchForumConfig();
        }
        this.showUpdateModal = true;
        if (data.courseDetails.createdBy === this.userService.userid) {
          this.courseCreator = true;
        }
        this.batchDetails = data.batchDetails;
        if (this.batchDetails.enrollmentType !== 'open' && data.participantList && data.participantList.length > 0) {
          this.batchDetails.participants = data.participantList;
        }
        const userList = this.sortUsers(data.userDetails);
        this.participantList = userList.participantList;
        this.mentorList = userList.mentorList;
        if (_.get(this.batchDetails, 'startDate')) this.pickerMinDateForEndDate = new Date(_.get(this.batchDetails, 'startDate'));
        this.initializeUpdateForm();
        this.getEnabledForumId();
        this.fetchParticipantDetails();
      }, (err) => {
        if (err?.error && err.error?.params?.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0054);
        }
        this.redirect();
      });
  }

  private fetchBatchDetails() {
    if (this.enrolmentType === 'open') {
      const requestBody = {
        filters: { 'status': '1' },
      };
      const participantList = {};
      return combineLatest(
        this.courseBatchService.getUserList(requestBody),
        this.courseConsumptionService.getCourseHierarchy(this.courseId),
        this.courseBatchService.getUpdateBatchDetails(this.batchId),
        (userDetails, courseDetails, batchDetails) => (
          { userDetails, courseDetails, batchDetails, participantList}
        ));
    } else {
      const requestBody = {
        filters: { 'status': '1' },
      };
      return combineLatest(
        this.courseBatchService.getUserList(requestBody),
        this.courseConsumptionService.getCourseHierarchy(this.courseId),
        this.courseBatchService.getUpdateBatchDetails(this.batchId),
        this.courseBatchService.getParticipantList(
          { 'request': { 'batch': { 'batchId': this.batchId } } }),
        (userDetails, courseDetails, batchDetails, participantList) => (
          { userDetails, courseDetails, batchDetails, participantList }
        ));
    }
  }
  private isSubmitBtnDisable(batchForm): boolean {
    const batchFormControls = ['name', 'description', 'enrollmentType', 'mentors', 'startDate', 'endDate', 'users'];
    for (let i = 0; i < batchFormControls.length; i++) {
      if (batchForm.controls[batchFormControls[i]].status !== 'VALID') {
        return true;
      }
    }
    if (batchForm.controls['enrollmentEndDate'].status !== 'VALID' && batchForm.controls['enrollmentEndDate'].pristine) {
      return false;
    }
    return true;
  }
  /**
  * initializes form fields and apply field level validation
  */
  private initializeUpdateForm(): void {
    this.isCertificateIssued = _.get(this.batchDetails, 'cert_templates') &&
    Object.keys(_.get(this.batchDetails, 'cert_templates')).length ? 'yes' : 'no';
    const endDate = this.batchDetails.endDate ? new Date(this.batchDetails.endDate) : null;
    const enrollmentEndDate = this.batchDetails.enrollmentEndDate ? new Date(this.batchDetails.enrollmentEndDate) : null;
    if (!dayjs(this.batchDetails.startDate).isBefore(dayjs(this.pickerMinDate).format('YYYY-MM-DD'))) {
      this.pickerMinDateForEnrollmentEndDate = new Date(new Date(this.batchDetails.startDate).setHours(0, 0, 0, 0));
    } else {
      this.pickerMinDateForEnrollmentEndDate = this.pickerMinDate;
    }

    this.batchUpdateForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.batchDetails.name, [Validators.required]),
      description: new UntypedFormControl(this.batchDetails.description),
      enrollmentType: new UntypedFormControl(this.batchDetails.enrollmentType, [Validators.required]),
      startDate: new UntypedFormControl(new Date(this.batchDetails.startDate), [Validators.required]),
      endDate: new UntypedFormControl(endDate),
      mentors: new UntypedFormControl(this.batchDetails.mentors || []),
      users: new UntypedFormControl(this.batchDetails.participants || []),
      enrollmentEndDate: new UntypedFormControl(enrollmentEndDate),
      issueCertificate: new UntypedFormControl(this.isCertificateIssued, [Validators.required]),
      enableDiscussions: new UntypedFormControl(this.isEnableDiscussions, [Validators.required])
    });

    this.batchUpdateForm.get('startDate').valueChanges.subscribe(value => {
      const startDate: any = dayjs(value);
      if (startDate.isValid()) {
        if (!dayjs(startDate).isBefore(dayjs(this.pickerMinDate).format('YYYY-MM-DD'))) {
          this.pickerMinDateForEnrollmentEndDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
        } else {
          this.pickerMinDateForEnrollmentEndDate = this.pickerMinDate;
        }
      }
    });

    this.batchUpdateForm.valueChanges.subscribe(val => {
      if (this.batchUpdateForm.status === 'VALID') {
        this.disableSubmitBtn = false;
      } else {
        this.disableSubmitBtn = this.isSubmitBtnDisable(this.batchUpdateForm);
      }
    });
    this.disableSubmitBtn = true;
    if (this.batchDetails.createdBy !== this.userService.userid) {
      this.showFormInViewMode = true;
      this.batchUpdateForm.disable();
    }
  }
  /**
  * fetch mentors and participant details of current batch
  */
  private fetchParticipantDetails() {
    let userList = [];
    if (this.batchDetails.participants || (this.batchDetails.mentors && this.batchDetails.mentors.length > 0)) {
      if (this.batchDetails.enrollmentType !== 'open') {
        if (this.batchDetails.participants && this.batchDetails.participants.length > 100) {
          userList = this.batchDetails.mentors;
        } else {
          userList = _.union(this.batchDetails.participants, this.batchDetails.mentors);
        }
      } else {
        userList = this.batchDetails.mentors;
      }
      if (!userList.length) {
        this.showLoader = false;
        this.disableSubmitBtn = false;
        return ;
      }

      const request = {
        filters: {
          identifier: userList
        },
        limit : userList.length
      };
      this.courseBatchService.getUserList(request).pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.processParticipantDetails(res);
        }, (err) => {
          if (err.error && err.error.params.errmsg) {
            this.toasterService.error(err.error.params.errmsg);
          } else {
            this.toasterService.error(this.resourceService.messages.fmsg.m0056);
          }
          this.redirect();
        });
    } else {
      this.showLoader = false;
      this.disableSubmitBtn = false;
    }
  }
  private processParticipantDetails(res) {
    const users = this.sortUsers(res);
    const participantList = users.participantList;
    const mentorList = users.mentorList;
    _.forEach(this.batchDetails.participants, (value, key) => {
      const user = _.find(participantList, ['id', value]);
      if (user) {
        this.selectedParticipants.push(`${user.name}${user.otherDetail}`);
      }
    });
    _.forEach(this.batchDetails.mentors, (value, key) => {
      const mentor = _.find(mentorList, ['id', value]);
      if (mentor) {
        this.selectedMentors.push(`${mentor.name}${mentor.otherDetail}`);
      }
    });
    this.disableSubmitBtn = false;
    this.showLoader = false;
  }
  private sortUsers(res) {
    const participantList = [];
    const mentorList = [];
    if (res.result.response.content && res.result.response.content.length > 0) {
      _.forEach(res.result.response.content, (userData) => {
        if (_.find(this.selectedMentors, { 'id': userData.identifier }) ||
          _.find(this.selectedParticipants, { 'id': userData.identifier })) {
          return;
        }
        if (userData.identifier !== this.userService.userid) {
          const user = {
            id: userData.identifier,
            name: userData.firstName + (userData.lastName ? ' ' + userData.lastName : ''),
            avatar: userData.avatar,
            otherDetail: this.getUserOtherDetail(userData)
          };
          _.forEach(userData.roles, (roles) => {
            if (roles.role === 'COURSE_MENTOR') {
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

  private removeParticipantFromBatch(batchId, participantId) {
    const userRequest = {
      'request': {
        userIds: participantId
      }
    };
    this.courseBatchService.removeUsersFromBatch(batchId, userRequest);
  }

  private addParticipantToBatch(batchId, participants) {
    const userRequest = {
      userIds: _.compact(participants)
    };
    return this.courseBatchService.addUsersToBatch(userRequest, batchId);
  }

  public updateBatch() {
    this.disableSubmitBtn = true;
    let participants = [];
    const selectedMentors = [];
    let mentors = this.batchUpdateForm.value.mentors || [];
    if (this.batchUpdateForm.value.enrollmentType !== 'open') {
      participants = this.batchUpdateForm.value.users || [];
    }
    const startDate = dayjs(this.batchUpdateForm.value.startDate).format('YYYY-MM-DD');
    const endDate = this.batchUpdateForm.value.endDate && dayjs(this.batchUpdateForm.value.endDate).format('YYYY-MM-DD');
    const requestBody = {
      id: this.batchId,
      courseId: this.courseId,
      name: this.batchUpdateForm.value.name,
      description: this.batchUpdateForm.value.description,
      enrollmentType: this.batchUpdateForm.value.enrollmentType,
      startDate: startDate,
      endDate: endDate || null,
      createdFor: this.userService.userProfile.organisationIds,
      mentors: _.compact(mentors)
    };
    if (this.batchUpdateForm.value.enrollmentType === 'open' && this.batchUpdateForm.value.enrollmentEndDate) {
      requestBody['enrollmentEndDate'] = dayjs(this.batchUpdateForm.value.enrollmentEndDate).format('YYYY-MM-DD');
    }
    
    const requests = [];
    requests.push(this.courseBatchService.updateBatch(requestBody));
    if (this.removedUsers && this.removedUsers.length > 0) {
      requests.push(this.removeParticipantFromBatch(this.batchId, this.removedUsers));
    }
    if (participants && participants.length > 0) {
      requests.push(this.addParticipantToBatch(this.batchId, participants));
    }

    forkJoin(requests).subscribe(results => {
      // this.disableSubmitBtn = false;
      this.toasterService.success(this.resourceService.messages.smsg.m0034);
      this.reload();
      this.checkIssueCertificate(this.batchId, this.batchDetails);
      this.checkEnableDiscussions(this.batchId);
    }, (err) => {
      this.disableSubmitBtn = false;
      if (err.error && err.error.params && err.error.params.errmsg) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0052);
      }
    });
  }

  /**
   * @since - release-3.2.10
   * @param  {string} batchId
   * @param {Object} batchDetails
   * @description - It will emit an event;
   */
  checkIssueCertificate(batchId, batchDetails?: any) {
    let isCertInBatch = true;
    if (batchDetails && _.get(batchDetails, 'cert_templates')) {
      isCertInBatch = _.isEmpty(_.get(batchDetails, 'cert_templates')) ? false : true;
    }
    this.courseBatchService.updateEvent.emit({ event: 'issueCert', value: this.batchUpdateForm.value.issueCertificate,
    mode: 'edit', batchId: batchId , isCertInBatch : isCertInBatch});
  }
  public redirect() {
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }
  private reload() {
    setTimeout(() => {
      this.courseBatchService.updateEvent.emit({ event: 'update' });
      this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    }, 1000);
  }

  private getUserOtherDetail(userData) {
    if (userData.maskedEmail && userData.maskedPhone) {
      return ' (' + userData.maskedEmail + ', ' + userData.maskedPhone + ')';
    }
    if (userData.maskedEmail && !userData.maskedPhone) {
      return ' (' + userData.maskedEmail + ')';
    }
    if (!userData.maskedEmail && userData.maskedPhone) {
      return ' (' + userData.maskedPhone + ')';
    }
  }

  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.router.url,
          duration: this.navigationhelperService.getPageLoadTime()
        },
        object: {
          id: this.activatedRoute.snapshot.params.batchId,
          type: this.activatedRoute.snapshot.data.telemetry.object.type,
          ver: this.activatedRoute.snapshot.data.telemetry.object.ver,
          rollup: {
            l1: this.activatedRoute.snapshot.params.courseId,
            l2: this.activatedRoute.snapshot.params.batchId
          }
        }
      };
    });
  }
  setTelemetryInteractData() {
    this.updateBatchInteractEdata = {
      id: 'update-batch',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    this.clearButtonInteractEdata = {
      id: 'clear-button',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    this.telemetryInteractObject = {
      id: this.batchId,
      type: this.activatedRoute.snapshot.data.telemetry.object.type,
      ver: this.activatedRoute.snapshot.data.telemetry.object.ver
    };
  }
  setTelemetryCData(cdata: []) {
    this.telemetryCdata = _.unionBy(this.telemetryCdata, cdata, 'id');
  }
  ngOnDestroy() {
    if (this.updateBatchModal && this.updateBatchModal.deny) {
      this.updateBatchModal.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  resetForm() {
    if (this.batchDetails.status === 1) {
      this.batchUpdateForm.controls['name'].reset();
      this.batchUpdateForm.controls['description'].reset();
      this.batchUpdateForm.controls['enrollmentEndDate'].reset();
      this.batchUpdateForm.controls['endDate'].reset();
    } else {
      this.batchUpdateForm.reset();
    }
  }

  getEnabledForumId() {
    this.discussionCsService.getForumIds(this.fetchForumIdReq).subscribe(forumDetails => {
      this.forumIds = _.map(_.get(forumDetails, 'result'), 'cid');
      this.isEnableDiscussions = (this.forumIds && this.forumIds.length > 0) ? 'true' : 'false';
      if (this.isEnableDiscussions === 'true') {
        this.callCreateDiscussion = false;
      }
      this.initializeUpdateForm();
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  generateDataForDF() {
    this.fetchForumIdReq = {
      type: 'batch',
      identifier: [this.batchId]
    };
  }

  fetchForumConfig() {
    this.fetchForumConfigReq = [{
      type: 'batch',
      identifier: this.batchId
  }];
    const subType = 'batch';
    this.discussionService.fetchForumConfig(subType).subscribe((formData: any) => {
      this.createForumRequest = formData[0];
      this.createForumRequest['category']['context'] =  this.fetchForumConfigReq;
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }

  checkEnableDiscussions(batchId) {
    if (this.batchUpdateForm.value.enableDiscussions === 'true') {
      this.enableDiscussionForum();
    } else {
      this.disableDiscussionForum(batchId);
    }
  }

  enableDiscussionForum() {
    if (this.createForumRequest && this.callCreateDiscussion) {
      this.discussionService.createForum(this.createForumRequest).subscribe(resp => {
        this.handleInputChange('enable-DF-yes');
        this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0065'));
      }, error => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });
    }
  }

  disableDiscussionForum(batchId) {
    if (this.forumIds && this.forumIds.length > 0) {
      const requestBody = {
        'sbType': 'batch',
        'sbIdentifier': batchId,
        'cid': this.forumIds
      };
      this.discussionService.removeForum(requestBody).subscribe(resp => {
        this.handleInputChange('enable-DF-no');
        this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0066'));
      }, error => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });
    }
  }

  handleInputChange(inputId) {
    const telemetryData = {
      context: {
        env:  this.activatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          id: this.courseId,
          type: 'Course'
        }, {
          id: this.batchId,
          type: 'Batch'
        }]
      },
      edata: {
        id: inputId,
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      }
    };
    this.telemetryService.interact(telemetryData);
  }

  selectedMultiValues(event, field) {
    const selectedValue = event.value;
    this.selectedMentors = []
    this.selectedParticipants = []
    if(selectedValue.length) {
      selectedValue.forEach(userID => {
        const user = this.mentorList.find(item => item.id === userID)
        if (field === 'mentors') {
          this.selectedMentors.push(`${user.name}${user.otherDetail}`)
        } else {
          this.selectedParticipants.push(`${user.name}${user.otherDetail}`)
        }
      });
    }
  }

  /**
   * @param  {MatDatepickerInputEvent<Date>} event
   * @description - Function to reset the end date picker value on start date change
   */
  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    this.pickerMinDateForEndDate = new Date(event.value);
    this.batchUpdateForm.controls['endDate'].reset();
  }
}
