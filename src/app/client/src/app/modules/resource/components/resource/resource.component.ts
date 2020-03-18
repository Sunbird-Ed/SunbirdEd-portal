import { combineLatest, Subject } from 'rxjs';
import { OrgDetailsService, UserService, SearchService, FrameworkService, PlayerService } from '@sunbird/core';
import { Component, OnInit, OnDestroy, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import {
  ResourceService, ToasterService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, filter, tap, skip } from 'rxjs/operators';
import { ContentSearchService } from '@sunbird/content-search';
const DEFAULT_FRAMEWORK = 'CBSE';
@Component({
  templateUrl: './resource.component.html'
})
export class ResourceComponent implements OnInit, OnDestroy, AfterViewInit {
  public initFilter = false;
  public showLoader = true;
  public noResultMessage;
  public apiContentList: Array<any> = [];
  private unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  private inViewLogs = [];
  public pageSections: Array<any> = [];
  public defaultFilters = {
    board: [DEFAULT_FRAMEWORK],
    gradeLevel: [],
    medium: []
  };
  public selectedFilters = {};
  exploreMoreButtonEdata: IInteractEventEdata;

  @HostListener('window:scroll', []) onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
      && this.pageSections.length < this.apiContentList.length) {
      this.pageSections.push(this.apiContentList[this.pageSections.length]);
    }
  }
  constructor(private searchService: SearchService, private toasterService: ToasterService, private userService: UserService,
    public resourceService: ResourceService, private configService: ConfigService, public activatedRoute: ActivatedRoute,
    private router: Router, private orgDetailsService: OrgDetailsService, private playerService: PlayerService,
    private contentSearchService: ContentSearchService, private navigationhelperService: NavigationHelperService,
    public telemetryService: TelemetryService) {
  }
  ngOnInit() {
    if (this.userService.userProfile.framework) {
      const userFrameWork = _.pick(this.userService.userProfile.framework, ['medium', 'gradeLevel', 'board']);
      this.defaultFilters = { ...this.defaultFilters, ...userFrameWork, };
    }
    this.getChannelId().pipe(
      mergeMap(({channelId, custodianOrg}) =>
        this.contentSearchService.initialize(channelId, custodianOrg, this.defaultFilters.board[0])),
      takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.setNoResultMessage();
        this.initFilter = true;
      }, (error) => {
        this.toasterService.error('Fetching content failed. Please try again later.');
        setTimeout(() => this.router.navigate(['']), 5000);
        console.error('init search filter failed', error);
    });
  }
  private getChannelId() {
    return this.orgDetailsService.getCustodianOrgDetails().pipe(map(custodianOrg => {
      if (this.userService.hashTagId === _.get(custodianOrg, 'result.response.value')) {
        return { channelId: this.userService.hashTagId, custodianOrg: true};
      } else {
        return { channelId: this.userService.hashTagId, custodianOrg: false };
      }
    }));
  }
  public getFilters(filters) {
    this.selectedFilters = _.pick(filters, ['board', 'medium', 'gradeLevel']);
    this.showLoader = true;
    this.apiContentList = [];
    this.pageSections = [];
    this.fetchContents();
  }
  private getSearchRequest() {
    let filters = this.selectedFilters;
    filters = _.omit(filters, ['key', 'sort_by', 'sortType', 'appliedFilters']);
    filters['contentType'] = ['TextBook']; // ['Collection', 'TextBook', 'LessonPlan', 'Resource'];
    const option = {
        limit: 100 || this.configService.appConfig.SEARCH.PAGE_LIMIT,
        filters: filters,
        // mode: 'soft',
        // facets: facets,
        params: _.cloneDeep(this.configService.appConfig.ExplorePage.contentApiQueryParams),
    };
    if (this.contentSearchService.frameworkId) {
      option.params.framework = this.contentSearchService.frameworkId;
    }
    return option;
  }
  private fetchContents() {
    const option = this.getSearchRequest();
    this.searchService.contentSearch(option).pipe(
      map((response) => {
        const filteredContents = _.omit(_.groupBy(_.get(response, 'result.content'), 'subject'), ['undefined']);
      for (const [key, value] of Object.entries(filteredContents)) {
        const isMultipleSubjects = key.split(',').length > 1;
        if (isMultipleSubjects) {
            const subjects = key.split(',');
            subjects.forEach((subject) => {
                if (filteredContents[subject]) {
                    filteredContents[subject] = _.uniqBy(filteredContents[subject].concat(value), 'identifier');
                } else {
                    filteredContents[subject] = value;
                }
            });
            delete filteredContents[key];
        }
      }
      const sections = [];
      for (const section in filteredContents) {
        if (section) {
            sections.push({
                name: section,
                contents: filteredContents[section]
            });
        }
      }
      return _.map(sections, (section) => {
        _.forEach(section.contents, contents => {
          contents.cardImg = contents.appIcon || 'assets/images/book.png';
        });
        return section;
      });
    }))
      .subscribe(data => {
        this.showLoader = false;
        this.apiContentList = data;
        if (!this.apiContentList.length) {
          return; // no page section
        }
        if (this.apiContentList.length >= 2) {
          this.pageSections = [this.apiContentList[0], this.apiContentList[1]];
        } else if (this.apiContentList.length >= 1) {
          this.pageSections = [this.apiContentList[0]];
        }
      }, err => {
        this.showLoader = false;
        this.apiContentList = [];
        this.pageSections = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
      });
  }
  private prepareVisits(event) {
    _.forEach(event, (inView, index) => {
      if (inView.metaData.identifier) {
        this.inViewLogs.push({
          objid: inView.metaData.identifier,
          objtype: inView.metaData.contentType,
          index: index,
          section: inView.section,
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inViewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  public playContent(event) {
    this.playerService.playContent(event.data);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.setTelemetryData();
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private setTelemetryData() {
    this.exploreMoreButtonEdata = {
      id: 'explore-more-content-button' ,
      type: 'click' ,
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
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
  private setNoResultMessage() {
    this.noResultMessage = {
      'title': this.resourceService.frmelmnts.lbl.noBookfoundTitle,
      'subTitle': this.resourceService.frmelmnts.lbl.noBookfoundSubTitle,
      'buttonText': this.resourceService.frmelmnts.lbl.noBookfoundButtonText,
      'showExploreContentButton': true
    };
  }

  public navigateToExploreContent() {
    this.router.navigate(['search/Library', 1], {
      queryParams: {
        ...this.selectedFilters, appliedFilters: false
      }
    });
  }

  getInteractEdata(event, sectionName) {
    const telemetryCdata = [{
      type: 'section',
      id: sectionName
    }];

    const cardClickInteractData = {
      context: {
        cdata: telemetryCdata,
        env: this.activatedRoute.snapshot.data.telemetry.env,
      },
      edata: {
        id: 'content-card',
        type: 'click',
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid
      },
      object: {
        id: event.data.identifier,
        type: event.data.contentType || 'content',
        ver: event.data.pkgVersion ? event.data.pkgVersion.toString() : '1.0'
      }
    };
    this.telemetryService.interact(cardClickInteractData);
  }

}
