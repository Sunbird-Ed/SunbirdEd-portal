import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-aside',
  templateUrl: './course-aside.component.html',
  styleUrls: ['./course-aside.component.scss']
})
export class CourseAsideComponent implements OnInit {
  @Input() courseHierarchy:any;
  @Input() configContent:any;

  constructor() { }

  ngOnInit(): void { }

}
