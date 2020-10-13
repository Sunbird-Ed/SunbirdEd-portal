import { combineLatest, Subject, of, Observable } from 'rxjs';
import { PageApiService, OrgDetailsService, FormService, UserService } from '@sunbird/core';
import { Component, OnInit, OnDestroy, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import {
  ResourceService, ToasterService, INoResultMessage, ConfigService, UtilService, ICaraouselData, BrowserCacheTtlService, ServerResponse,
  NavigationHelperService, LayoutService, COLUMN_TYPE
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { PublicPlayerService } from './../../../../services';
import { takeUntil, map, mergeMap, first, filter, catchError } from 'rxjs/operators';

@Component({
  templateUrl: './public-course.component.html'
})
export class PublicCourseComponent implements OnInit, OnDestroy, AfterViewInit {

  public showLoader = true;
  public showLoginModal = false;
  public baseUrl: string;
  public noResultMessage: INoResultMessage;
  public carouselMasterData: Array<ICaraouselData> = [];
  public filterType: string;
  public queryParams: any;
  public hashTagId: string;
  public unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  public inViewLogs = [];
  public sortIntractEdata: IInteractEventEdata;
  public dataDrivenFilters: any = {};
  public dataDrivenFilterEvent = new EventEmitter();
  public frameWorkName: string;
  public initFilters = false;
  public loaderMessage;
  public pageSections: Array<ICaraouselData> = [];
  public toUseFrameWorkData = false;
  layoutConfiguration: any;
  FIRST_PANEL_LAYOUT;
  SECOND_PANEL_LAYOUT;
  pageTitle;
  pageTitleSrc;
  svgToDisplay;
  formData: any;
  public facets;
  public facetsList: any;
  public selectedFilters;
  public slugForProminentFilter = (<HTMLInputElement>document.getElementById('slugForProminentFilter')) ?
  (<HTMLInputElement>document.getElementById('slugForProminentFilter')).value : null;

  @HostListener('window:scroll', []) onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
    && this.pageSections.length < this.carouselMasterData.length) {
        this.pageSections.push(this.carouselMasterData[this.pageSections.length]);
    }
  }
  constructor(private pageApiService: PageApiService, private toasterService: ToasterService,
    public resourceService: ResourceService, private configService: ConfigService, private activatedRoute: ActivatedRoute,
    public router: Router, private utilService: UtilService, private orgDetailsService: OrgDetailsService,
    private publicPlayerService: PublicPlayerService, private cacheService: CacheService,
    private browserCacheTtlService: BrowserCacheTtlService, private userService: UserService, public formService: FormService,
    public navigationhelperService: NavigationHelperService, public layoutService: LayoutService) {
    this.router.onSameUrlNavigation = 'reload';
    this.filterType = this.configService.appConfig.exploreCourse.filterType;
    this.setTelemetryData();
  }

  ngOnInit() {
   this.initLayout();
    combineLatest(
      this.orgDetailsService.getOrgDetails(this.userService.slug),
      this.getFrameWork(),
      this.getFormData()
    ).pipe(
      mergeMap((data: any) => {
        this.hashTagId = data[0].hashTagId;
        // TODO change the slug to 'Igot'
        if (this.userService.slug === this.slugForProminentFilter) {
          this.toUseFrameWorkData = true;
        }
        if (data[1]) {
          this.initFilters = true;
          this.frameWorkName = data[1];
          return of({});
          // return this.dataDrivenFilterEvent;
        } else {
          return of({});
        }
      }), first()
    ).subscribe((filters: any) => {
        this.dataDrivenFilters = filters;
        this.fetchContentOnParamChange();
        this.setNoResultMessage();
      },
      error => {
        this.router.navigate(['']);
      }
    );
  }

  getFormData() {
    const formServiceInputParams = {
      formType: 'contentcategory',
      formAction: 'menubar',
      contentType: 'global'
    };
    return this.formService.getFormConfig(formServiceInputParams).pipe(map((data: any) => {
      _.forEach(data, (value, key) => {
        if (_.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') === value.contentType) {
          this.pageTitle = _.get(this.resourceService, value.title);
          this.pageTitleSrc = this.resourceService.RESOURCE_CONSUMPTION_ROOT+value.title;
          this.svgToDisplay = _.get(value, 'theme.imageName');
        } else if (Object.keys(_.get(this.activatedRoute, 'snapshot.queryParams')).length === 0) {
          if (value.contentType === 'course') {
            this.pageTitle = _.get(this.resourceService, value.title);
            this.svgToDisplay = _.get(value, 'theme.imageName');
          }
        }
      });
      this.formData = data;
      return data;
    }), catchError((error) => {
      return of(false);
    }));
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

  public getFilters(filters) {
    const filterData = filters && filters.filters || {};
    if (filterData.channel && this.facets) {
      const channelIds = [];
      const facetsData = _.find(this.facets, {'name': 'channel'});
      _.forEach(filterData.channel, (value, index) => {
        const data = _.find(facetsData.values, {'identifier': value});
        if (data) {
          channelIds.push(data.name);
        }
      });
      if (channelIds && Array.isArray(channelIds) && channelIds.length > 0) {
        filterData.channel = channelIds;
      }
    }
    this.selectedFilters = filterData;
    const defaultFilters = _.reduce(filters, (collector: any, element) => {
        if (element && element.code === 'board') {
          collector.board = _.get(_.orderBy(element.range, ['index'], ['asc']), '[0].name') || '';
        }
        return collector;
      }, {});
    this.dataDrivenFilterEvent.emit(defaultFilters);
  }
  private getFrameWork() {
      const formServiceInputParams = {
        formType: 'framework',
        formAction: 'search',
        contentType: 'framework-code',
      };
      return this.formService.getFormConfig(formServiceInputParams, this.hashTagId)
        .pipe(map((data: ServerResponse) => {
            const frameWork = _.find(data, 'framework').framework;
            return frameWork;
        }), catchError((error) => {
          return of(false);
        }));
  }
  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
    .pipe(map((result) => ({params: result[0], queryParams: result[1]})),
        filter(({queryParams}) => !_.isEqual(this.queryParams, queryParams)), // fetch data if queryParams changed
        takeUntil(this.unsubscribe$))
      .subscribe(({params, queryParams}) => {
        this.showLoader = true;
        this.queryParams = { ...queryParams };
        this.carouselMasterData = [];
        this.pageSections = [];
        this.fetchPageData();
      });
  }

  public getPageData(data) {
    return _.find(this.formData, (o) => o.contentType === data);
  }

  private prepareCarouselData(sections = []) {
    const { constantData, metaData, dynamicFields, slickSize } = this.configService.appConfig.CoursePage;
      const carouselData = _.reduce(sections, (collector, element) => {
        const contents = _.slice(_.get(element, 'contents'), 0, slickSize) || [];
        element.contents = this.utilService.getDataForCard(contents, constantData, dynamicFields, metaData);
        if (element.contents && element.contents.length) {
          collector.push(element);
        }
        return collector;
      }, []);
      return carouselData;
  }
  public prepareVisits(event) {
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

  processOrgData(channels) {
    const rootOrgIds = [];
    _.forEach(channels, (channelData) => {
      if (channelData.name) {
        rootOrgIds.push(channelData.name);
      }
    });
    return rootOrgIds;
  }

  private fetchPageData() {
    const currentPageData = this.getPageData(_.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'course');
    let filters = _.pickBy(this.queryParams, (value: Array<string> | string, key) => {
      if (key === 'appliedFilters' || key === 'selectedTab') {
        return false;
      }
      return value.length;
    });
    filters = _.omit(filters, ['utm_source']);
    // if (localStorage.getItem('userType')) {
    //   const userType = localStorage.getItem('userType');
    //   const userTypeMapping = this.configService.appConfig.userTypeMapping;
    //   _.map(userTypeMapping, (value, key) => {
    //     if (userType === key) {
    //       filters['audience'] = value;
    //     }
    //   });
    // }
    // filters.board = _.get(this.queryParams, 'board') || this.dataDrivenFilters.board;
    const option = {
      source: 'web',
      name: 'Course',
      organisationId: this.hashTagId || '*',
      filters: filters,
      fields: _.get(currentPageData, 'search.fields') || this.configService.urlConFig.params.CourseSearchField,
      facets: _.get(currentPageData, 'search.facets') || ['channel', 'gradeLevel', 'subject', 'medium'],
      // softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 },
      // mode: 'soft',
      // exists: [],
      params: this.configService.appConfig.ExplorePage.contentApiQueryParams
    };
    this.pageApiService.getPageData(option).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      let facetsList: any = this.utilService.processData(_.get(data, 'sections'), option.facets);
      const rootOrgIds = this.processOrgData(facetsList.channel);
      this.orgDetailsService.searchOrgDetails({
        filters: {isRootOrg: true, rootOrgId: rootOrgIds},
        fields: ['slug', 'identifier', 'orgName']
      }).subscribe((orgDetails) => {
        this.showLoader = false;
        this.carouselMasterData = this.prepareCarouselData(_.get(data, 'sections'));
        facetsList.channel = _.get(orgDetails, 'content');
        facetsList = this.utilService.removeDuplicate(facetsList);
        this.facets = this.updateFacetsData(facetsList);
        this.getFilters({filters: this.selectedFilters});
        this.initFilters = true;
        if (!this.carouselMasterData.length) {
          return; // no page section
        }
        if (this.carouselMasterData.length >= 2) {
          this.pageSections = [this.carouselMasterData[0], this.carouselMasterData[1]];
        } else if (this.carouselMasterData.length >= 1) {
          this.pageSections = [this.carouselMasterData[0]];
        }
      }, err => {
        this.showLoader = false;
        this.carouselMasterData = [];
        this.pageSections = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
      });
    }, err => {
      this.showLoader = false;
      this.carouselMasterData = [];
      this.pageSections = [];
      this.toasterService.error(this.resourceService.messages.fmsg.m0004);
    });
  }

  public viewAll(event) {
    const searchQuery = JSON.parse(event.searchQuery);
    const searchQueryParams: any = {};
    _.forIn(searchQuery.request.filters, (value, key) => {
      if (_.isPlainObject(value)) {
        searchQueryParams.dynamic = JSON.stringify({[key]: value});
      } else {
        searchQueryParams[key] = value;
      }
    });
    searchQueryParams.defaultSortBy = JSON.stringify(searchQuery.request.sort_by);
    searchQueryParams['exists'] = _.get(searchQuery, 'request.exists');
    // searchQuery.request.filters.channel = this.hashTagId;
    // searchQuery.request.filters.board = this.dataDrivenFilters.board;
    this.cacheService.set('viewAllQuery', searchQueryParams);
    this.cacheService.set('pageSection', event, { maxAge: this.browserCacheTtlService.browserCacheTtl });
    const queryParams = { ...searchQueryParams, ...this.queryParams};
    const sectionUrl = this.router.url.split('?')[0] + '/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], {queryParams: queryParams});
  }
  ngAfterViewInit () {
    setTimeout(() => {
      this.setTelemetryData();
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private setTelemetryData() {
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
    this.sortIntractEdata = {
      id: 'sort',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }
  private setNoResultMessage() {
    this.noResultMessage = {
      'message': 'messages.stmsg.m0007',
      'messageText': 'messages.stmsg.m0006'
    };
  }

  updateFacetsData(facets) {
    const facetsData = [];
    _.forEach(facets, (facet, key) => {
      switch (key) {
        case 'board':
          const boardData = {
            index: '1',
            label: _.get(this.resourceService, 'frmelmnts.lbl.boards'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectBoard'),
            values: facet,
            name: key
          };
          facetsData.push(boardData);
          break;
        case 'medium':
          const mediumData = {
            index: '2',
            label: _.get(this.resourceService, 'frmelmnts.lbl.medium'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectMedium'),
            values: facet,
            name: key
          };
          facetsData.push(mediumData);
          break;
        case 'gradeLevel':
          const gradeLevelData = {
            index: '3',
            label: _.get(this.resourceService, 'frmelmnts.lbl.class'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectClass'),
            values: facet,
            name: key
          };
          facetsData.push(gradeLevelData);
          break;
        case 'subject':
          const subjectData = {
            index: '4',
            label: _.get(this.resourceService, 'frmelmnts.lbl.subject'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectSubject'),
            values: facet,
            name: key
          };
          facetsData.push(subjectData);
          break;
        case 'publisher':
          const publisherData = {
            index: '5',
            label: _.get(this.resourceService, 'frmelmnts.lbl.publisher'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectPublisher'),
            values: facet,
            name: key
          };
          facetsData.push(publisherData);
          break;
        case 'contentType':
          const contentTypeData = {
            index: '6',
            label: _.get(this.resourceService, 'frmelmnts.lbl.contentType'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.selectContentType'),
            values: facet,
            name: key
          };
          facetsData.push(contentTypeData);
          break;
        case 'channel':
          const channelLists = [];
          _.forEach(facet, (channelList) => {
            if (channelList.orgName) {
              channelList.name = channelList.orgName;
            }
            channelLists.push(channelList);
          });
          const channelData = {
            index: '1',
            label: _.get(this.resourceService, 'frmelmnts.lbl.orgname'),
            placeholder: _.get(this.resourceService, 'frmelmnts.lbl.orgname'),
            values: channelLists,
            name: key
          };
          facetsData.push(channelData);
          break;
      }
    });
    return facetsData;
  }
}
