import { Component, Input, OnInit } from '@angular/core';
import { CoursesService, UserService } from '@sunbird/core';
import { CourseBatchService } from './../../../services';

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss']
})
export class BatchListComponent implements OnInit {
  @Input() courseHierarchy:any;
  @Input() configContent:any;
  batchList = [];
  
  constructor(private courseBatchService: CourseBatchService, private courseService: CoursesService, private userSerivce: UserService) { }

  ngOnInit(): void {
   this.getEnrollerMembers();
  }
  
  getEnrollerMembers(){
    let batchId = this.courseHierarchy.batches[0].batchId;
    const requestBody = {
      request: {
          batch: {
              "batchId": batchId
          }
      }
    }
    
    this.courseBatchService.getParticipantList(requestBody).subscribe((res:any) => {
     if(res.length>0){
        res.forEach((id:any) => {
            this.userSerivce.getUserData(id).subscribe((memResponse:any) => {
              if(memResponse){
                let member = memResponse.result.response;
                member.fullName = member.firstName+' '+member.lastName;
                member.memberRoles = member.roles.join(',');
                this.batchList.push(member);
              }
            })
        })
      }
    })
  }
}
