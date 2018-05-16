import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, ServerResponse, ToasterService } from '@sunbird/shared';
import { PermissionService, UserService, BatchService } from '@sunbird/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.css']
})
export class BatchDetailsComponent implements OnInit {
  batchStatus: Number;
  @Input() courseId: string;
  @Input() enrolledCourse: boolean;
  @Input() batchId: string;
  courseMentor = false;
  batchList = [];
  userList = [];
  showLoader = true;
  showError = false;
  userNames = {};
  noBatchsFound = false;
  statusOptions = [
    { name: 'Ongoing', value: 1 },
    { name: 'Upcoming', value: 0 }
  ];
  constructor(public resourceService: ResourceService, public permissionService: PermissionService,
  public userService: UserService, public batchService: BatchService, public toasterService: ToasterService) {
    this.batchStatus = this.statusOptions[0].value;
  }

  ngOnInit() {
    console.log('Batch Input', this.batchId, this.courseId, this.enrolledCourse);
    if (this.permissionService.checkRolesPermissions(['COURSE_MENTOR'])) {
      this.courseMentor = true;
    } else {
      this.courseMentor = false;
    }
    if (this.enrolledCourse === true) {
      this.getEnrolledCourseBatchDetails();
    } else {
      this.getAllCourseBatchDetails();
    }
  }
  fetchBatchList() {
    console.log('batchStatus', this.batchStatus);
  }
  getAllCourseBatchDetails() {
    this.noBatchsFound = true;
    const request: any = {
      request: {
        filters: {
          status: this.batchStatus.toString(),
          courseId: this.courseId
        },
        sort_by: { createdDate: 'desc' }
      }
    };
    if (this.courseMentor) {
      request.request.filters.createdBy = this.userService.userid;
    } else {
      request.request.filters.enrollmentType = 'open';
    }
    this.batchService.getBatchDetails(request).subscribe((data: ServerResponse) => {
      console.log(data);
      if (data.result.response.content && data.result.response.content.length > 0) {
        this.batchList = data.result.response.content;
        this.fetchUserDetails();
      } else {
        this.noBatchsFound = true;
        this.showError = false;
        this.showLoader = false;
      }
    },
    (err: ServerResponse) => {
      this.showLoader = false;
      this.showError = true;
      this.toasterService.error(this.resourceService.messages.fmsg.m0004);
    });
  }
  getEnrolledCourseBatchDetails() {

  }
  fetchUserDetails() {
    _.forEach(this.batchList, (val) => {
      this.userList.push(val.createdBy);
    });
    this.userList = _.compact(_.uniq(this.userList));
        const request =  {
          filters: {
            identifier: this.userList
          }
      };
    this.batchService.getUserDetails(request).subscribe((res) => {
      _.forEach(res.result.response.content, (user) =>  {
        this.userNames[user.identifier] = user;
      });
      console.log(this.batchList, this.userNames);
    });
  }
  batchUpdate(batch) {

  }
  batchDetails(batch) {

  }
}
