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
    this.slideConfig = _.cloneDeep(this.configService.appConfig.LibraryCourses.slideConfig);
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    const formServiceInputParams = {
      formType: 'contentcategory',
      formAction: 'menubar',
      contentType: 'global'
    };
    forkJoin([this.getChannelId(), this.formService.getFormData(formServiceInputParams)]).pipe(
      mergeMap((data) => {
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
      this.layoutService.switchableLayout().
        pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig=> {
        if(layoutConfig!=null) {
          this.layoutConfiguration = layoutConfig.layout;
        }
      });
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

  public getPageData(fieldType) {
    return _.find(this.formData, (o) => o.fieldType === fieldType);
  }

  public getFilters({filters, status}) {
    this.showLoader = true;
    if (!filters || status === 'FETCHING') {
      return; // filter yet to be fetched, only show loader
    }
    const currentPageData = this.getPageData(this.activatedRoute.snapshot.queryParams.selectedTab || 'textbooks');
    this.selectedFilters = _.pick(filters, currentPageData.search.filtersToSelect);
    this.apiContentList = [];
    this.pageSections = [];
    this.fetchContents(currentPageData);
    this.fetchCourses(currentPageData);
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
    const option = this.searchService.getSearchRequest(request, currentPageData.search.contentSearch.contentType);
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
        this.toasterService.error(this.resourceService.messages.fmsg.m0005);
      });
  }

  private fetchCourses(currentPageData) {
    this.cardData = [];
    this.isLoading = true;
    const request = {
      filters: this.selectedFilters,
      fields: currentPageData.search.fields,
      isCustodianOrg: this.custodianOrg,
      channelId: this.channelId,
      frameworkId: this.contentSearchService.frameworkId
    };
    this.searchService.fetchCourses(request, currentPageData.search.courseSearch.contentType)
      .pipe(takeUntil(this.unsubscribe$)).subscribe(cardData => {
    this.isLoading = false;
    this.cardData = _.sortBy(cardData, ['title']);
  }, err => {
      this.isLoading = false;
      this.cardData = [];
      this.toasterService.error(this.resourceService.messages.fmsg.m0005);
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
      this.noResultMessage = {
        'title': this.resourceService.frmelmnts.lbl.noBookfoundTitle,
        'subTitle': this.resourceService.frmelmnts.lbl.noBookfoundSubTitle,
        'buttonText': this.resourceService.frmelmnts.lbl.noBookfoundButtonText,
        'showExploreContentButton': true
      };
    });
  }

  public navigateToExploreContent() {
    this.router.navigate(['explore', 1], {
      queryParams: {
        ...this.selectedFilters, appliedFilters: false,
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

  redoLayout(panelIndex) {
    if(this.layoutConfiguration) {
      return this.layoutService.redoLayoutCSS(panelIndex,this.layoutConfiguration,COLUMN_TYPE.threeToNine);
    } else {
      return this.layoutService.redoLayoutCSS(panelIndex,null,COLUMN_TYPE.fullLayout);
    }
  }

}
