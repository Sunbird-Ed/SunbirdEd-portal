
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseBatchService } from '../../services';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';

import { ConfigService, ToasterService, ResourceService  } from '@sunbird/shared';
import { LearnerService, UserService, } from '@sunbird/core';
import { pluck, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  styleUrls: ['./test-all-batches.component.css'],
})
// tslint:disable-next-line:component-class-suffix
export class DialogOverviewExampleDialog implements OnInit {
  mentorDetail;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public config: ConfigService,
    public learnerService: LearnerService,
    public toasterService: ToasterService
  ) {
  }
  ngOnInit(): void {
    this.mentorDetail = this.data.mentorDetail;
 }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'app-test-all-batches',
  templateUrl: './test-all-batches.component.html',
  styleUrls: ['./test-all-batches.component.css'],
})
export class TestAllBatchesComponent implements OnInit, OnDestroy {
  courseId = this.route.snapshot.paramMap.get('courseId');
  public ongoingSearch: any;
  public upcomingSearch: any;
  ongoingBatches = [];
  upcomingBatches = [];
  mentorContactDetail;
  userId;
  showUnenroll;
  public unsubscribe = new Subject<void>();
  ngOnDestroy(): void {
  }

  constructor(
    public dialog: MatDialog,
    public courseBatchService: CourseBatchService,
    private route: ActivatedRoute,
    public config: ConfigService,
    public learnerService: LearnerService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public userService: UserService,
    public toasterService: ToasterService,
    public resourceService: ResourceService
  ) {
    this.userId = this.userService.userid;
  }
  ngOnInit(): void {
    this.ongoingSearch = {
      filters: {
        status: '0',
        courseId: this.courseId
      }
    };
    this.upcomingSearch = {
      filters: {
        status: '1',
        courseId: this.courseId
      }
    };
    this.courseBatchService.getAllBatchDetails(this.ongoingSearch)
      .subscribe((data: any) => {
        this.ongoingBatches = data.result.response.content;
      });
    this.courseBatchService.getAllBatchDetails(this.upcomingSearch)
      .subscribe((resp: any) => {
        this.upcomingBatches = resp.result.response.content;
      });
  }
  openContactDetailsDialog(batch): void {
    console.log('BATCH Details', batch);
    this.getUserDetails(batch.createdBy)
      .pipe(tap((data) => {
        this.mentorContactDetail = data;
      }))
      .subscribe((data) => {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          width: '50vw',
          data: {
            mentorDetail: this.mentorContactDetail
          }
        });
      });
  }
  getUserDetails(userId) {
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      param: this.config.urlConFig.params.userReadParam
    };
    const response = this.learnerService.get(option).pipe(pluck('result', 'response'));
    return response;
  }
  openEnrollDetailsDialog(batch) {
    this.courseBatchService.setEnrollToBatchDetails(batch);
    this.router.navigate(['enroll/batch', batch.identifier], { relativeTo: this.activatedRoute });
    this.enrollToCourse(batch);
  }
  enrollToCourse(batch) {
    const request = {
      request: {
        courseId: batch.courseId,
        batchId: batch.id,
        userId: this.userId,
      }
    };
    this.courseBatchService.enrollToCourse(request).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        console.log('data', data);
        if (data.result.response === 'SUCCESS') {
          this.showUnenroll = true;
        }
        this.toasterService.success(this.resourceService.messages.smsg.m0036);
      }, (err) => {
        this.toasterService.error('Unsuccesful, try again later');
      });
  }
  unEnroll(batch) {
    this.courseBatchService.setEnrollToBatchDetails(batch);
    this.unEnrollToCourse(batch);

  }
  unEnrollToCourse(batch) {
    const request = {
      request: {
        courseId: batch.courseId,
        batchId: batch.id,
        userId: this.userId
      }
    };
    this.courseBatchService.unEnrollToCourse(request).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        console.log('data', data);
        this.toasterService.success('You have successfully un-enrolled from this batch');
      }, (err) => {
        this.toasterService.error('Unsuccesful, try again later');
      });
  }
}
//   fetchEnrolledCourseData() {
//     setTimeout(() => {
//       this.coursesService.getEnrolledCourses().pipe(
//         takeUntil(this.unsubscribe))
//         .subscribe(() => {
//           this.disableSubmitBtn = false;
//           this.toasterService.success(this.resourceService.messages.smsg.m0036);
//           this.router.navigate(['/learn/course', this.batchDetails.courseId, 'batch', this.batchDetails.identifier]);
//           window.location.reload();
//         }, (err) => {
//           this.disableSubmitBtn = false;
//           this.router.navigate(['/learn']);
//         });
//     }, 2000);
//   }
// }
