import {forkJoin, Subject} from 'rxjs';
import {
  OrgDetailsService,
  UserService,
  SearchService,
  FrameworkService,
  PlayerService,
  CoursesService,
  FormService
} from '@sunbird/core';
import { Component, OnInit, OnDestroy, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import {
  ResourceService, ToasterService, ConfigService, NavigationHelperService, LayoutService, COLUMN_TYPE } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, filter, tap, skip } from 'rxjs/operators';
import { ContentSearchService } from '@sunbird/content-search';
const DEFAULT_FRAMEWORK = 'CBSE';
@Component({
  templateUrl: './resource.component.html',
  styles: ['.course-card-width { width: 280px !important }']
})
export class ResourceComponent implements OnInit, OnDestroy, AfterViewInit {
  public initFilter = false;
  public showLoader = true;
  public noResultMessage;
  public channelId: string;
  public custodianOrg = true;
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
  public numberOfSections = new Array(this.configService.appConfig.SEARCH.SECTION_LIMIT);
  public cardData: Array<{}> = [];
  public isLoading = true;
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  slideConfig: object = {};
  formData: any;
  pageTitle;
  svgToDisplay;
  queryParams;
  pageTitleSrc;
  @HostListener('window:scroll', []) onScroll(): void {
    this.windowScroll();
  }
  constructor(private searchService: SearchService, private toasterService: ToasterService, private userService: UserService,
    public resourceService: ResourceService, private configService: ConfigService, public activatedRoute: ActivatedRoute,
    private router: Router, private orgDetailsService: OrgDetailsService, private playerService: PlayerService,
    private contentSearchService: ContentSearchService, private navigationhelperService: NavigationHelperService,
    public telemetryService: TelemetryService, public formService: FormService,
    private coursesService: CoursesService, public layoutService: LayoutService
    ) {
  }
  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(queryParams => {
      this.queryParams = { ...queryParams };
    });
    this.initLayout();
    this.slideConfig = _.cloneDeep(this.configService.appConfig.LibraryCourses.slideConfig);
    if (_.get(this.userService, 'userProfile.framework')) {
      const userFrameWork = _.pick(this.userService.userProfile.framework, ['medium', 'gradeLevel', 'board']);
      this.defaultFilters = { ...this.defaultFilters, ...userFrameWork, };
    }
    const formServiceInputParams = {
      formType: 'contentcategory',
      formAction: 'menubar',
      contentType: 'global'
    };
    forkJoin([this.getChannelId(), this.formService.getFormConfig(formServiceInputParams)]).pipe(
      mergeMap((data: any) => {
        this.channelId = data[0].channelId;
        this.custodianOrg = data[0].custodianOrg;
        this.formData = data[1];
        return this.contentSearchService.initialize(this.channelId, this.custodianOrg, this.defaultFilters.board[0]);
      }),
      takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.setNoResultMessage();
        this.initFilter = true;
      }, (error) => {
        this.toasterService.error(this.resourceService.frmelmnts.lbl.fetchingContentFailed);
        this.navigationhelperService.goBack();
    });
  }
  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.redoLayout();
    this.layoutService.switchableLayout().
        pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
        if (layoutConfig != null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
        this.redoLayout();
      });
  }
  redoLayout() {
      if (this.layoutConfiguration != null) {
        this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
        this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, this.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
      } else {
        this.FIRST_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(0, null, COLUMN_TYPE.fullLayout);
        this.SECOND_PANEL_LAYOUT = this.layoutService.redoLayoutCSS(1, null, COLUMN_TYPE.fullLayout);
      }
  }

  private windowScroll() {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
      && this.pageSections.length < this.apiContentList.length) {
      this.pageSections.push(this.apiContentList[this.pageSections.length]);
    }
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

  public getPageData(fieldType) {
    return _.find(this.formData, (o) => o.contentType === fieldType);
  }

  public getFilters({filters, status}) {
    this.showLoader = true;
    if (!filters || status === 'FETCHING') {
      return; // filter yet to be fetched, only show loader
    }
    const currentPageData = this.getPageData(_.get(this.activatedRoute,'snapshot.queryParams.selectedTab') || 'textbook');
    this.selectedFilters = _.pick(filters, ['board', 'medium', 'gradeLevel', 'channel']);
    if (localStorage.getItem('userType') && currentPageData.contentType !== 'all') {
      const userType = localStorage.getItem('userType');
      const userTypeMapping = this.configService.appConfig.userTypeMapping;
      _.map(userTypeMapping, (value, key) => {
        if (userType === key) {
          this.selectedFilters['audience'] = value;
        }
      });
    }
    this.apiContentList = [];
    this.pageSections = [];
    this.pageTitle = _.get(this.resourceService, _.get(currentPageData, 'title'));
    this.pageTitleSrc = this.resourceService.RESOURCE_CONSUMPTION_ROOT+_.get(currentPageData, 'title');
    this.svgToDisplay = _.get(currentPageData, 'theme.imageName');
    this.fetchContents(currentPageData);
  }
  private fetchContents(currentPageData) {
    const request = {
      filters: this.selectedFilters,
      fields: currentPageData.search.fields,
      isCustodianOrg: this.custodianOrg,
      channelId: this.channelId,
      frameworkId: this.contentSearchService.frameworkId,
      limit: currentPageData.limit
    };
    const option = this.searchService.getSearchRequest(request, currentPageData.search.filters.primaryCategory);
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
        this.apiContentList = _.sortBy(data, ['name']);
        if (!this.apiContentList.length) {
          return; // no page section
        }
        this.pageSections = this.apiContentList.slice(0, 4);
      }, err => {
        this.showLoader = false;
        this.apiContentList = [];
        this.pageSections = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
      });
  }

  // private  fetchCourses() {
  //   this.cardData = [];
  //   this.isLoading = true;
  //   const request = {
  //     filters: this.selectedFilters,
  //     isCustodianOrg: this.custodianOrg,
  //     channelId: this.channelId,
  //     frameworkId: this.contentSearchService.frameworkId
  //   };
  //   this.searchService.fetchCourses(request, ['Course']).pipe(takeUntil(this.unsubscribe$)).subscribe(cardData => {
  //   this.isLoading = false;

  //   this.cardData = _.sortBy(cardData, ['title']);
  // }, err => {
  //     this.isLoading = false;
  //     this.cardData = [];
  //     this.toasterService.error(this.resourceService.messages.fmsg.m0004);
  // });
  // }

  navigateToCourses(event) {
    const telemetryData = {
      cdata: [{
        type: 'library-courses',
        id:  _.get(event, 'data.title'),
      }],
      edata: {
        id: 'course-card'
      },
      object: {}
    };
    this.getInteractEdata(telemetryData);

    if (event.data.contents.length === 1) {
      const metaData = _.pick(event.data.contents[0], ['identifier', 'mimeType', 'framework', 'contentType']);
      const { onGoingBatchCount, expiredBatchCount, openBatch, inviteOnlyBatch } =
      this.coursesService.findEnrolledCourses(metaData.identifier);

      /* istanbul ignore else */
      if (!expiredBatchCount && !onGoingBatchCount) { // go to course preview page, if no enrolled batch present
        return this.playerService.playContent(metaData);
      }

      if (onGoingBatchCount === 1) { // play course if only one open batch is present
        metaData.batchId = openBatch.ongoing.length ? openBatch.ongoing[0].batchId : inviteOnlyBatch.ongoing[0].batchId;
        return this.playerService.playContent(metaData);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      }
    } else {
      this.searchService.subjectThemeAndCourse = event.data;
      this.router.navigate(['resources/curriculum-courses'], {
        queryParams: {
          title: _.get(event, 'data.title'),
        },
      });
    }
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
  public playContent(event, sectionName) {
    const telemetryData = {
      cdata: [{
          type: 'section',
          id: sectionName
        }],
      edata: {
        id: 'content-card',
      },
      object: {
        id: event.data.identifier,
        type: event.data.contentType || 'content',
        ver: event.data.pkgVersion ? event.data.pkgVersion.toString() : '1.0'
      }
    };
    this.getInteractEdata(telemetryData);
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
    this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$))
      .subscribe(item => {
        let title = this.resourceService.frmelmnts.lbl.noBookfoundTitle;
        let subTitle = this.resourceService.frmelmnts.lbl.noBookfoundTitle;
        let buttonText = this.resourceService.frmelmnts.lbl.noBookfoundTitle;
        if (this.queryParams.key) {
          const title_part1 = _.replace(this.resourceService.frmelmnts.lbl.desktop.yourSearch, '{key}', this.queryParams.key);
          const title_part2 = this.resourceService.frmelmnts.lbl.desktop.notMatchContent;
          title = title_part1 + ' ' + title_part2;
        } else if (_.get(this.queryParams,'selectedTab') !== 'textbook') {
          title = this.resourceService.frmelmnts.lbl.noContentfoundTitle;
          subTitle = this.resourceService.frmelmnts.lbl.noContentfoundSubTitle;
          buttonText = this.resourceService.frmelmnts.lbl.noContentfoundButtonText;
        }
        this.noResultMessage = {
          'title': title,
          'subTitle': subTitle,
          'buttonText': buttonText,
          'showExploreContentButton': true
        };
      });
  }

  public navigateToExploreContent() {
    this.router.navigate(['search/Library', 1], {
      queryParams: {
        ...this.selectedFilters, appliedFilters: false
      }
    });
  }

  getInteractEdata(event) {
    const cardClickInteractData = {
    context: {
      cdata: event.cdata,
      env: this.activatedRoute.snapshot.data.telemetry.env,
    },
    edata: {
      id: _.get(event, 'edata.id'),
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    },
    object: _.get(event, 'object')
  };
  this.telemetryService.interact(cardClickInteractData);
}
}
