import {forkJoin, Subject} from 'rxjs';
import {OrgDetailsService, UserService, SearchService, FormService} from '@sunbird/core';
import { PublicPlayerService } from './../../../../services';
import { Component, OnInit, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import {
  ResourceService, ToasterService, ConfigService, NavigationHelperService, LayoutService, COLUMN_TYPE
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, filter, tap, skip } from 'rxjs/operators';
import { ContentSearchService } from '@sunbird/content-search';
import { UtilService } from './../../../../../shared/services/util/util.service';
const DEFAULT_FRAMEWORK = 'CBSE';
@Component({
  selector: 'app-explore-component',
  templateUrl: './explore.component.html',
  styles: ['.course-card-width { width: 280px !important }']
})
export class ExploreComponent implements OnInit, OnDestroy, AfterViewInit {
  public initFilter = false;
  public showLoader = true;
  public noResultMessage;
  public apiContentList: Array<any> = [];
  private unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  private inViewLogs = [];
  public pageSections: Array<any> = [];
  public channelId: string;
  public custodianOrg = true;
  public defaultFilters = {
    board: [DEFAULT_FRAMEWORK],
    gradeLevel: ['Class 10'],
    medium: []
  };
  public selectedFilters = {};
  exploreMoreButtonEdata: IInteractEventEdata;
  public numberOfSections = new Array(this.configService.appConfig.SEARCH.SECTION_LIMIT);
  public isLoading = true;
  public cardData: Array<{}> = [];
  slideConfig: object = {};
  layoutConfiguration: any;
  formData: any;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  pageTitle;
  svgToDisplay;
  queryParams;
  pageTitleSrc;

  @HostListener('window:scroll', []) onScroll(): void {
    this.windowScroll();
  }

  constructor(private searchService: SearchService, private toasterService: ToasterService, public userService: UserService,
    public resourceService: ResourceService, private configService: ConfigService, public activatedRoute: ActivatedRoute,
    private router: Router, private orgDetailsService: OrgDetailsService, private publicPlayerService: PublicPlayerService,
    private contentSearchService: ContentSearchService, private navigationhelperService: NavigationHelperService,
    public telemetryService: TelemetryService, public layoutService: LayoutService,
    public formService: FormService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(queryParams => {
      this.queryParams = { ...queryParams };
  });
    this.slideConfig = _.cloneDeep(this.configService.appConfig.LibraryCourses.slideConfig);
    this.initLayout();
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

  private windowScroll () {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
      && this.pageSections.length < this.apiContentList.length) {
      this.pageSections.push(this.apiContentList[this.pageSections.length]);
    }
  }

  private getChannelId() {
    if (this.userService.slug) {
      return this.orgDetailsService.getOrgDetails(this.userService.slug)
        .pipe(map(((orgDetails: any) => ({ channelId: orgDetails.hashTagId, custodianOrg: false }))));
    } else {
      return this.orgDetailsService.getCustodianOrgDetails()
        .pipe(map(((custOrgDetails: any) => ({ channelId: _.get(custOrgDetails, 'result.response.value'), custodianOrg: true }))));
    }
  }

  public getPageData(data) {
    return _.find(this.formData, (o) => o.contentType === data);
  }

  public getFilters({filters, status}) {
    this.showLoader = true;
    if (!filters || status === 'FETCHING') {
      return; // filter yet to be fetched, only show loader
    }
    const currentPageData = this.getPageData(_.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'textbook');
    this.selectedFilters = _.pick(filters, ['board', 'medium', 'gradeLevel', 'channel']);
    this.apiContentList = [];
    this.pageSections = [];
    this.pageTitleSrc = this.resourceService.RESOURCE_CONSUMPTION_ROOT+_.get(currentPageData, 'title');
    this.pageTitle = _.get(this.resourceService, _.get(currentPageData, 'title'));;
    this.svgToDisplay = _.get(currentPageData, 'theme.imageName');
    this.fetchContents(currentPageData);
  }

  private fetchContents(currentPageData) {
    const request = {
      filters: this.selectedFilters,
      fields: currentPageData.search.fields,
      isCustodianOrg: this.custodianOrg,
      channelId: this.channelId,
      frameworkId: this.contentSearchService.frameworkId
    };
    if ( _.get(this.selectedFilters, 'channel') && (_.get(this.selectedFilters, 'channel')).length > 0) {
      request.channelId = this.selectedFilters['channel'];
    }
    const option = this.searchService.getSearchRequest(request, currentPageData.search.filters.contentType);
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

  private  fetchCourses() {
    this.cardData = [];
    this.isLoading = true;
    const request = {
      filters: this.selectedFilters,
      isCustodianOrg: this.custodianOrg,
      channelId: this.channelId,
      frameworkId: this.contentSearchService.frameworkId
    };
    this.searchService.fetchCourses(request, ['Course']).pipe(takeUntil(this.unsubscribe$)).subscribe(cardData => {
    this.isLoading = false;
    this.cardData = _.sortBy(cardData, ['title']);
  }, err => {
      this.isLoading = false;
      this.cardData = [];
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
    this.publicPlayerService.playContent(event);
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
      id: 'explore-more-content-button',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.userService.slug ? '/' + this.userService.slug + this.router.url : this.router.url,
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
        } else if (_.get(this.queryParams, 'selectedTab') !== 'textbook') {
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
    this.router.navigate(['explore', 1], {
      queryParams: {
        ...this.selectedFilters, appliedFilters: false, pageTitle: this.pageTitle,
        softConstraints: JSON.stringify({ badgeAssertions: 100, channel: 99, gradeLevel: 98, medium: 97, board: 96 })
      }
    });
  }

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
      this.router.navigate(['explore-course/course', _.get(event.data, 'contents[0].identifier')]);
    } else {
      this.searchService.subjectThemeAndCourse = event.data;
      this.router.navigate(['explore/list/curriculum-courses'], {
        queryParams: {
          title: _.get(event, 'data.title')
        },
      });
    }
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
