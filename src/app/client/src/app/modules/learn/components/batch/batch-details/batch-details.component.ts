
import { takeUntil, first, share } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { CourseBatchService, CourseProgressService, CourseConsumptionService } from './../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService } from '@sunbird/shared';
import { PermissionService, UserService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { TelemetryService } from '@sunbird/telemetry';
import { Subject } from 'rxjs';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['batch-details.component.scss']
})

export class BatchDetailsComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<void>();
  batchStatus: Number;
  @Input() courseId: string;
  @Input() enrolledCourse: boolean;
  @Input() enrolledBatchInfo: any;
  @Input() batchId: string;
  @Input() courseHierarchy: any;
  @Input() courseProgressData: any;

  courseMentor = false;
  batchList = [];
  userList = [];
  showError = false;
  userNames = {};
  showBatchList = false;
  showBatchPopup = false;
  statusOptions = [
    { name: 'Ongoing', value: 1 },
    { name: 'Upcoming', value: 0 }
  ];
  todayDate = dayjs(new Date()).format('YYYY-MM-DD');
  progress = 0;
  isUnenrollbtnDisabled = false;
  allBatchList = [];
  showAllBatchList = false;
  showAllBatchError = false;
  showJoinModal = false;
  telemetryCdata: Array<{}> = [];
  @Output() allBatchDetails = new EventEmitter();
  allowBatchCreation: boolean;

  constructor(public resourceService: ResourceService, public permissionService: PermissionService,
    public userService: UserService, public courseBatchService: CourseBatchService, public toasterService: ToasterService,
    public router: Router, public activatedRoute: ActivatedRoute, public courseProgressService: CourseProgressService,
    public courseConsumptionService: CourseConsumptionService, public telemetryService: TelemetryService) {
    this.batchStatus = this.statusOptions[0].value;
  }
  isUnenrollDisabled() {
    this.isUnenrollbtnDisabled = true;
    if (this.courseProgressData) {
      this.progress = _.get(this.courseProgressData , 'progress') ? Math.round(this.courseProgressData.progress) : 0;
    } else {
      return;
    }
    if ((!this.enrolledBatchInfo.endDate || (this.enrolledBatchInfo.endDate >= this.todayDate)) &&
    this.enrolledBatchInfo.enrollmentType === 'open' && this.progress !== 100) {
      this.isUnenrollbtnDisabled = false;
    }
  }

  isValidEnrollmentEndDate(enrollmentEndDate) {
    return !!enrollmentEndDate;
  }

  isEnrollmentAllowed(enrollmentEndDate) {
    return dayjs(enrollmentEndDate).isBefore(this.todayDate);
  }

  ngOnInit() {
    this.courseConsumptionService.showJoinCourseModal
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.getJoinCourseBatchDetails();
      });

    if (this.permissionService.checkRolesPermissions(['COURSE_MENTOR'])) {
      this.courseMentor = true;
    } else {
      this.courseMentor = false;
    }
    if (this.enrolledCourse === true) {
      this.getEnrolledCourseBatchDetails();
    } else {
      this.getAllBatchDetails();
    }
    this.courseBatchService.updateEvent.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.getAllBatchDetails();
      });
    this.showCreateBatch();
  }
  getAllBatchDetails() {
    this.showBatchList = false;
    this.showError = false;
    this.batchList = [];
    const searchParams: any = {
      filters: {
        status: this.batchStatus.toString(),
        courseId: this.courseId
      },
      offset: 0,
      sort_by: { createdDate: 'desc' }
    };
    const searchParamsCreator =  _.cloneDeep(searchParams);
    const searchParamsMentor =  _.cloneDeep(searchParams);

    if (this.courseMentor) {
      searchParamsCreator.filters.createdBy = this.userService.userid;
      searchParamsMentor.filters.mentors = [this.userService.userid];
      combineLatest(
        this.courseBatchService.getAllBatchDetails(searchParamsCreator),
        this.courseBatchService.getAllBatchDetails(searchParamsMentor),
      ).pipe(takeUntil(this.unsubscribe))
       .subscribe((data) => {
           this.batchList = _.union(data[0].result.response.content, data[1].result.response.content);
           if (this.batchList.length > 0) {
             this.fetchUserDetails();
           } else {
             this.showBatchList = true;
           }
        }, (err) => {
          this.showError = true;
          this.toasterService.error(this.resourceService.messages.fmsg.m0004);
        });
     } else {
       searchParams.filters.enrollmentType = 'open';
       this.courseBatchService.getAllBatchDetails(searchParams).pipe(
        takeUntil(this.unsubscribe))
        .subscribe((data: ServerResponse) => {
          this.allBatchDetails.emit(_.get(data, 'result.response'));
          if (data.result.response.content && data.result.response.content.length > 0) {
            this.batchList = data.result.response.content;
            this.fetchUserDetails();
          } else {
            this.showBatchList = true;
          }
        },
        (err: ServerResponse) => {
          this.showError = true;
          this.toasterService.error(this.resourceService.messages.fmsg.m0004);
        });
     }
  }

  getJoinCourseBatchDetails() {
    this.showAllBatchList = false;
    this.showAllBatchError = false;
    this.allBatchList = [];
    const searchParams: any = {
      filters: {
        courseId: this.courseId,
        enrollmentType: 'open',
        status: ['0', '1']
      },
      offset: 0,
      sort_by: { createdDate: 'desc' }
    };
      this.courseBatchService.getAllBatchDetails(searchParams)
      .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
          this.allBatchList = _.filter(_.get(data, 'result.response.content'), (batch) => {
            return !this.isEnrollmentAllowed(_.get(batch, 'enrollmentEndDate'));
          });
          // If batch length is 1, then directly join the batch
          if (this.allBatchList && this.allBatchList.length === 1) {
            this.enrollBatch(this.allBatchList[0]);
          } else if (_.isEmpty(this.allBatchList)) {
            this.showAllBatchError = true;
          } else {
            this.showAllBatchList = true;
            this.showJoinModal = true;
          }
        }, (err) => {
          this.showAllBatchError = true;
          this.toasterService.error(this.resourceService.messages.fmsg.m0004);
        });
  }

  getEnrolledCourseBatchDetails() {
    if (this.enrolledBatchInfo.participant) {
      const participant = [];
      _.forIn(this.enrolledBatchInfo.participant, (value, key) => {
        participant.push(key);
      });
      this.enrolledBatchInfo.participant = participant;
    } else {
      this.enrolledBatchInfo.participant = [];
    }
    this.courseProgressService.courseProgressData.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(courseProgressData => {
        this.courseProgressData = courseProgressData;
        this.isUnenrollDisabled();
      });
  }
  fetchUserDetails() {
    _.forEach(this.batchList, (val) => {
      this.userList.push(val.createdBy);
    });
    this.userList = _.compact(_.uniq(this.userList));
    const request = {
      filters: {
        identifier: this.userList
      }
    };
    this.courseBatchService.getUserList(request).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((res) => {
        _.forEach(res.result.response.content, (user) => {
          this.userNames[user.identifier] = user;
        });
        this.showBatchList = true;
      }, (err) => {
        this.showError = true;
      });
  }
  batchUpdate(batch) {
    if (batch.enrollmentType === 'open') {
      this.courseBatchService.setUpdateBatchDetails(batch);
    }
    this.router.navigate(['update/batch', batch.identifier],
      {
        queryParams: { enrollmentType: batch.enrollmentType },
        relativeTo: this.activatedRoute
      });
  }
  createBatch() {
    this.router.navigate(['create/batch'], { relativeTo: this.activatedRoute });
  }
  enrollBatch(batch) {
    this.showJoinModal = false;
    this.courseBatchService.setEnrollToBatchDetails(batch);
    this.router.navigate(['enroll/batch', batch.identifier], { relativeTo: this.activatedRoute, queryParams: { autoEnroll: true } });
  }
  unenrollBatch(batch) {
    // this.courseBatchService.setEnrollToBatchDetails(batch);
    this.router.navigate(['unenroll/batch', batch.identifier], { relativeTo: this.activatedRoute });
  }

  navigateToConfigureCertificate(mode: string, batchId) {
    this.router.navigate([`/certs/configure/certificate`], {
      queryParams: {
        type: mode,
        courseId: this.courseId,
        batchId: batchId
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * @since - #SH-58
   * @description - This method will decide wheather to show the "Create Batch" butto or not
   * @returns - boolean
   */
  showCreateBatch() {
    const isCourseCreator = (_.get(this.courseHierarchy, 'createdBy') === this.userService.userid) ? true : false;
    const isPermissionAvailable = (this.permissionService.checkRolesPermissions(['COURSE_MENTOR']) &&
    this.permissionService.checkRolesPermissions(['CONTENT_CREATOR'])) ? true : false;
    this.allowBatchCreation =  (isCourseCreator && isPermissionAvailable);
  }

  logTelemetry(id, content?: {}, batchId?) {
    if (batchId || this.batchId) {
      this.telemetryCdata = [{ id: batchId || this.batchId, type: 'courseBatch' }];
    }
    let objectRollUp;
    if (content) {
      objectRollUp = this.courseConsumptionService.getContentRollUp(this.courseHierarchy, _.get(content, 'identifier'));
    }
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'Course',
        cdata: this.telemetryCdata || []
      },
      edata: {
        id: id,
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'course-consumption',
      },
      object: {
        id: content ? _.get(content, 'identifier') : this.courseId,
        type: content ? _.get(content, 'contentType') : 'Course',
        ver: content ? `${_.get(content, 'pkgVersion')}` : `1.0`,
        rollup: objectRollUp ? this.courseConsumptionService.getRollUp(objectRollUp) : {}
      }
    };
    this.telemetryService.interact(interactData);
  }
}
