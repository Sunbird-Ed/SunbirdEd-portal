
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {combineLatest, Subject } from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { CourseConsumptionService, CourseBatchService } from './../../../services';
import { IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash';
import * as moment from 'moment';
import { mergeMap } from 'rxjs/operators';
@Component({
  selector: 'app-update-course-batch',
  templateUrl: './update-course-batch.component.html',
  styleUrls: ['./update-course-batch.component.css']
})
export class UpdateCourseBatchComponent implements OnInit, OnDestroy {

  @ViewChild('updateBatchModal') private updateBatchModal;
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

  public courseConsumptionService: CourseConsumptionService;

  public unsubscribe = new Subject<void>();
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
    combineLatest(this.activatedRoute.params, this.activatedRoute.parent.params,
      (params, parentParams) => ({ ...params, ...parentParams })).pipe(
        mergeMap((params) => {
          this.batchId = params.batchId;
          this.courseId = params.courseId;
          this.setTelemetryImpressionData();
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
        const userList = this.sortUsers(data.userDetails);
        this.participantList = userList.participantList;
        this.mentorList = userList.mentorList;
        this.initializeUpdateForm();
        this.fetchParticipantDetails();
        this.initDropDown();
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
    return combineLatest(
      this.courseBatchService.getUserList(),
      this.courseConsumptionService.getCourseHierarchy(this.courseId),
      this.courseBatchService.getUpdateBatchDetails(this.batchId),
      (userDetails, courseDetails, batchDetails) => ({ userDetails, courseDetails, batchDetails })
    );
  }
  /**
  * initializes form fields and apply field level validation
  */
  private initializeUpdateForm(): void {
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
    this.batchUpdateForm.valueChanges.subscribe(val => {
      if (this.batchUpdateForm.status === 'VALID') {
        this.disableSubmitBtn = false;
      } else {
        this.disableSubmitBtn = true;
      }
    });
  }
  /**
  * fetch mentors and participant details
  */
  private fetchParticipantDetails() {
    if (this.batchDetails.participant || (this.batchDetails.mentors && this.batchDetails.mentors.length > 0)) {
      const request = {
        filters: {
          identifier: _.union(_.keys(this.batchDetails.participant), this.batchDetails.mentors)
        }
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
    }
  }
  private processParticipantDetails(res) {
    const users = this.sortUsers(res);
    const participantList = users.participantList;
    const mentorList = users.mentorList;
    _.forEach(this.batchDetails.participant, (value, key) => {
      const user = _.find(participantList, ['id', key]);
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
    setTimeout(() => {
      $('#participant').dropdown({
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
      $('#participant input.search').on('keyup', (e) => {
        this.getUserListWithQuery($('#participant input.search').val(), 'participant');
      });
      $('#mentors input.search').on('keyup', (e) => {
        this.getUserListWithQuery($('#mentors input.search').val(), 'mentor');
      });
    }, 0);
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

  public updateBatch() {
    this.disableSubmitBtn = true;
    let participants = [];
    let mentors = [];
    if (this.batchUpdateForm.value.enrollmentType !== 'open') {
      participants = $('#participant').dropdown('get value') ? $('#participant').dropdown('get value').split(',') : [];
      mentors = $('#mentors').dropdown('get value') ? $('#mentors').dropdown('get value').split(',') : [];
    }
    const startDate = moment(this.batchUpdateForm.value.startDate).format('YYYY-MM-DD');
    const endDate = this.batchUpdateForm.value.endDate && moment(this.batchUpdateForm.value.endDate).format('YYYY-MM-DD');
    const requestBody = {
      id: this.batchId,
      name: this.batchUpdateForm.value.name,
      description: this.batchUpdateForm.value.description,
      enrollmentType: this.batchUpdateForm.value.enrollmentType,
      startDate: startDate,
      endDate: endDate || null,
      createdFor: this.userService.userProfile.organisationIds,
      mentors: _.compact(mentors)
    };
    if (this.batchUpdateForm.value.enrollmentType !== 'open') {
      const selected = [];
      _.forEach(this.selectedMentors, (value) => {
        selected.push(value.id);
      });
      requestBody['mentors'] = _.concat(_.compact(requestBody['mentors']), selected);
    }
    this.courseBatchService.updateBatch(requestBody).pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (participants && participants.length > 0) {
          this.updateParticipantsToBatch(this.batchId, participants);
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
  private updateParticipantsToBatch(batchId, participants) {
    const userRequest = {
      userIds: _.compact(participants)
    };
    this.courseBatchService.addUsersToBatch(userRequest, batchId).pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.disableSubmitBtn = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        this.reload();
      },
      (err) => {
        this.disableSubmitBtn = false;
        if (err.params && err.error.params.errmsg) {
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
      this.courseBatchService.updateEvent.emit({ event: 'update' });
      this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    }, 1000);
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
  // Create the telemetry impression event for update batch page
  private setTelemetryImpressionData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url
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
  }
  ngOnDestroy() {
    if (this.updateBatchModal && this.updateBatchModal.deny) {
      this.updateBatchModal.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
