import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { PlayerService, LearnerService, UserService, CoursesService, GeneraliseLabelService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, mergeMap, tap, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import dayjs from 'dayjs';

@Component({
  selector: 'app-batch-info',
  templateUrl: './batch-info.component.html',
  styleUrls: ['./batch-info.component.scss']
})
export class BatchInfoComponent implements OnInit, OnDestroy {

  @Input() enrolledBatchInfo: any;
  @Output() modelClose = new EventEmitter;
  @Output() routeChanged = new EventEmitter();
  public userDetails = {};
  public hasOngoingBatches = false;
  public enrolledBatches: Array<any> = [];
  public openForEnrollBatches: Array<any> = [];
  public disableEnrollBtn = false;
  public unsubscribe = new Subject<void>();
  public enrollInteractEdata;
  public resumeInteractEdata;

  constructor(public resourceService: ResourceService, public playerService: PlayerService, public configService: ConfigService,
    public learnerService: LearnerService, public userService: UserService, public toasterService: ToasterService,
    public coursesService: CoursesService, public router: Router, public generaliseLabelService: GeneraliseLabelService,
    public activatedRoute: ActivatedRoute) {
      this.resumeInteractEdata = {
        id: 'resume',
        type: 'click',
        pageid: 'batch-info'
      };
      this.enrollInteractEdata = {
        id: 'enroll',
        type: 'click',
        pageid: 'batch-info'
      };
    }

  ngOnInit() {
    if (this.enrolledBatchInfo.onGoingBatchCount) {
      this.hasOngoingBatches = true;
      this.enrolledBatches = _.concat(this.enrolledBatchInfo.inviteOnlyBatch.ongoing, this.enrolledBatchInfo.openBatch.ongoing);
    } else {
      this.enrolledBatches = _.concat(this.enrolledBatchInfo.inviteOnlyBatch.expired, this.enrolledBatchInfo.openBatch.expired);
      this.getAllOpenBatchForCourse().pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.openForEnrollBatches = _.get(data, 'result.response.content') || [];
        this.fetchUserDetails(_.map(this.openForEnrollBatches, batch => batch.createdBy));
      });
    }
    this.fetchUserDetails(_.map(this.enrolledBatches, batch => batch.batch.createdBy));
  }
  private getAllOpenBatchForCourse() {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.GET_BATCHS,
      data: {
        request: {
          filters: {
            status: [ '1' ],
            enrollmentType: 'open',
            courseId: this.enrolledBatchInfo.courseId
          },
          offset: 0,
          sort_by: { createdDate: 'desc' }
        }
      }
    };
    return this.learnerService.post(option);
  }
  public handleResumeEvent(event) {
    this.routeChanged.emit(false);
    event.mimeType = 'application/vnd.ekstep.content-collection'; // to route to course page
    event.contentType = 'Course'; // route to course page
    event.primaryCategory = 'Course';
    this.playerService.playContent(event);
  }
  public handleEnrollmentEndDate(batchDetails) {
    const enrollmentEndDate = dayjs(_.get(batchDetails, 'enrollmentEndDate')).format('YYYY-MM-DD');
    const systemDate = dayjs();
    const disableEnrollBtn = enrollmentEndDate ? dayjs(enrollmentEndDate).isBefore(systemDate) : false;
    return disableEnrollBtn;
  }
  public handleStartDate(batchDetails) {
    const batchStartDate = dayjs(_.get(batchDetails, 'startDate')).format('YYYY-MM-DD');
    const systemDate = dayjs();
    const isJoinNotEnabled = batchStartDate ? dayjs(batchStartDate).isAfter(systemDate) : false;
    return isJoinNotEnabled;
  }
  public handleEnrollEvent(event) {
    this.disableEnrollBtn = true;
    const options = {
      url: this.configService.urlConFig.URLS.COURSE.ENROLL_USER_COURSE,
      data: {
        request: {
          courseId: event.courseId,
          userId: this.userService.userid,
          batchId: event.identifier
        }
      }
    };
    this.learnerService.post(options).pipe(
      tap(data => {
        this.toasterService.success(this.resourceService.messages.smsg.m0036);
      }),
      delay(2000), // wait for data to sync
      mergeMap(data => this.coursesService.getEnrolledCourses()), // fetch enrolled course
    ).subscribe(data => {
      const textbook = _.get(this.activatedRoute, 'snapshot.queryParams.textbook');
      const queryParams = textbook ? { textbook } : {};
      this.router.navigate(['/learn/course', event.courseId, 'batch', event.identifier], { queryParams }).then(res => {
        this.routeChanged.emit(true);
      });
    }, (err) => {
      this.disableEnrollBtn = false;
      this.toasterService.error(this.resourceService.messages.emsg.m0001);
    });
  }
  private fetchUserDetails(userIds = []) {
    if (!userIds.length) {
      return;
    }
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          filters: { identifier: _.compact(_.uniq(userIds)) }
        }
      }
    };
    this.learnerService.post(option).pipe(takeUntil(this.unsubscribe))
    .subscribe(({result}) => _.forEach(_.get(result, 'response.content'), user => this.userDetails[user.identifier] = user));
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
