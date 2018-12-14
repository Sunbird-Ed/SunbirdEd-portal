
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CourseBatchService } from '../../services';
import { ConfigService } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
import { pluck, tap } from 'rxjs/operators';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';
// @Injectable()
// export class BatchShareService {
//   batchDetail;

//   setBatchDetail(batchDetail) {
//     this.batchDetail = batchDetail;
//   }

//   getBatchDetail() {
//     console.log('Bleh', this.batchDetail);
//     return this.batchDetail;
//   }
// }

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  styleUrls: ['./test-all-batches.component.css'],
  // providers: [BatchShareService],
})
// tslint:disable-next-line:component-class-suffix
export class DialogOverviewExampleDialog implements OnInit {
  mentorDetail;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
  // providers: [BatchShareService],
})
export class TestAllBatchesComponent implements OnInit, OnDestroy {
  courseId = this.route.snapshot.paramMap.get('courseId');
  public ongoingSearch: any;
  public upcomingSearch: any;
  ongoingBatches = [];
  upcomingBatches = [];
  mentorContactDetail;
  ngOnDestroy(): void {
  }

  constructor(
    public dialog: MatDialog,
    public courseBatchService: CourseBatchService,
    private route: ActivatedRoute,
    public config: ConfigService,
    public learnerService: LearnerService,
  ) { }
  ngOnInit(): void {
    this.ongoingSearch = {
      filters: {
        status: '1',
        courseId: this.courseId
      }
    };
    this.upcomingSearch = {
      filters: {
        status: '0',
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
    this.getUserDetails(batch.createdBy)
      .pipe(tap((data) => {
        this.mentorContactDetail = data;
      }))
      .subscribe((data) => {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          width: '40vh',
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

}
