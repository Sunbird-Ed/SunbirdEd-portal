import { combineLatest, Subject } from 'rxjs';
import { OrgDetailsService, UserService, SearchService, FrameworkService } from '@sunbird/core';
import { PublicPlayerService } from './../../../../services';
import { Component, OnInit, OnDestroy, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import {
  ResourceService, ToasterService, ConfigService, NavigationHelperService
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
  templateUrl: './explore.component.html'
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
  public numberOfSections = new Array(this.configService.appConfig.SEARCH.PAGE_LIMIT);
  public isLoading = true;
  public cardData: Array<{}> = [];
  @HostListener('window:scroll', []) onScroll(): void {
    this.windowScroll();
  }

  constructor(private searchService: SearchService, private toasterService: ToasterService, public userService: UserService,
    public resourceService: ResourceService, private configService: ConfigService, public activatedRoute: ActivatedRoute,
    private router: Router, private orgDetailsService: OrgDetailsService, private publicPlayerService: PublicPlayerService,
    private contentSearchService: ContentSearchService, private navigationhelperService: NavigationHelperService,
    public telemetryService: TelemetryService, private utilService: UtilService) {
  }

  ngOnInit() {
    this.getChannelId().pipe(
      mergeMap(({ channelId, custodianOrg }) => {
        this.channelId = channelId;
        this.custodianOrg = custodianOrg;
        return this.contentSearchService.initialize(channelId, custodianOrg, this.defaultFilters.board[0]);
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
      return this.orgDetailsService.getCustodianOrg()
        .pipe(map(((custOrgDetails: any) => ({ channelId: _.get(custOrgDetails, 'result.response.value'), custodianOrg: true }))));
    }
  }

  public getFilters(filters) {
    this.selectedFilters = _.pick(filters, ['board', 'medium', 'gradeLevel']);
    this.showLoader = true;
    this.apiContentList = [];
    this.pageSections = [];
    this.fetchContents();
    this.fetchCourses();
  }

  private fetchContents() {
    const request = {
      filters: this.selectedFilters,
      isCustodianOrg: this.custodianOrg,
      channelId: this.channelId,
      frameworkId: this.contentSearchService.frameworkId
    };
    const option = this.searchService.getSearchRequest(request, false);
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
        this.pageSections = this.apiContentList.slice(0, 4);
      }, err => {
        this.showLoader = false;
        this.apiContentList = [];
        this.pageSections = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
      });
  }

  private  fetchCourses() {
    this.isLoading = true;
    const request = {
      filters: this.selectedFilters,
      isCustodianOrg: this.custodianOrg,
      channelId: this.channelId,
      frameworkId: this.contentSearchService.frameworkId
    };
    this.searchService.fetchCourses(request, true).pipe(takeUntil(this.unsubscribe$)).subscribe(cardData => {
    this.isLoading = false;
    this.cardData = cardData;
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

  public playContent(event) {
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
    this.router.navigate(['explore/list/curriculum-courses'], {
      queryParams: {
        title: _.get(event, 'data.title'),
        board: _.get(this.selectedFilters, 'board'),
        medium: _.get(this.selectedFilters, 'medium'),
        gradeLevel: _.get(this.selectedFilters, 'gradeLevel')
      },
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
