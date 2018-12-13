
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CourseBatchService } from '../../services';

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'app-test-all-batches',
  templateUrl: './test-all-batches.component.html',
  styleUrls: ['./test-all-batches.component.css']
})
export class TestAllBatchesComponent implements OnInit, OnDestroy {
  courseId = this.route.snapshot.paramMap.get('courseId');
  public ongoingSearch: any;
  public upcomingSearch: any;
  ongoingBatches = [];
  upcomingBatches = [];
  ngOnDestroy(): void {
  }
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
  constructor(
    public dialog: MatDialog,
    public courseBatchService: CourseBatchService,
    private route: ActivatedRoute,
  ) { }
  openContactDetailsDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
