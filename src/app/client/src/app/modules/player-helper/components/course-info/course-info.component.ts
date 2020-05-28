import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html'
})
export class CourseInfoComponent implements OnInit {

  @Input() courseHierarchy;
  showContentCreditsModal = false;

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }

}
