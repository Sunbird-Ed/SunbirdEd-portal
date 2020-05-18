import { Subject } from 'rxjs';
import { OrgDetailsService, UserService, SearchService } from '@sunbird/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ResourceService, ToasterService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil, map, mergeMap } from 'rxjs/operators';
import { ContentSearchService } from '@sunbird/content-search';
const DEFAULT_FRAMEWORK = 'CBSE';

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
    board: [DEFAULT_FRAMEWORK],
    gradeLevel: [],
    medium: []
  };

  private subjectThemeAndIconsMap = {
    Science: {
      background: '#FFD6EB',
      titleColor: '#FD59B3',
      icon: './../../../../../assets/images/science.svg'
    },
    Mathematics: {
      background: '#FFDFD9',
      titleColor: '#EA2E52',
      icon: './../../../../../assets/images/mathematics.svg'
    },
    English: {
      background: '#DAFFD8',
      titleColor: '#218432'
    },
    Social: {
      background: '#DAD4FF',
      titleColor: '#635CDC',
      icon: './../../../../../assets/images/social.svg'
    }
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
          console.error('init search filter failed', error);
          this.router.navigate(['']);
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

    private getSearchRequest() {
      let filters = this.defaultFilters;
      filters = _.omit(filters, ['key', 'sort_by', 'sortType', 'appliedFilters']);
      filters['courseType'] = 'CurriculumCourse';
      filters['contentType'] = 'Course';
      if (!this.isCustodianOrg) {
        filters['channel'] = this.channelId;
      }
      const option = {
          limit: 100 || this.configService.appConfig.SEARCH.PAGE_LIMIT,
          filters: filters,
          params: _.cloneDeep(this.configService.appConfig.ExplorePage.contentApiQueryParams),
      };
      if (this.contentSearchService.frameworkId) {
        option.params.framework = this.contentSearchService.frameworkId;
      }
      return option;
    }


    private fetchCourses() {
      const option = this.getSearchRequest();
      this.searchService.contentSearch(option).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
        const contents = _.get(data, 'result.content');
        if (!_.isEmpty(contents)) {
          this.courseList = _.map(contents, content => {
            if (_.isEqual(_.get(content, 'subject'), this.title)) {
              return content;
            }
          });
          this.selectedCourse = _.get(this.subjectThemeAndIconsMap, this.title);
          this.defaultBg = _.isEmpty(this.selectedCourse);
          this.courseList = _.compact(this.courseList);
        }
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
