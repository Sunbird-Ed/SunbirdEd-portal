import { Component, Input, OnInit } from '@angular/core';
import { CourseBatchService } from './../../../services';

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss']
})
export class BatchListComponent implements OnInit {
  @Input() courseHierarchy:any;
  batchList: []
  constructor(private courseBatchService: CourseBatchService) { }

  ngOnInit(): void {
   this.getEnrollerMembers();
  }
  
  getEnrollerMembers(){
    let batchId = this.courseHierarchy.batches[0].batchId;
    const requestBody = {
          filters: {
              status: "1",
              courseId:this.courseHierarchy.identifier,
              enrollmentType: "open"
          },
          sort_by: {
              createdDate: "desc"
          }
      }
  
    this.courseBatchService.getAllBatchDetails(requestBody).subscribe((res:any) => {
     this.batchList = res.result.response.content;
    })
  }
}
