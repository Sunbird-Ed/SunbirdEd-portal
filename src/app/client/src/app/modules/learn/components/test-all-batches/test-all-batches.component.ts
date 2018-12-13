
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CourseBatchService } from '../../services';
import { ConfigService } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
import { pluck } from 'rxjs/operators';

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
  ngOnDestroy(): void {
  }

  constructor(
    public dialog: MatDialog,
    public courseBatchService: CourseBatchService,
    private route: ActivatedRoute,
    private batchshare: BatchShareService,
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

}
