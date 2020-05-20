
import { takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { CourseBatchService, CourseProgressService } from './../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService } from '@sunbird/shared';
import { PermissionService, UserService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { Subject } from 'rxjs';
import * as dayjs from 'dayjs';
@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html'
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

  public courseInteractObject: IInteractEventObject;
  public updateBatchIntractEdata: IInteractEventEdata;
  public createBatchIntractEdata: IInteractEventEdata;
  public enrollBatchIntractEdata: IInteractEventEdata;
  public unenrollBatchIntractEdata: IInteractEventEdata;
  courseMentor = false;
  batchList = [];
  userList = [];
  showError = false;
  userNames = {};
  showBatchList = false;
  statusOptions = [
    { name: 'Ongoing', value: 1 },
    { name: 'Upcoming', value: 0 }
  ];
  todayDate = dayjs(new Date()).format('YYYY-MM-DD');
  progress = 0;
  isUnenrollbtnDisabled = true;
  constructor(public resourceService: ResourceService, public permissionService: PermissionService,
    public userService: UserService, public courseBatchService: CourseBatchService, public toasterService: ToasterService,
    public router: Router, public activatedRoute: ActivatedRoute, public courseProgressService: CourseProgressService) {
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
    this.courseInteractObject = {
      id: this.courseHierarchy.identifier,
      type: 'Course',
      ver: this.courseHierarchy.pkgVersion ? this.courseHierarchy.pkgVersion.toString() : '1.0'
    };
    this.updateBatchIntractEdata = {
      id: 'update-batch',
      type: 'click',
      pageid: 'course-consumption'
    };
    this.createBatchIntractEdata = {
      id: 'create-batch',
      type: 'click',
      pageid: 'course-consumption'
    };
    this.enrollBatchIntractEdata = {
      id: 'enroll-batch',
      type: 'click',
      pageid: 'course-consumption'
    };
    this.unenrollBatchIntractEdata = {
      id: 'unenroll-batch',
      type: 'click',
      pageid: 'course-consumption'
    };
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
    this.isUnenrollDisabled();
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
    this.courseBatchService.setEnrollToBatchDetails(batch);
    this.router.navigate(['enroll/batch', batch.identifier], { relativeTo: this.activatedRoute, queryParams: { autoEnroll: true } });
  }
  unenrollBatch(batch) {
    // this.courseBatchService.setEnrollToBatchDetails(batch);
    this.router.navigate(['unenroll/batch', batch.identifier], { relativeTo: this.activatedRoute });
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
