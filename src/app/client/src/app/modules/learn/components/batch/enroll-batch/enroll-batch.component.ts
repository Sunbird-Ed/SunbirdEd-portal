
import { takeUntil } from 'rxjs/operators';
import { UserService, CoursesService, GeneraliseLabelService } from '@sunbird/core';
import { ResourceService, ToasterService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { CourseBatchService } from './../../../services';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TelemetryService, IImpressionEventInput, IInteractEventObject, IInteractEventEdata, IAuditEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-enroll-batch',
  templateUrl: './enroll-batch.component.html'
})
export class EnrollBatchComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('enrollBatch') enrollBatch;
  batchId: string;
  batchDetails: any;
  showEnrollDetails = false;
  readMore = false;
  showLoader = false;
  disableSubmitBtn = false;
  public unsubscribe = new Subject<void>();
  telemetryCdata: Array<{}>;
  submitInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  /**
	 * telemetryImpression object for update batch page
	*/
  telemetryImpression: IImpressionEventInput;
  public modalVisibility = true;
  constructor(public router: Router, public activatedRoute: ActivatedRoute, public courseBatchService: CourseBatchService,
    public resourceService: ResourceService, public toasterService: ToasterService, public userService: UserService,
    public configService: ConfigService, public coursesService: CoursesService,
    private telemetryService: TelemetryService,
    public navigationhelperService: NavigationHelperService, public generaliseLabelService: GeneraliseLabelService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.batchId = params.batchId;
      this.courseBatchService.getEnrollToBatchDetails(this.batchId).pipe(
        takeUntil(this.unsubscribe))
        .subscribe((data) => {
          this.batchDetails = data;
          this.setTelemetryData();
          if (this.batchDetails.enrollmentType !== 'open') {
            this.toasterService.error(this.generaliseLabelService.messages.fmsg.m0082);
            this.redirect();
          }
          if (this.activatedRoute.queryParams) {
            this.activatedRoute.queryParams.subscribe((queryParams) => {
              if (queryParams.autoEnroll) {
                this.modalVisibility = false;
                this.enrollToCourse(this.batchId);
              }
            });
          }
        }, (err) => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0054);
          this.redirect();
        });
    });
  }
  ngOnDestroy() {
    if (this.enrollBatch && this.enrollBatch.deny) {
      this.enrollBatch.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  redirect() {
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }
  telemetryLogEvents(status: boolean) {
    let level = 'ERROR';
    let msg = 'Enrollment to the batch failed';
    if (status) {
      level = 'SUCCESS';
      msg = 'Enrollment to the batch was success';
    }
    const event = {
      context: {
        env: 'portal'
      },
      edata: {
        type: 'enroll-batch',
        level: level,
        message: msg,
        pageid: this.router.url.split('?')[0]
      }
    };
    this.telemetryService.log(event);
  }
  enrollToCourse(batchId?: any) {
    this.setTelemetryData();
    this.logAuditEvent();
    const request = {
      request: {
        courseId: this.batchDetails.courseId,
        userId: this.userService.userid,
        batchId: this.batchDetails.identifier
      }
    };
    this.disableSubmitBtn = true;
    this.courseBatchService.enrollToCourse(request).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.disableSubmitBtn = true;
        this.fetchEnrolledCourseData();
        this.telemetryLogEvents(true);
      }, (err) => {
        this.modalVisibility = true;
        this.disableSubmitBtn = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0001);
        this.telemetryLogEvents(false);
      });
  }
  fetchEnrolledCourseData() {
    this.showLoader = true;
    setTimeout(() => {
      this.coursesService.getEnrolledCourses().pipe(
        takeUntil(this.unsubscribe))
        .subscribe(() => {
          this.disableSubmitBtn = false;
          this.showLoader = false;
          this.toasterService.success(this.resourceService.messages.smsg.m0036);
          this.router.navigate(['/learn/course', this.batchDetails.courseId, 'batch', this.batchDetails.identifier],
          { queryParams: { consent: true } }).then(() => {
            window.location.reload();
          });
        }, (err) => {
          this.disableSubmitBtn = false;
          this.router.navigate(['/learn']);
        });
    }, 2000);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: '/enroll/batch/' + this.activatedRoute.snapshot.params.batchId,
          duration: this.navigationhelperService.getPageLoadTime()
        },
        object: {
          id: this.activatedRoute.snapshot.params.batchId,
          type: this.activatedRoute.snapshot.data.telemetry.object.type,
          ver: this.activatedRoute.snapshot.data.telemetry.object.ver
        }
      };
    });
  }
  setTelemetryData() {
    this.submitInteractEdata = {
      id: 'enroll-batch-popup',
      type: 'click',
      pageid: 'course-consumption'
    };
    this.telemetryCdata = [{ 'type': 'batch', 'id': this.batchDetails.identifier }];
  }

  logAuditEvent() {
    const auditEventInput: IAuditEventInput = {
      'context': {
        'env': this.activatedRoute.snapshot.data.telemetry.env,
        'cdata': [
          { id: this.batchDetails.courseId, type: 'CourseId' },
          { id: this.userService.userid, type: 'UserId' },
          { id: this.batchDetails.identifier, type: 'BatchId' },
        ]
      },
      'object': {
        'id': this.batchDetails.identifier,
        'type': this.activatedRoute.snapshot.data.telemetry.object.type,
        'ver': this.activatedRoute.snapshot.data.telemetry.object.ver
      },
      'edata': {
        props: ['courseId', 'userId', 'batchId'],
        state: '',
        prevstate: ''
      }
    };

    this.telemetryService.audit(auditEventInput);
  }
}
