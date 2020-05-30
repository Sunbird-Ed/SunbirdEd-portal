import { Subject } from 'rxjs';
import { SearchService } from '@sunbird/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-explore-curriculum-courses',
  templateUrl: './explore-curriculum-courses.component.html',
  styleUrls: ['./explore-curriculum-courses.component.scss']
})
export class ExploreCurriculumCoursesComponent implements OnInit, OnDestroy {
  public channelId: string;
  public isCustodianOrg = true;
  private unsubscribe$ = new Subject<void>();
  public defaultBg = false;
  public defaultFilters = {
    board: [],
    gradeLevel: [],
    medium: []
  };

  public selectedCourse;
  public courseList: Array<{}> = [];
  public title: string;

  constructor(private searchService: SearchService, private toasterService: ToasterService,
    public resourceService: ResourceService, public activatedRoute: ActivatedRoute,
    private router: Router, private navigationhelperService: NavigationHelperService) { }

    ngOnInit() {
      this.title = _.get(this.activatedRoute, 'snapshot.queryParams.title');
      const subjectThemeAndCourse = this.searchService.subjectThemeAndCourse;
      if (!_.isEmpty(_.get(subjectThemeAndCourse, 'contents'))) {
        this.courseList = _.get(subjectThemeAndCourse, 'contents');
        this.selectedCourse = _.omit(subjectThemeAndCourse, 'contents');
      } else {
        this.toasterService.error(this.resourceService.frmelmnts.lbl.fetchingContentFailed);
        this.navigationhelperService.goBack();
      }
    }

    navigateToCourse(event) {
      this.router.navigate(['explore-course/course', event.data.identifier]);
    }

    ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

    goBack() {
      this.navigationhelperService.goBack();
    }
}
