import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { takeUntil, mergeMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subject, combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse, ILoaderMessage } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { CourseBatchService } from './../../services';
import { AddBatchMembersComponent } from '../add-batch-members/add-batch-members.component';
import {
  IImpressionEventInput, IStartEventInput, IEndEventInput, IInteractEventInput,
  IInteractEventObject, IInteractEventEdata
} from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-create-course-batch',
  templateUrl: './create-course-batch.component.html',
  styleUrls: ['./create-course-batch.component.css']
})

export class CreateCourseBatchComponent implements OnInit, OnDestroy {
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

  pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));

  pickerMinDateForEndDate = new Date(this.pickerMinDate.getTime() + (24 * 60 * 60 * 1000));
  /**
  * Dom element reference of create modal
  */
  @ViewChild('createBatchModel') private createBatchModel;
  /**
   * Reference of add batch members component
   *
   * Geo component is responsible to render location list
   */
  @ViewChild(AddBatchMembersComponent) addbatchmembers: AddBatchMembersComponent;
  /**
  * to unsubscribe the observable
  */
  public unsubscribe = new Subject<void>();
  /**
   * form group for batchAddUserForm
  */
  createBatchForm: FormGroup;
  /**
   * boolean flag
  */
  disableSubmitBtn = true;
  /**
* courseCreator
*/
  courseCreator = false;
  /**
   * courseId
  */
  private courseId: string;
  /**
  * discardModal boolean flag
  */
  discardModalFlag = false;
  /**
  * To show/hide loader
  */
  showLoader: boolean;
  /**
  * loader message
  */
  loaderMessage: ILoaderMessage;

  /**
  * telemetryImpression object for create batch page
 */
  telemetryImpression: IImpressionEventInput;
  /**
  * telemetryStart object for create batch page
  */
  telemetryStart: IStartEventInput;
  /**
  * telemetryEnd object for create batch page
  */
  public telemetryEnd: IEndEventInput;
  /**
 * telemetryInteract event data
 */
  telemetryInteract: IInteractEventInput;
  batchStep: any;
  public saveBatchInteractEdata: IInteractEventEdata;
  public addmembersInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  public backBtnInteractEdata: IInteractEventEdata;
  public createInteractEdata: IInteractEventEdata;
  public cancelInteractEdata: IInteractEventEdata;
  public discardInteractEdata: IInteractEventEdata;
  /**
	 * Constructor to create injected service(s) object
	 * @param {RouterNavigationService} routerNavigationService Reference of routerNavigationService
   * @param {Router} router Reference of Router
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {UserService} UserService Reference of UserService
  */
  constructor(activatedRoute: ActivatedRoute,
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
    enum batchState { createCourse = 'create', addBatchMember = 'addmember' }
    this.batchStep = batchState.createCourse;
  }
  /**
   * Initialize form fields and getuserlist
  */
  ngOnInit() {
    this.activatedRoute.parent.params.pipe(mergeMap((params) => {
      this.courseId = params.courseId;
      this.initializeFormFields();
      this.setTelemetryData();
      return this.fetchBatchDetails();
    }),
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (data.courseDetails.createdBy === this.userService.userid) {
          this.courseCreator = true;
        }
      }, (err) => {
        if (err.error && err.error.params.errmsg) {
          this.toasterService.error(err.error.params.errmsg);
        } else {
          console.log(err);
          this.toasterService.error(this.resourceService.messages.fmsg.m0056);
        }
      });
    this.showLoader = false;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0118,
    };
  }

  private fetchBatchDetails() {
    return this.courseBatchService.getCourseHierarchy(this.courseId).pipe(map(data => ({ courseDetails: data })));
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
    });
    this.createBatchForm.valueChanges.subscribe(val => {
      if (this.createBatchForm.status === 'VALID') {
        this.disableSubmitBtn = false;
      } else {
        this.disableSubmitBtn = true;
      }
    });
  }

  public createBatch() {
    this.showLoader = true;
    const startDate = moment(this.createBatchForm.value.startDate).format('YYYY-MM-DD');
    const endDate = this.createBatchForm.value.endDate && moment(this.createBatchForm.value.endDate).format('YYYY-MM-DD');
    const requestBody = {
      courseId: this.courseId,
      name: this.createBatchForm.value.name,
      description: this.createBatchForm.value.description,
      enrollmentType: this.createBatchForm.value.enrollmentType,
      startDate: startDate,
      endDate: endDate || null,
      createdBy: this.userService.userid,
      createdFor: this.addbatchmembers && this.addbatchmembers.selectedOrg ? _.map(this.addbatchmembers.selectedOrg, 'id') :
        this.userService.userProfile.organisationIds,
      mentors: this.addbatchmembers && this.addbatchmembers.selectedMentorList ? _.map(this.addbatchmembers.selectedMentorList, 'id') : [],
    };
    if (this.createBatchForm.value.enrollmentType !== 'open') {
      requestBody['participants'] = this.addbatchmembers && this.addbatchmembers.selectedParticipantList ?
        _.map(this.addbatchmembers.selectedParticipantList, 'id') : [];
    }
    this.courseBatchService.createBatch(requestBody).pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.showLoader = false;
        this.disableSubmitBtn = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
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
    this.setInteractEventData();
  }

  setInteractEventData() {
    this.saveBatchInteractEdata = {
      id: 'save-batch',
      type: 'click',
      pageid: 'create-batch'
    };
    this.addmembersInteractEdata = {
      id: 'add-memebers',
      type: 'click',
      pageid: 'create-batch'
    };
    this.backBtnInteractEdata = {
      id: 'add-memebers',
      type: 'click',
      pageid: 'create-batch'
    };
    this.createInteractEdata = {
      id: 'add-memebers',
      type: 'click',
      pageid: 'create-batch'
    };
    this.telemetryInteractObject = {
      id: this.courseId,
      type: 'create-batch',
      ver: '1.0'
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
  }
  public redirect() {
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }
  private reload() {
    // setTimeout(() => {
    this.courseBatchService.updateEvent.emit({ event: 'create' });
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
    // }, 1000);
  }
  /**
  * It takes form step  as a input and change the state
  *
  * @param {number}  step form step number navigateToWizardNumber
  */
  navigateToStep(step): void {
    this.batchStep = step;
  }
  ngOnDestroy() {
    if (this.createBatchModel && this.createBatchModel.deny) {
      this.createBatchModel.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
