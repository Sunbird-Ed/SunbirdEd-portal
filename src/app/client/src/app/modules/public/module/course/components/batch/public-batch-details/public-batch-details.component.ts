
import { takeUntil, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { CourseBatchService } from '@sunbird/learn';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService } from '@sunbird/shared';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { Subject } from 'rxjs';
import * as moment from 'moment';
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

  public courseInteractObject: IInteractEventObject;
  public enrollBatchIntractEdata: IInteractEventEdata;
  batchList = [];
  showError = false;
  showBatchList = false;
  statusOptions = [
    { name: 'Ongoing', value: 1 },
    { name: 'Upcoming', value: 0 }
  ];
  todayDate = moment(new Date()).format('YYYY-MM-DD');
  constructor(public resourceService: ResourceService, public courseBatchService: CourseBatchService, public toasterService: ToasterService,
    public router: Router, public activatedRoute: ActivatedRoute) {
    this.batchStatus = this.statusOptions[0].value;
  }

  ngOnInit() {
    this.courseInteractObject = {
      id: this.courseHierarchy.identifier,
      type: 'Course',
      ver: this.courseHierarchy.pkgVersion ? this.courseHierarchy.pkgVersion.toString() : '1.0'
    };
    this.enrollBatchIntractEdata = {
      id: 'enroll-batch',
      type: 'click',
      pageid: 'course-consumption'
    };
    this.getAllBatchDetails();
    this.courseBatchService.updateEvent.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.getAllBatchDetails();
      });
  }

  getAllBatchDetails() {
    // fetch batch details here for a course id
  }

  enrollBatch(batch) {
    // redirect the user to toc page of loggedin user
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
