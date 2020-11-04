
import { takeUntil } from 'rxjs/operators';
import { CourseBatchService, CourseConsumptionService } from '@sunbird/learn';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService, BrowserCacheTtlService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import * as dayjs from 'dayjs';
import { UserService, GeneraliseLabelService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { IInteractEventObject, IInteractEventEdata, TelemetryService } from '@sunbird/telemetry';

@Component({
  selector: 'app-public-batch-details',
  templateUrl: './public-batch-details.component.html',
  styleUrls: ['./public-batch-details.component.scss']
})
export class PublicBatchDetailsComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<void>();
  batchStatus: Number;
  @Input() courseId: string;
  @Input() courseHierarchy: any;
  @Output() allBatchDetails = new EventEmitter();

  public baseUrl = '';
  public showLoginModal = false;
  batchList = [];
  showError = false;
  showBatchList = false;
  statusOptions = [
    { name: 'Ongoing', value: 1 },
    { name: 'Upcoming', value: 0 }
  ];
  todayDate = dayjs(new Date()).format('YYYY-MM-DD');
  signInInteractEdata: IInteractEventEdata;
  enrollBatchIntractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  enrollToBatch: any;
  tocId = '';
  constructor(private browserCacheTtlService: BrowserCacheTtlService, private cacheService: CacheService,
    public resourceService: ResourceService, public courseBatchService: CourseBatchService, public toasterService: ToasterService,
    public router: Router, public userService: UserService, public telemetryService: TelemetryService,
    public activatedRoute: ActivatedRoute, public courseConsumptionService: CourseConsumptionService,
    public generaliseLabelService: GeneraliseLabelService) {
    this.batchStatus = this.statusOptions[0].value;
  }

  ngOnInit() {
    this.tocId = _.get(this.activatedRoute, 'snapshot.queryParams.textbook');
    this.courseConsumptionService.showJoinCourseModal
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((data) => {
      this.baseUrl = `/learn/course/${this.courseId}`;
      this.showLoginModal = data;
    });

    this.getAllBatchDetails();
    this.setTelemetryData();
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
    searchParams.filters.enrollmentType = 'open';
    this.courseBatchService.getAllBatchDetails(searchParams).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data: ServerResponse) => {
        this.allBatchDetails.emit(_.get(data, 'result.response'));
        if (data.result.response.content && data.result.response.content.length > 0) {
          this.batchList = data.result.response.content;
        }
        this.showBatchList = true;
      },
      (err: ServerResponse) => {
        this.showError = true;
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
      });
  }

  closeLoginModal() {
    this.showLoginModal = false;
    let telemetryCdata = [{ 'type': 'Course', 'id': this.courseId }];
    if (this.enrollToBatch) {
      telemetryCdata = [{ id: this.enrollToBatch, type: 'CourseBatch' }];
    }
    const interactData = {
      context: {
        env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env'),
        cdata: telemetryCdata
      },
      edata: {
        id: 'join-training-login-popup-close',
        type: 'click',
        pageid: 'course-details',
      },
      object: {
        id: this.courseId,
        type: 'Course',
        ver: '1.0'
      }
    };
    this.telemetryService.interact(interactData);
  }

  isValidEnrollmentEndDate(enrollmentEndDate) {
    return !!enrollmentEndDate;
  }

  isEnrollmentAllowed(enrollmentEndDate) {
    return dayjs(enrollmentEndDate).isBefore(this.todayDate);
  }

  enrollBatch(batchId) {
    this.baseUrl = `/learn/course/${this.courseId}?batch=${batchId}&autoEnroll=true`;
    if (!this.userService.loggedIn) {
        this.showLoginModal = true;
        this.enrollToBatch = batchId;
    } else {
      this.router.navigate([this.baseUrl], { queryParams: { textbook: this.tocId || undefined } });
    }
  }
  setTelemetryData() {
    this.signInInteractEdata = {
      id: 'signin',
      type: 'click',
      pageid: 'explore-course',
    };
    this.enrollBatchIntractEdata = {
      id: 'enroll-batch',
      type: 'click',
      pageid: 'explore-course'
    };
    this.telemetryInteractObject = {
      id: this.courseId,
      type: 'explore-course',
      ver: '1.0'
    };
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
