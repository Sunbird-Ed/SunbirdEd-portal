import { ResourceService } from '@sunbird/shared';
import { CourseBatchService } from './../../../services';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-enroll-batch',
  templateUrl: './enroll-batch.component.html',
  styleUrls: ['./enroll-batch.component.css']
})
export class EnrollBatchComponent implements OnInit {
  batchId: string;
  batchDetails: any;
  constructor(public router: Router, public activatedRoute: ActivatedRoute, public courseBatchService: CourseBatchService,
  public resourceService: ResourceService) { }
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.batchId = params.batchId;
      this.courseBatchService.getEnrollBatchDetails(this.batchId).subscribe((data) => {
        console.log('batch data', data);
        this.batchDetails = data;
      });
    });
  }

}
