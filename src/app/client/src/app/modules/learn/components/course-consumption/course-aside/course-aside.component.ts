import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-course-aside',
  templateUrl: './course-aside.component.html',
  styleUrls: ['./course-aside.component.scss']
})
export class CourseAsideComponent implements OnInit {
  @Input() courseHierarchy:any;
  @Input() configContent:any;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  navigateToPlayerPage() {
      const navigationExtras: NavigationExtras = {
        queryParams: { batchId: this.courseHierarchy.batches[0].batchId, courseId: this.courseHierarchy.identifier, courseName: this.courseHierarchy.name },
        state: {  }
      };
      this.router.navigate(['/learn/course/play'], navigationExtras);
  }
}
