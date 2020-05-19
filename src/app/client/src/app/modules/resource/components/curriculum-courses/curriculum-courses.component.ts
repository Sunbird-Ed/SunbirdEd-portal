import { Subject } from 'rxjs';
import { OrgDetailsService, UserService, SearchService } from '@sunbird/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ResourceService, ToasterService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil, map, mergeMap } from 'rxjs/operators';
import { ContentSearchService } from '@sunbird/content-search';

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
  public courseList: Array<{}> = [];
  public title: string;

  constructor(private searchService: SearchService, private toasterService: ToasterService, private userService: UserService,
    public resourceService: ResourceService, private configService: ConfigService, public activatedRoute: ActivatedRoute,
    private router: Router, private orgDetailsService: OrgDetailsService, private navigationhelperService: NavigationHelperService,
    private contentSearchService: ContentSearchService) { }

    ngOnInit() {
      this.title = _.get(this.activatedRoute, 'snapshot.queryParams.title');
      this.defaultFilters = _.omit(_.get(this.activatedRoute, 'snapshot.queryParams'), 'title');
      this.getChannelId().pipe(
        mergeMap(({ channelId, isCustodianOrg }) => {
          this.channelId = channelId;
          this.isCustodianOrg = isCustodianOrg;
          return  this.contentSearchService.initialize(channelId, isCustodianOrg, this.defaultFilters.board[0]);
        }),
        takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.fetchCourses();
        }, (error) => {
          this.toasterService.error(this.resourceService.frmelmnts.lbl.fetchingContentFailed);
          this.navigationhelperService.goBack();
      });
    }

    private getChannelId() {
      return this.orgDetailsService.getCustodianOrgDetails().pipe(map(isCustodianOrg => {
        if (this.userService.hashTagId === _.get(isCustodianOrg, 'result.response.value')) {
          return { channelId: this.userService.hashTagId, isCustodianOrg: true};
        } else {
          return { channelId: this.userService.hashTagId, isCustodianOrg: false };
        }
      }));
    }

  private fetchCourses() {
    const request = {
      filters: this.defaultFilters,
      isCustodianOrg: this.isCustodianOrg,
      channelId: this.channelId,
      frameworkId: this.contentSearchService.frameworkId
    };
    this.searchService.fetchCourses(request, true, this.title).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.courseList = !_.isEmpty(_.get(data, 'contents')) ? data.contents : [];
      this.selectedCourse = _.get(data, 'selectedCourse');
      this.defaultBg = _.isEmpty(this.selectedCourse);
    }, err => {
      this.courseList = [];
      this.toasterService.error(this.resourceService.messages.fmsg.m0004);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goBack() {
    this.navigationhelperService.goBack();
  }
}
