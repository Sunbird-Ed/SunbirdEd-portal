import { IInteractEventEdata } from './../../../../telemetry/interfaces/telemetry';

import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {combineLatest, Subject, forkJoin} from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import { IImpressionEventInput, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import * as dayjs from 'dayjs';
import { LazzyLoadScriptService } from 'LazzyLoadScriptService';

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
    this.initDropDown();
  };
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
  public batchUpdateForm: FormGroup;
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
    private telemetryService: TelemetryService) {
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
        if (this.batchDetails.mentors) {
          this.batchDetails.mentors.forEach(id => {
            _.remove(this.mentorList, mentor => mentor.id === id);
          });
        }
        if (this.batchDetails.participants) {
          this.batchDetails.participants.forEach(id => {
            _.remove(this.participantList, participant => participant.id === id);
          });
        }
        this.initializeUpdateForm();
        this.fetchParticipantDetails();
      }, (err) => {
        if (err.error && err.error.params.errmsg) {
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

    this.batchUpdateForm = new FormGroup({
      name: new FormControl(this.batchDetails.name, [Validators.required]),
      description: new FormControl(this.batchDetails.description),
      enrollmentType: new FormControl(this.batchDetails.enrollmentType, [Validators.required]),
      startDate: new FormControl(new Date(this.batchDetails.startDate), [Validators.required]),
      endDate: new FormControl(endDate),
      mentors: new FormControl(),
      users: new FormControl(),
      enrollmentEndDate: new FormControl(enrollmentEndDate),
      issueCertificate: new FormControl(this.isCertificateIssued, [Validators.required])
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
        this.selectedParticipants.push(user);
      }
    });
    _.forEach(this.batchDetails.mentors, (value, key) => {
      const mentor = _.find(mentorList, ['id', value]);
      if (mentor) {
        this.selectedMentors.push(mentor);
      }
    });
    this.selectedParticipants = _.uniqBy(this.selectedParticipants, 'id');
    this.selectedMentors = _.uniqBy(this.selectedMentors, 'id');
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

  private getUserListWithQuery(query, type) {
    if (this.userSearchTime) {
      clearTimeout(this.userSearchTime);
    }
    this.userSearchTime = setTimeout(() => {
      this.getUserList(query, type);
    }, 1000);
  }
  private initDropDown() {
    const count = _.get(this.batchDetails, 'participants') ? _.get(this.batchDetails, 'participants.length') : 0;
    this.lazzyLoadScriptService.loadScript('semanticDropdown.js').subscribe(() => {
      $('#participant').dropdown({
        forceSelection: false,
        fullTextSearch: true,
        maxSelections: 100 - count,
        message: {
          maxSelections : this.resourceService.messages.imsg.m0047
        },
        onAdd: () => {
        }
      });
      $('#mentors').dropdown({
        fullTextSearch: true,
        forceSelection: false,
        onAdd: () => {
        }
      });
      $('#participant input.search').on('keyup', (e) => {
        this.getUserListWithQuery($('#participant input.search').val(), 'participant');
      });
      $('#mentors input.search').on('keyup', (e) => {
        this.getUserListWithQuery($('#mentors input.search').val(), 'mentor');
      });
    });
  }
  /**
  *  api call to get user list
  */
  private getUserList(query: string = '', type) {
    const requestBody = {
      filters: {'status': '1'},
      query: query
    };
    this.courseBatchService.getUserList(requestBody).pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        const userList = this.sortUsers(res);
        if (type === 'participant') {
          this.participantList = userList.participantList;
        } else {
          this.mentorList = userList.mentorList;
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

  public removeMentor(mentor: any) {
    _.remove(this.selectedMentors, (data) => {
      return data === mentor;
    });
  }

  public removeParticipant(user: any) {
    if (user && user.id) {
      this.removedUsers.push(user.id);
    }
    _.remove(this.selectedParticipants, (data) => {
      return data === user;
    });
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
    let mentors = [];
    mentors = $('#mentors').dropdown('get value') ? $('#mentors').dropdown('get value').split(',') : [];
    if (this.batchUpdateForm.value.enrollmentType !== 'open') {
      participants = $('#participant').dropdown('get value') ? $('#participant').dropdown('get value').split(',') : [];
    }
    if ((this.selectedMentors).length > 0) {
      _.forEach(this.selectedMentors, (obj) => {
        selectedMentors.push(obj.id);
      });
    }
    mentors = _.concat(mentors, selectedMentors);
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
    const selected = [];
    _.forEach(this.selectedMentors, (value) => {
      selected.push(value.id);
    });
    requestBody['mentors'] = _.concat(_.compact(requestBody['mentors']), selected);
    const requests = [];
    requests.push(this.courseBatchService.updateBatch(requestBody));
    if (this.removedUsers && this.removedUsers.length > 0) {
      requests.push(this.removeParticipantFromBatch(this.batchId, this.removedUsers));
    }
    if (participants && participants.length > 0) {
      requests.push(this.addParticipantToBatch(this.batchId, participants));
    }

    forkJoin(requests).subscribe(results => {
      this.disableSubmitBtn = false;
      this.toasterService.success(this.resourceService.messages.smsg.m0034);
      this.reload();
      this.checkIssueCertificate(this.batchId);
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
   * @description - It will emit an event;
   */
  checkIssueCertificate(batchId) {
    this.courseBatchService.updateEvent.emit({ event: 'issueCert', value: this.batchUpdateForm.value.issueCertificate,
    mode: 'edit', batchId: batchId });
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

  handleInputChange(inputType) {
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
        id: `issue-certificate-${inputType}`,
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      }
    };
    this.telemetryService.interact(telemetryData);
  }
}
