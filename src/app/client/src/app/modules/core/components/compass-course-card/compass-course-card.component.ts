import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'compass-course-card',
  inputs: ['data'],
  templateUrl: './compass-course-card.component.html',
  styleUrls: ['./compass-course-card.component.scss']
})
export class CompassCourseCardComponent implements OnInit {

  @Input() data: object;

  constructor() { }

  ngOnInit(): void {
  }

}
