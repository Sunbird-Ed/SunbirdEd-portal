import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { takeUntil, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subject, combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterNavigationService, ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { CourseBatchService } from './../../services';
import { AddBatchMembersComponent } from '../add-batch-members/add-batch-members.component';
import { IImpressionEventInput } from '@sunbird/telemetry';
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
   * Contains step number
  */
  stepNumber = 1;
  /**
   * courseId
  */
  private courseId: string;
  /**
  * telemetryImpression object for create batch page
 */
  telemetryImpression: IImpressionEventInput;

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
    toasterService: ToasterService) {
    this.resourceService = resourceService;
    this.router = route;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.courseBatchService = courseBatchService;
    this.toasterService = toasterService;
  }
  /**
   * Initialize form fields and getuserlist
  */
  ngOnInit() {
    this.activatedRoute.parent.params.pipe(mergeMap((params) => {
      this.courseId = params.courseId;
      this.initializeFormFields();
      this.setTelemetryImpressionData();
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
          this.toasterService.error(this.resourceService.messages.fmsg.m0056);
        }
      });
  }

  private fetchBatchDetails() {
    return combineLatest(
      this.courseBatchService.getCourseHierarchy(this.courseId),
      (courseDetails) => ({ courseDetails })
    );
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
      createdFor: this.addbatchmembers && this.addbatchmembers.selectedOrg ? this.addbatchmembers.selectedOrg :
        this.userService.userProfile.organisationIds,
      mentors: this.addbatchmembers && this.addbatchmembers.selectedMentorList ? _.map(this.addbatchmembers.selectedMentorList, 'id') : [],
      // participants: this.addbatchmembers && this.addbatchmembers.selectedParticipantList ?
      //  _.map(this.addbatchmembers.selectedParticipantList, 'id') : []
    };
    this.courseBatchService.createBatch(requestBody).pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.disableSubmitBtn = false;
        this.toasterService.success(this.resourceService.messages.smsg.m0033);
        this.reload();
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
  private setTelemetryImpressionData() {
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
  /**
  * It takes form step number as a input and increase the step
  *
  * @param {number}  stepNumber form step number navigateToWizardNumber
  */
  navigateToStep(stepNumber: number): void {
    this.stepNumber = Number(stepNumber);
  }
  ngOnDestroy() {
    if (this.createBatchModel && this.createBatchModel.deny) {
      this.createBatchModel.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
