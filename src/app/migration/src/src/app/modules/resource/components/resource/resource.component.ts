import { PageSectionService } from '@sunbird/core';
import { Component, OnInit } from '@angular/core';
import { ResourceService, ServerResponse } from '@sunbird/shared';
@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {
  pageSectionService: PageSectionService;
  showLoader = true;
  pageSectionData: object[];
  constructor(pageSectionService: PageSectionService) {
    this.pageSectionService = pageSectionService;
   }

   populateResourceData() {
    const option = {
      source: 'web',
      name: 'Resource'
    };
    this.pageSectionService.getPageData(option).subscribe(
      (apiResponse: ServerResponse) => {
        this.pageSectionData = apiResponse.result.response.sections;
        console.log(this.pageSectionData);
        this.showLoader = false;
      }
    );
   }
   /**
   * This method calls the course API.
   */
  // public populateEnrolledCourse() {
  //   this.courseSubscription = this.courseService.enrolledCourseData$.subscribe(
  //    data => {
  //       if (data) {
  //         this.showLoader = false;
  //         this.toDoList = this.toDoList.concat(data.enrolledCourses);
  //       }
  //     },
  //     err => {
  //       this.showLoader = false;
  //       this.toasterService.error(this.resourceService.messages.fmsg.m0001);
  //     }
  //   );
  // }
  ngOnInit() {
    this.populateResourceData();  }

}
