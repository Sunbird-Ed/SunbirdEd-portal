import { Location } from '@angular/common';
// import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { SearchService, CoursesService } from '@sunbird/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ResourceService, ToasterService, NavigationHelperService
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { map } from 'rxjs/operators';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';

@Component({
  selector: 'app-curriculum-courses',
  templateUrl: './curriculum-courses.component.html',
  styleUrls: ['./curriculum-courses.component.scss']
})
export class CurriculumCoursesComponent implements OnInit, OnDestroy {

  public channelId: string;
  public isCustodianOrg = true;
  private unsubscribe$ = new Subject<void>();
  defaultBg = false;
  public defaultFilters = {
    board: [],
    gradeLevel: [],
    medium: []
  };

  public selectedCourse: {};
  public courseList: any = [];
  public title: string;
  public mergedCourseList: any = [];
  fallbackImg = './../../../../../assets/images/book.png';

  public telemetryImpression: IImpressionEventInput;
  constructor(private searchService: SearchService, private toasterService: ToasterService,
    public resourceService: ResourceService, public activatedRoute: ActivatedRoute,
    private router: Router, private navigationhelperService: NavigationHelperService,
    private coursesService: CoursesService, private telemetryService: TelemetryService,
    private location: Location
  ) { }

  ngOnInit() {
    this.title = _.get(this.activatedRoute, 'snapshot.queryParams.title');
    if (!_.isEmpty(_.get(this.searchService, 'subjectThemeAndCourse.contents'))) {
      this.courseList = _.get(this.searchService, 'subjectThemeAndCourse.contents');
      this.selectedCourse = _.omit(_.get(this.searchService, 'subjectThemeAndCourse'), 'contents');
      this.fetchEnrolledCourses();
    } else {
      this.toasterService.error(this.resourceService.frmelmnts.lbl.fetchingContentFailed);
      this.location.back();
    }
    this.setTelemetryImpression();
  }

  setTelemetryImpression() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
  }

  private fetchEnrolledCourses() {
    this.coursesService.enrolledCourseData$.pipe(map(({ enrolledCourses, err }) => {
      return enrolledCourses;
    })).subscribe(enrolledCourses => {
      this.setCourseList(enrolledCourses);
    });
  }

  private setCourseList(enrolledCourses) {
    const unorderedList = this.courseList.map((course) => {
      const enrolledCourse = _.find(enrolledCourses, { courseId: course.identifier });
      if (enrolledCourse) {
        return {
          ...enrolledCourse,
          completionPercentage: enrolledCourse.completionPercentage || 0,
          isEnrolledCourse: true,
        };
      } else {
        return {
          ...course,
          isEnrolledCourse: false,
          courseName: course.name
        };
      }
    });

    this.mergedCourseList = _.orderBy(unorderedList, ['isEnrolledCourse', course => _.toLower(course.courseName)], ['desc', 'asc']);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goBack() {
    this.location.back();
  }

  navigateToCourseDetails(course) {
    this.getInteractData(course);
    const courseId = _.get(course, 'courseId') || course.identifier;

    if (course.batchId) {
      this.router.navigate(['/learn/course', courseId, 'batch', course.batchId]);
    } else {
      this.router.navigate(['/learn/course', courseId]);
    }
  }

  getInteractData(course) {
    const cardClickInteractData = {
      context: {
        cdata: [],
        env: this.activatedRoute.snapshot.data.telemetry.env,
      },
      edata: {
        id: _.get(course, 'identifier'),
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
      },
      object: {
        id: course.identifier,
        type: course.contentType || 'course',
        ver: course.pkgVersion ? course.pkgVersion.toString() : '1.0'
      }
    };
    this.telemetryService.interact(cardClickInteractData);
  }
}
