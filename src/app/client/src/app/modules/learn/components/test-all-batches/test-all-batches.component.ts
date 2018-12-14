
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseBatchService } from '../../services';
import { ConfigService, ToasterService, ResourceService  } from '@sunbird/shared';
import { LearnerService, UserService, } from '@sunbird/core';
import { pluck, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Injectable()
export class BatchShareService {
  batchDetail;

  setBatchDetail(batchDetail) {
    this.batchDetail = batchDetail;
  }

  getBatchDetail() {
    return this.batchDetail;
  }
}

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  providers: [BatchShareService],
})
// tslint:disable-next-line:component-class-suffix
export class DialogOverviewExampleDialog implements OnInit {
  batchDetail;
  mentorContactDetail;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    public batchShare: BatchShareService,
    public config: ConfigService,
    public learnerService: LearnerService,
    public toasterService: ToasterService
  ) {
  }
  ngOnInit(): void {
    this.batchDetail = this.batchShare.getBatchDetail();
    console.log(this.batchDetail);
    this.getUserDetails(this.batchDetail.createdBy);
  }
  // ngOnChange(){

  // }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getUserDetails(userId) {
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      param: this.config.urlConFig.params.userReadParam
    };
    const response = this.learnerService.get(option).pipe(pluck('result', 'response'));
    response.subscribe(data => {
      console.log(data);
      this.mentorContactDetail = data;
    }
    );
  }

}
@Component({
  selector: 'app-test-all-batches',
  templateUrl: './test-all-batches.component.html',
  styleUrls: ['./test-all-batches.component.css'],
  providers: [BatchShareService],
})
export class TestAllBatchesComponent implements OnInit, OnDestroy {
  courseId = this.route.snapshot.paramMap.get('courseId');
  public ongoingSearch: any;
  public upcomingSearch: any;
  ongoingBatches = [];
  upcomingBatches = [];
  disableSubmitBtn: boolean;
  showUnenroll;
  public unsubscribe = new Subject<void>();
  ngOnDestroy(): void {
  }

  constructor(
    public dialog: MatDialog,
    public courseBatchService: CourseBatchService,
    private route: ActivatedRoute,
    private batchshare: BatchShareService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public userService: UserService,
    public toasterService: ToasterService,
    public resourceService: ResourceService
  ) { }
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
    console.log('course id', this.courseId);
    this.courseBatchService.getAllBatchDetails(this.ongoingSearch)
      .subscribe((data: any) => {
        console.log('this is batch deets', data);
        this.ongoingBatches = data.result.response.content;
        console.log(this.ongoingBatches);
      });
    this.courseBatchService.getAllBatchDetails(this.upcomingSearch)
      .subscribe((resp: any) => {
        console.log('this is batch deets', resp);
        this.upcomingBatches = resp.result.response.content;
        console.log(this.ongoingBatches);
      });
  }
  openContactDetailsDialog(batch): void {
    console.log('Output batch', batch);
    this.batchshare.setBatchDetail(batch);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result', result);
    });
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
        userId: this.userService.userid,
      }
    };
    this.disableSubmitBtn = true;
    this.courseBatchService.enrollToCourse(request).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        console.log('data', data);
        this.showUnenroll = data.result.response;
        this.toasterService.success(this.resourceService.messages.smsg.m0036);
      }, (err) => {

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
