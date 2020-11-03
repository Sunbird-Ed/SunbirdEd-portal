
import { takeUntil, first, share } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { CourseBatchService, CourseProgressService, CourseConsumptionService } from './../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService } from '@sunbird/shared';
import { PermissionService, UserService, GeneraliseLabelService } from '@sunbird/core';
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
  @ViewChild('batchListModal') batchListModal;
  isTrackable = false;
  courseCreator = false;
  viewBatch = false;
  hideCreateBatch = false;
  allowCertCreation = false;
  ongoingAndUpcomingBatchList = [];
  batchMessage = '';
  showMessageModal = false;

  constructor(public resourceService: ResourceService, public permissionService: PermissionService,
    public userService: UserService, public courseBatchService: CourseBatchService, public toasterService: ToasterService,
    public router: Router, public activatedRoute: ActivatedRoute, public courseProgressService: CourseProgressService,
    public courseConsumptionService: CourseConsumptionService, public telemetryService: TelemetryService,
    public generaliseLabelService: GeneraliseLabelService) {
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
    this.showCreateBatch();
      this.courseConsumptionService.showJoinCourseModal
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.getJoinCourseBatchDetails();
      });
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
  }
  getAllBatchDetails() {
    this.showBatchList = false;
    this.showError = false;
    this.batchList = [];
    const searchParams: any = {
      filters: {
        courseId: this.courseId,
        status: ['0', '1']
      },
      offset: 0,
      sort_by: { createdDate: 'desc' }
    };
    const searchParamsCreator =  _.cloneDeep(searchParams);
    const searchParamsMentor =  _.cloneDeep(searchParams);

    if (this.courseConsumptionService.canViewDashboard(this.courseHierarchy)) {
      searchParamsCreator.filters.createdBy = this.userService.userid;
      searchParamsMentor.filters.mentors = [this.userService.userid];
      combineLatest(
        this.courseBatchService.getAllBatchDetails(searchParamsCreator),
        this.courseBatchService.getAllBatchDetails(searchParamsMentor),
      ).pipe(takeUntil(this.unsubscribe))
       .subscribe((data) => {
          this.ongoingAndUpcomingBatchList = _.union(data[0].result.response.content, data[1].result.response.content);
          this.courseConsumptionService.emitBatchList(this.ongoingAndUpcomingBatchList);
          this.getSelectedBatches();
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

  getSelectedBatches () {
    this.batchList = _.filter(this.ongoingAndUpcomingBatchList, batch => {
      return (_.isEqual(batch.status, this.batchStatus));
    });
    const currentDate = new Date();
    const batchEndDate = new Date(_.get(_.first(this.ongoingAndUpcomingBatchList), 'endDate'));
    this.hideCreateBatch = this.ongoingAndUpcomingBatchList.length > 0 ? (_.isEmpty(batchEndDate) || (currentDate <= batchEndDate)) : false;
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
            this.showJoinModal = !(this.allowBatchCreation || this.permissionService.checkRolesPermissions(['COURSE_MENTOR']));
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
    const batchStartDate = new Date(batch['startDate']);
    const currentdate = new Date();
    if (currentdate < batchStartDate) {
      this.showMessageModal = true;
      this.batchMessage = (this.resourceService.messages.emsg.m009).replace('{startDate}', batch.startDate);
    } else {
      this.courseBatchService.setEnrollToBatchDetails(batch);
      this.router.navigate(['enroll/batch', batch.identifier], { relativeTo: this.activatedRoute, queryParams: { autoEnroll: true } });
    }
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
    if (this.batchListModal && this.batchListModal.deny) {
      this.batchListModal.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * @since - #SH-58
   * @description - This method will decide wheather to show the "Create Batch" butto or not
   * @returns - boolean
   */
  showCreateBatch() {
    this.isTrackable = this.courseConsumptionService.isTrackableCollection(this.courseHierarchy);
    this.allowBatchCreation = this.courseConsumptionService.canCreateBatch(this.courseHierarchy);
    this.viewBatch = this.courseConsumptionService.canViewDashboard(this.courseHierarchy);
    this.allowCertCreation = this.courseConsumptionService.canAddCertificates(this.courseHierarchy);
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
