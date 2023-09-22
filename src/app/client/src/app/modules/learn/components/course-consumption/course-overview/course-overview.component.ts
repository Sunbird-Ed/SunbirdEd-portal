import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit {

  @Input() courseDetails: any;
  @Input() configContent: any;

  levelsInfo = {
    header:{
      content: 'Content Type',
      type: 'Type',
      level: 'Your level'
    },
    data: [
      {
        content: 'Consultation and Consensus Building',
        type: 'Behavioural',
        level: 3
      },
      {
        content: 'Seeking Information',
        type: 'Domain',
        level: 2
      },
      {
        content: 'Result Orientation',
        type: 'Functional',
        level: 3
      },
      {
        content: 'Decision Making',
        type: 'Functional',
        level: 4
      }
    ]
  }
  constructor() { }

  ngOnInit(): void {
  }

}
