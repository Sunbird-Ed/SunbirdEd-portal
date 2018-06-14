import { UserService, LearnerService, CoursesService } from '@sunbird/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { CourseBatchService } from './../../../services';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash';

@Component({
  selector: 'app-enroll-batch',
  templateUrl: './enroll-batch.component.html',
  styleUrls: ['./enroll-batch.component.css']
})
export class EnrollBatchComponent implements OnInit, OnDestroy {
  @ViewChild('enrollBatch') enrollBatch;
  batchId: string;
  batchDetails: any;
  showEnrollDetails = false;
  readMore = false;
  disableSubmitBtn = false;
  /**
	 * telemetryImpression object for update batch page
	*/
  telemetryImpression: IImpressionEventInput;
  constructor(public router: Router, public activatedRoute: ActivatedRoute, public courseBatchService: CourseBatchService,
    public resourceService: ResourceService, public toasterService: ToasterService, public userService: UserService,
    public configService: ConfigService, public coursesService: CoursesService) { }
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.batchId = params.batchId;

      // Create the telemetry impression event for enroll batch page
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: '/enroll/batch/' + this.batchId
        },
        object: {
          id: this.batchId,
          type: this.activatedRoute.snapshot.data.telemetry.object.type,
          ver: this.activatedRoute.snapshot.data.telemetry.object.ver
          }
      };
      this.courseBatchService.getEnrollBatchDetails(this.batchId).subscribe((data) => {
        this.batchDetails = data;
        if (this.batchDetails.enrollmentType !== 'open') {
          this.toasterService.error(this.resourceService.messages.fmsg.m0082);
          this.redirect();
        }
        this.fetchParticipantsDetails();
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
  }
  redirect() {
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }
  fetchParticipantsDetails() {
    if (!_.isUndefined(this.batchDetails.participant)) {
      const request = {
        filters: {
          identifier: _.keys(this.batchDetails.participant)
        }
      };
      this.courseBatchService.getUserDetails(request).subscribe((res) => {
        this.batchDetails.participantDetails = res.result.response.content;
        this.showEnrollDetails = true;
      }, (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0056);
        this.redirect();
      });
    } else {
      this.showEnrollDetails = true;
    }
  }
  enrollToCourse(batchId) {
    const request = {
      request: {
        courseId: this.batchDetails.courseId,
        userId: this.userService.userid,
        batchId: this.batchDetails.identifier
      }
    };
    this.courseBatchService.enrollToCourse(request).subscribe((data) => {
      this.disableSubmitBtn = true;
      this.fetchEnrolledCourseData();
    }, (err) => {
      this.disableSubmitBtn = false;
      this.toasterService.error(this.resourceService.messages.emsg.m0001);
    });
    this.disableSubmitBtn = false;
  }
  fetchEnrolledCourseData() {
    setTimeout(() => {
      this.coursesService.getEnrolledCourses().subscribe(() => {
        this.toasterService.success(this.resourceService.messages.smsg.m0036);
        this.router.navigate(['/learn/course', this.batchDetails.courseId, 'batch', this.batchDetails.identifier]);
        window.location.reload();
      }, (err) => {
        this.router.navigate(['/learn']);
      });
    }, 2000);
  }
}
