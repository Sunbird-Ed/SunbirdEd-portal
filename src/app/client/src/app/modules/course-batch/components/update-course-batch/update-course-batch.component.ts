import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse, ILoaderMessage } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { AddBatchMembersComponent } from '../add-batch-members/add-batch-members.component';
import { CourseBatchService } from '../../services';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  IEndEventInput, IStartEventInput, IInteractEventInput,
  IImpressionEventInput, IInteractEventObject, IInteractEventEdata
} from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
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
  /**
  * courseCreator
  */
  public courseCreator = false;
  /**
* To show/hide loader
*/
  showLoader: boolean;
  /**
  * loader message
  */
  loaderMessage: ILoaderMessage;
  /**
  * participantList for users
  */
  /**
  * batchDetails for form
  */
  private batchDetails: any;
  /**
  * mentorList for mentors in the batch
  */
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
  public unsubscribe = new Subject<void>();
  /**
 * telemetryStart object for create batch page
 */
  telemetryStart: IStartEventInput;
  /**
  * telemetryEnd object for create batch page
  */
  public telemetryEnd: IEndEventInput;
  /**
  * discardModal boolean flag
  */
  discardModalFlag = false;
  batchStep: any;
  public updateInteractEdata: IInteractEventEdata;
  public addmemebersInteractEdata: IInteractEventEdata;
  public backInteractEdata: IInteractEventEdata;
  public updateBatchInteractEdata: IInteractEventEdata;
  public closeInteractEdata: IInteractEventEdata;
  public cancelInteractEdata: IInteractEventEdata;
  public discardInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  /**
    * Reference of add batch members component
    *
    * Geo component is responsible to render location list
    */
  @ViewChild(AddBatchMembersComponent) addbatchmembers: AddBatchMembersComponent;
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
    toasterService: ToasterService, private deviceDetectorService: DeviceDetectorService) {
    this.resourceService = resourceService;
    this.router = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.courseBatchService = courseBatchService;
    this.toasterService = toasterService;
    enum batchState { createCourse = 'update', addBatchMember = 'addmember' }
    this.batchStep = batchState.createCourse;
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
          this.setTelemetryData();
          this.setInteractEventData();
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
        this.initializeUpdateForm();
      }, (err) => {
        if (err.error && err.error.params.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          this.toasterService.error(this.resourceService.messages.fmsg.m0054);
        }
        this.redirect();
      });
    this.showLoader = false;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0119,
    };
  }
  private fetchBatchDetails() {
    return combineLatest(
      this.courseBatchService.getCourseHierarchy(this.courseId),
      this.courseBatchService.getUpdateBatchDetails(this.batchId),
      (courseDetails, batchDetails) => ({ courseDetails, batchDetails })
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
  public updateBatch() {
    this.showLoader = true;
    this.disableSubmitBtn = true;
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
      mentors: this.addbatchmembers && this.addbatchmembers.selectedMentorList ?
        _.union(_.map(this.addbatchmembers.selectedMentorList, 'id'), this.batchDetails.mentors) : [],
    };
    if (this.batchUpdateForm.value.enrollmentType !== 'open') {
      requestBody['participants'] = this.addbatchmembers && this.addbatchmembers.selectedParticipantList ?
        _.union(_.map(this.addbatchmembers.selectedParticipantList, 'id'), this.batchDetails.participant) : [];
    }
    this.courseBatchService.updateBatch(requestBody).pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.showLoader = false;
        this.disableSubmitBtn = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0034);
        this.reload();
      },
        (err) => {
          this.showLoader = false;
          this.disableSubmitBtn = false;
          if (err.error && err.error.params.errmsg) {
            this.toasterService.error(err.error.params.errmsg);
          } else {
            this.toasterService.error(this.resourceService.messages.fmsg.m0052);
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
  private setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url
      }
    };
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.telemetryStart = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.courseId,
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: this.activatedRoute.snapshot.data.telemetry.mode,
        uaspec: {
          agent: deviceInfo.browser,
          ver: deviceInfo.browser_version,
          system: deviceInfo.os_version,
          platform: deviceInfo.os,
          raw: deviceInfo.userAgent
        }
      }
    };
    this.telemetryEnd = {
      object: {
        id: this.courseId,
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver
      },
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: this.activatedRoute.snapshot.data.telemetry.mode,
      }
    };
  }
  setInteractEventData() {
    this.updateInteractEdata = {
      id: 'update',
      type: 'click',
      pageid: 'update-batch'
    };
    this.addmemebersInteractEdata = {
      id: 'add-members',
      type: 'click',
      pageid: 'update-batch'
    };
    this.closeInteractEdata = {
      id: 'close',
      type: 'click',
      pageid: 'update-batch'
    };
    this.updateBatchInteractEdata = {
      id: 'update-batch',
      type: 'click',
      pageid: 'update-batch'
    };
    this.backInteractEdata = {
      id: 'back',
      type: 'click',
      pageid: 'update-batch'
    };
    this.cancelInteractEdata = {
      id: 'cancel',
      type: 'click',
      pageid: 'update-batch'
    };
    this.discardInteractEdata = {
      id: 'discard',
      type: 'click',
      pageid: 'update-batch'
    };
    this.telemetryInteractObject = {
      id: this.courseId,
      type: 'update-batch',
      ver: '1.0'
    };
  }
  deleteBatchDetails(user) {
    if (this.batchDetails && this.batchDetails.participant ||
      (this.batchDetails && this.batchDetails.mentors && this.batchDetails.mentors.length > 0)) {
      if (_.isArray(user)) {
        const selectedItemId = _.map(user, 'id');
        if (selectedItemId.length > 0) {
          _.forEach(selectedItemId, (selectedItem, value) => {
            const mentorIndex = _.indexOf(this.batchDetails.mentors, selectedItem);
            const participantIndex = _.indexOf(this.batchDetails.participant, selectedItem);
            if (mentorIndex !== -1) {
              this.batchDetails.mentors.splice(mentorIndex, 1);
            }
            if (participantIndex !== -1) {
              this.batchDetails.participant.splice(participantIndex, 1);
            }
          });
        } else {
          this.batchDetails.participant = [];
          this.batchDetails.mentors = [];
        }
      } else {
        const mentorIndex = _.indexOf(this.batchDetails.mentors, user.id);
        const participantIndex = _.indexOf(this.batchDetails.participant, user.id);
        if (mentorIndex !== -1) {
          this.batchDetails.mentors.splice(mentorIndex, 1);
        }
        if (participantIndex !== -1) {
          this.batchDetails.participant.splice(participantIndex, 1);
        }
      }

    }
  }
  /**
  * It takes form step  as a input and change the state
  *
  * @param {number}  step form step number navigateToStep
  */
  navigateToStep(step): void {
    this.batchStep = step;
  }
  ngOnDestroy() {
    if (this.updateBatchModal && this.updateBatchModal.deny) {
      this.updateBatchModal.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
