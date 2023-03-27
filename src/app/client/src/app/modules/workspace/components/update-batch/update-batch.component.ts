import { takeUntil, mergeMap } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { BatchService } from '../../services';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import dayjs from 'dayjs';
import { LazzyLoadScriptService } from 'LazzyLoadScriptService';

@Component({
  selector: 'app-update-batch',
  templateUrl: './update-batch.component.html',
  styleUrls: ['./update-batch.component.scss']
})
export class UpdateBatchComponent implements OnInit, OnDestroy, AfterViewInit {

  private updateBatchModal;
  @ViewChild('updateBatchModal') set setBatchModal(element) {
    if (element) {
      this.updateBatchModal = element;
    }
    this.initDropDown();
  }
  /**
  * batchId
  */
  private batchId: string;

  public showUpdateModal = false;

  public disableSubmitBtn = false;

  private courseId: string;

  public selectedParticipants: any = [];

  public selectedMentors: any = [];

  private userSearchTime: any;
  /**
  * participantList for users
  */
  public participantList = [];


  public showFormInViewMode: boolean;

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
  private batchService: BatchService;
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

  public pickerMinDateForEnrollmentEndDate;

  public pickerMinDateForEndDate = new Date(this.pickerMinDate.getTime() + (24 * 60 * 60 * 1000));

  public unsubscribe = new Subject<void>();

  public courseCreator = false;
  public courseDetails;

  updateBatchInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  clearButtonInteractEdata: IInteractEventEdata;
  telemetryCdata: Array<{}> = [];

  /**
	 * Constructor to create injected service(s) object
   * @param {Router} router Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {UserService} UserService Reference of UserService
  */
  constructor(activatedRoute: ActivatedRoute,
    route: Router,
    resourceService: ResourceService, userService: UserService,
    batchService: BatchService,
    toasterService: ToasterService,
    public navigationhelperService: NavigationHelperService,  private lazzyLoadScriptService: LazzyLoadScriptService) {
    this.resourceService = resourceService;
    this.router = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.batchService = batchService;
    this.toasterService = toasterService;
  }

  /**
   * Initialize form fields and getuserlist
  */
  ngOnInit() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.parent.params,
      (params, parentParams) => ({ ...params, ...parentParams }))
      .pipe(
        mergeMap((params) => {
          this.batchId = params.batchId;
          this.setTelemetryImpressionData();
          this.setTelemetryInteractData();
          return this.fetchBatchDetails();
        }),
        takeUntil(this.unsubscribe))
      .subscribe((data: any) => {
        this.courseId = data.batchDetails.courseId;
        this.batchService.getCourseHierarchy(this.courseId).subscribe((courseDetails) => {
          if (courseDetails.createdBy === this.userService.userid) {
            this.courseCreator = true;
            this.courseDetails = courseDetails;
          }
        });
        this.showUpdateModal = true;
        this.batchDetails = data.batchDetails;
        if (this.batchDetails.enrollmentType !== 'open' && data.participants && data.participants.length > 0) {
          this.batchDetails.participants = data.participants;
        }
        if (this.batchDetails.createdBy !== this.userService.userid) {
          this.showFormInViewMode = true;
        }
        const userList = this.sortUsers(data.userDetails);
        this.participantList = userList.participantList;
        this.mentorList = userList.mentorList;
        this.initializeUpdateForm();
        this.fetchParticipantDetails();
      }, (err) => {
        if (err.error && err.error.params && err.error.params.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          this.toasterService.error(this.resourceService?.messages?.fmsg?.m0054);
        }
        this.redirect();
      });
  }
  private fetchBatchDetails() {
    const participants = {};
    return combineLatest(
      this.batchService.getUserList(),
      this.batchService.getUpdateBatchDetails(this.batchId),
      (userDetails, batchDetails) => ({userDetails, batchDetails, participants})
    );
  }
  /**
  * initializes form fields and apply field level validation
  */
  private initializeUpdateForm(): void {
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
      mentors: new UntypedFormControl(),
      users: new UntypedFormControl(),
      enrollmentEndDate: new UntypedFormControl(enrollmentEndDate)
    });
    this.batchUpdateForm.valueChanges.subscribe(val => {
      if (this.batchUpdateForm.status === 'VALID') {
        this.disableSubmitBtn = false;
      } else {
        this.disableSubmitBtn = true;
      }
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
  }
  /**
  * fetch mentors and participant details
  */
  private fetchParticipantDetails() {
    let userListIdentifier = [];
    if (this.batchDetails.participants || (this.batchDetails.mentors && this.batchDetails.mentors.length > 0)) {
      if (this.batchDetails.participants && this.batchDetails.participants.length > 100) {
        userListIdentifier = this.batchDetails.mentors;
      } else {
        userListIdentifier = _.union(this.batchDetails.participants, this.batchDetails.mentors);
      }
      const request = {
        filters: {
          identifier: userListIdentifier
        }
      };
      this.batchService.getUserList(request).pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.processParticipantDetails(res);
        }, (err) => {
          if (err.error && err.error.params.errmsg) {
            this.toasterService.error(err.error.params.errmsg);
          } else {
            this.toasterService.error(this.resourceService?.messages?.fmsg?.m0056);
          }
          this.redirect();
        });
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
  }
  private sortUsers(res) {
    const participantList = [];
    const mentorList = [];
    if (res.result.response.content && res.result.response.content.length > 0) {
      _.forEach(res.result.response.content, (userData) => {
        if ( _.find(this.selectedMentors , {'id': userData.identifier }) ||
          _.find(this.selectedParticipants , {'id': userData.identifier })) {
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
  private initDropDown() {
    const count = _.get(this.batchDetails, 'participants') ? _.get(this.batchDetails, 'participants.length') : 0;
    this.lazzyLoadScriptService.loadScript('semanticDropdown.js').subscribe(() => {
      $('#participant').dropdown({
        forceSelection: false,
        fullTextSearch: true,
        maxSelections: 100 - count,
        message: {
          maxSelections : this.resourceService?.messages?.imsg?.m0046
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
  private getUserListWithQuery(query, type) {
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
  private getUserList(query: string = '', type) {
    const requestBody = {
      filters: {},
      query: query
    };
    this.batchService.getUserList(requestBody).pipe(takeUntil(this.unsubscribe))
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
            this.toasterService.error(this.resourceService?.messages?.fmsg?.m0056);
          }
        });
  }

  public updateBatch() {
    this.disableSubmitBtn = true;
    let participants = [];
    let mentors = [];
    mentors = $('#mentors').dropdown('get value') ? $('#mentors').dropdown('get value').split(',') : [];
    if (this.batchUpdateForm.value.enrollmentType !== 'open') {
      participants = $('#participant').dropdown('get value') ? $('#participant').dropdown('get value').split(',') : [];
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
    const selected = [];
    _.forEach(this.selectedMentors, (value) => {
      selected.push(value.id);
    });
    requestBody['mentors'] = _.concat(_.compact(requestBody['mentors']), selected);
    this.batchService.updateBatch(requestBody).pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (participants && participants.length > 0) {
          this.updateParticipantsToBatch(this.batchId, participants);
        } else {
          this.disableSubmitBtn = false;
          this.toasterService.success(this.resourceService?.messages?.smsg?.m0034);
          this.reload();
        }
      },
        (err) => {
          this.disableSubmitBtn = false;
          if (err.error && err.error.params.errmsg) {
            this.toasterService.error(err.error.params.errmsg);
          } else {
            this.toasterService.error(this.resourceService?.messages?.fmsg?.m0052);
          }
        });
  }
  private updateParticipantsToBatch(batchId, participants) {
    const userRequest = {
      userIds: _.compact(participants)
    };
    this.batchService.addUsersToBatch(userRequest, batchId).pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.disableSubmitBtn = false;
        this.toasterService.success(this.resourceService?.messages?.smsg?.m0034);
        this.reload();
      },
        (err) => {
          this.disableSubmitBtn = false;
          if (err.params && err.error.params.errmsg) {
            this.toasterService.error(err.error.params.errmsg);
          } else {
            this.toasterService.error(this.resourceService?.messages?.fmsg?.m0053);
          }
        });
  }
  public redirect() {
    this.router.navigate(['.'], { queryParamsHandling: 'merge', relativeTo: this.activatedRoute.parent });
  }
  private reload() {
    setTimeout(() => {
      this.batchService.updateEvent.emit({ event: 'update' });
      this.router.navigate(['.'], { queryParamsHandling: 'merge', relativeTo: this.activatedRoute.parent });
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
  // Create the telemetry impression event for update batch page
  private setTelemetryImpressionData() {
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
          l1: this.activatedRoute.snapshot.params.batchId
        }
      }
    };
  }
  ngAfterViewInit () {
    setTimeout(() => {
      this.setTelemetryImpressionData();
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

  public clearForm() {
    this.batchUpdateForm.controls['name'].reset();
    this.batchUpdateForm.controls['mentors'].reset();
    this.batchUpdateForm.controls['enrollmentEndDate'].reset();
    this.batchUpdateForm.controls['endDate'].reset();
    this.batchUpdateForm.controls['description'].reset();
    this.batchUpdateForm.controls['users'].reset();
  }

  ngOnDestroy() {
    if (this.updateBatchModal && this.updateBatchModal.deny) {
      this.updateBatchModal.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
