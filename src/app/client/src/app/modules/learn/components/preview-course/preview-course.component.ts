import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseConsumptionService, CourseBatchService } from '../../services';
import { UserService, LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { pluck } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-preview-course',
  templateUrl: './preview-course.component.html',
  styleUrls: ['./preview-course.component.css']
})
export class PreviewCourseComponent implements OnInit {
  courseId = this.route.snapshot.paramMap.get('courseId');
  courseDetails;
  public ongoingSearch: any;
  totalParticipants = 0;
  batches = [];
  mentorsDetails = [];
  previewurl = [];
  coursechapters = [];
  youtubelink = [];
  safeUrl;

  constructor(
    private route: ActivatedRoute,
    private courseConsumptionService: CourseConsumptionService,
    public courseBatchService: CourseBatchService,
    public learnerService: LearnerService,
    public config: ConfigService,
    public sanitizer: DomSanitizer,
    public router: Router,
  ) { }

  ngOnInit() {
    this.ongoingSearch = {
      filters: {
        status: '1',
        courseId: this.courseId
      }
    };
    this.getCourseDetails();
    this.getBatchDetails();
  }
  getCourseDetails() {
    this.courseConsumptionService.getCourseHierarchy(this.courseId)
      // .pipe(pluck('children'))
      .subscribe(
        (response: any) => {
          this.courseDetails = response;
          // console.log('courseH', this.courseDetails);
          this.getUserDetails(this.courseDetails.createdBy);
          this.coursechapters = this.courseDetails.children;
          this.getpreviewlinks();
        }
      );
  }

  getBatchDetails() {
    this.courseBatchService.getAllBatchDetails(this.ongoingSearch)
      .subscribe((data: any) => {
        this.batches = data.result.response.content;
        console.log(this.batches);
        for (const batch of this.batches) {
          this.totalParticipants = this.totalParticipants + Object.keys(batch.participant).length;
        }
        if (this.batches.length > 0) {
          for (const mentor of this.batches[0].mentors) {
            // console.log(mentor);
            this.getUserDetails(mentor);
          }
        }
      });
  }

  getUserDetails(userId) {
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      param: this.config.urlConFig.params.userReadParam
    };
    const response = this.learnerService.get(option).pipe(pluck('result', 'response'));
    response.subscribe(data => {
      // console.log(data);
      this.mentorsDetails.push(data);
    }
    );
    // console.log(this.mentorsDetails);

  }
  getpreviewlinks() {
    for (const child of this.coursechapters) {
      console.log('child', child);
      this.youtubelink.push(child.children);
      // if (child.children.length > 0) {
      // // this.checkChildrens(child.children);
      // } else {
      //     console.log('previewurl', child.previewUrl);
      // }
    }
    for (const link of this.youtubelink) {

      for (const ulink of link) {
        if (ulink.mimeType === 'video/x-youtube') {
          ulink.previewUrl = ulink.previewUrl.replace('watch?v=', 'embed/');
          this.previewurl.push(ulink.previewUrl);
        }
      }
    }
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewurl[0]);
  }

  redirect() {
    this.router.navigate(['/learn/course', this.courseId]);
  }

// checkChildrens(child) {
//   if (child.children.length > 0) {
//     console.log('child values', child.children);
//   }
}

// }
