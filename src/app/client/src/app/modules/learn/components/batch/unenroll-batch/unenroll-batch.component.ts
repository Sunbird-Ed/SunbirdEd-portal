
import { takeUntil } from 'rxjs/operators';
import { UserService, CoursesService } from '@sunbird/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { CourseBatchService } from '../../../services';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-unenroll-batch',
  templateUrl: './unenroll-batch.component.html',
  styleUrls: ['./unenroll-batch.component.css']
})
export class UnEnrollBatchComponent implements OnInit, OnDestroy {
  @ViewChild('unenrollBatch') unenrollBatch;
  batchId: string;
  batchDetails: any;
  showEnrollDetails = false;
  readMore = false;
  disableSubmitBtn = false;
  public unsubscribe = new Subject<void>();
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
          uri: '/unenroll/batch/' + this.batchId
        },
        object: {
          id: this.batchId,
          type: this.activatedRoute.snapshot.data.telemetry.object.type,
          ver: this.activatedRoute.snapshot.data.telemetry.object.ver
        }
      };

      this.courseBatchService.getEnrollToBatchDetails(this.batchId).pipe(
        takeUntil(this.unsubscribe))
        .subscribe((data) => {
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
    if (this.unenrollBatch && this.unenrollBatch.deny) {
      this.unenrollBatch.deny();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
      this.courseBatchService.getUserList(request).pipe(
        takeUntil(this.unsubscribe))
        .subscribe((res) => {
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
  unenrollFromCourse() {
    const request = {
      request: {
        courseId: this.batchDetails.courseId,
        userId: this.userService.userid,
        batchId: this.batchDetails.identifier
      }
    };
    this.disableSubmitBtn = true;
    this.courseBatchService.unenrollFromCourse(request).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.disableSubmitBtn = true;
        this.toasterService.success(this.resourceService.messages.smsg.m0045);
        this.goBackToCoursePage();
      }, (err) => {
        this.disableSubmitBtn = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0009);
      });
  }
  goBackToCoursePage() {
    setTimeout(() => {
      this.router.navigate(['/learn/course', this.batchDetails.courseId]);
      window.location.reload();
    }, 2000);
  }
}
