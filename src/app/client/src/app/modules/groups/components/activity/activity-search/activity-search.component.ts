import { ADD_ACTIVITY_TO_GROUP } from './../../../interfaces/routerLinks';
import { CourseConsumptionService } from '@sunbird/learn';
import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { FrameworkService, SearchService, FormService, UserService, OrgDetailsService } from '@sunbird/core';
import {
  ConfigService,
  ResourceService,
  ToasterService,
  PaginationService,
  UtilService,
  LayoutService
} from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject, of, combineLatest } from 'rxjs';
import { takeUntil, map, catchError, first, debounceTime, tap, delay, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination } from '../../../../shared/interfaces/index';
import { CacheService } from '../../../../shared/services/cache-service/cache.service';
import { GroupsService } from '../../../services/groups/groups.service';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { CsGroupAddableBloc } from '@project-sunbird/client-services/blocs';
import { VIEW_ACTIVITY, CATEGORY_SEARCH } from '../../../interfaces/telemetryConstants';
import { ActivityDashboardService } from '@sunbird/shared';
import { sessionKeys } from '../../../interfaces/group';


@Component({
  selector: 'app-activity-search',
  templateUrl: './activity-search.component.html',
  styleUrls: ['./activity-search.component.scss']
})
export class ActivitySearchComponent implements OnInit, OnDestroy {
  showFilters = false;
  searchResultCount = 0;
  searchQuery: string;
  showLoader = true;
  numberOfSections = new Array(this.configService.appConfig.SEARCH.PAGE_LIMIT);
  queryParams: any;
  unsubscribe$ = new Subject<void>();
  frameworkId: string;
  contentList: any[] = [];
  initFilters = false;
  frameWorkName: string;
  filterType: string;
  facets: Array<string>;
  facetsList: any;
  dataDrivenFilters: any = {};
  dataDrivenFilterEvent = new EventEmitter();
  paginationDetails: IPagination;
  noResultMessage: any;
  groupData;
  groupId: string;
  telemetryImpression: IImpressionEventInput;
  layoutConfiguration: any;
  groupAddableBlocData: any;
  public globalSearchFacets: Array<string>;
  public allTabData;
  public selectedFilters;
  public ADD_ACTIVITY_TO_GROUP = ADD_ACTIVITY_TO_GROUP;
  private csGroupAddableBloc: CsGroupAddableBloc;


  public slugForProminentFilter = (<HTMLInputElement>document.getElementById('slugForProminentFilter')) ?
    (<HTMLInputElement>document.getElementById('slugForProminentFilter')).value : null;
  orgDetailsFromSlug = this.cacheService.get('orgDetailsFromSlug');


  constructor(
    public resourceService: ResourceService,
    public configService: ConfigService,
    private frameworkService: FrameworkService,
    private searchService: SearchService,
    private toasterService: ToasterService,
    private formService: FormService,
    private activatedRoute: ActivatedRoute,
    private paginationService: PaginationService,
    private utilService: UtilService,
    private userService: UserService,
    private cacheService: CacheService,
    private router: Router,
    private groupsService: GroupsService,
    public layoutService: LayoutService,
    public courseConsumptionService: CourseConsumptionService,
    public orgDetailsService: OrgDetailsService,
    public groupService: GroupsService,
    public activityDashboardService: ActivityDashboardService,
  ) {
    this.csGroupAddableBloc = CsGroupAddableBloc.instance;
  }

  ngOnInit() {
    CsGroupAddableBloc.instance.state$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if(data){
        sessionStorage.setItem(sessionKeys.GROUPADDABLEBLOCDATA, JSON.stringify((data)))
      }
      this.groupAddableBlocData = data || JSON.parse(sessionStorage.getItem(sessionKeys.GROUPADDABLEBLOCDATA));
    });
    this.activityDashboardService.isActivityAdded = false; // setting this value to enable or disable the activity dashboard button in activity-dashboard directive
    this.searchService.getContentTypes().pipe(takeUntil(this.unsubscribe$)).subscribe(formData => {
      this.allTabData = _.find(formData, (o) => o.title === 'frmelmnts.tab.all');
      this.globalSearchFacets = _.get(this.allTabData, 'search.facets');
    }, error => {
      this.toasterService.error(this.resourceService.frmelmnts.lbl.fetchingContentFailed);
    });
    this.initLayout();
    this.filterType = this.configService.appConfig.courses.filterType;
    this.groupData = this.groupsService.groupData;
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    this.paginationDetails = this.paginationService.getPager(0, 1, this.configService.appConfig.SEARCH.PAGE_LIMIT);
    this.getFrameworkId();
    this.getFrameWork().pipe(first()).subscribe(framework => {
      this.initFilters = true;
      this.frameWorkName = framework;
      if (this.userService._isCustodianUser && this.orgDetailsFromSlug) {
        if (_.get(this.orgDetailsFromSlug, 'slug') === this.slugForProminentFilter) {
          this.showFilters = false;
        }
      }
      this.dataDrivenFilters = {};
      this.fetchContentOnParamChange();
      this.setNoResultMessage();
      // tslint:disable-next-line:max-line-length
      this.telemetryImpression = this.groupsService.getImpressionObject(this.activatedRoute.snapshot, this.router.url, {type: CATEGORY_SEARCH});
    }, error => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0002);
    });
  }

  /**
   * used to archive the both theme
   */
  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  private fetchContentOnParamChange() {
    combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
      .pipe(debounceTime(5), // to sync params and queryParams events
        delay(10), // to trigger pageexit telemetry event
        tap(data => {
          this.showLoader = true;
          // TODO set telemetry here
        }),
        map((result) => ({ params: { pageNumber: Number(result[0].pageNumber) }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$))
      .subscribe(({ params, queryParams }) => {
          this.queryParams = { ...queryParams };
          this.paginationDetails.currentPage = params.pageNumber;
          this.contentList = [];
          this.fetchContents();
      });
  }

  getFrameworkId() {
    this.frameworkService.channelData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((channelData) => {
        /* istanbul ignore else */
        if (!channelData.err) {
          this.frameworkId = _.get(channelData, 'channelData.defaultFramework');
        }
      }, error => {
        console.error('Unable to fetch framework', error);
      });
  }

  public getFilters(filters) {
    const filterData = filters && filters.filters || {};
    if (filterData.channel && this.facets) {
      const channelIds = [];
      const facetsData = _.find(this.facets, { 'name': 'channel' });
      _.forEach(filterData.channel, (value, index) => {
        const data = _.find(facetsData.values, { 'identifier': value });
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

      /* istanbul ignore else */
      if (element.code === 'board') {
        collector.board = _.get(_.orderBy(element.range, ['index'], ['asc']), '[0].name') || '';
      }
      return collector;
    }, {});
    this.dataDrivenFilterEvent.emit(defaultFilters);
  }

  search() {
    const url = this.router.url.split('?')[0].replace(/[^\/]+$/, `1`);
    if (this.searchQuery.trim().length) {
      this.addTelemetry('add-course-activity-search', [], { query: this.searchQuery });
      this.router.navigate([url], { queryParams: { key: this.searchQuery } });
    } else {
      this.router.navigate([url]);
    }
  }

  private getFrameWork() {
    const formServiceInputParams = {
      formType: 'framework',
      formAction: 'search',
      contentType: 'framework-code',
    };
    return this.formService.getFormConfig(formServiceInputParams)
      .pipe(map((data) => {
        const frameWork = _.find(data, 'framework').framework;
        return frameWork;
      }), catchError((error) => {
        return of(false);
      }));
  }

  private fetchContents() {
    let filters = _.pickBy(this.queryParams, (value: Array<string> | string) => value && value.length);
    const searchQuery = _.get(this.groupAddableBlocData, 'params.searchQuery.request.filters');
    const user = _.omit(_.get(this.userService.userProfile, 'framework'), 'id');
    const option: any = {
      filters: _.omit({ ...filters, ...searchQuery, ...user }, 'key'),
      fields: _.get(this.allTabData, 'search.fields'),
      limit: this.configService.appConfig.SEARCH.PAGE_LIMIT,
      pageNumber: this.paginationDetails.currentPage,
      facets: this.globalSearchFacets,
      params: this.configService.appConfig.Course.contentApiQueryParams,
      mode: 'soft'
    };

    if (_.get(this.queryParams, 'sort_by')) {
      option.sort_by = { [this.queryParams.sort_by]: this.queryParams.sortType };
    }

    /* istanbul ignore else */
    if (_.get(this.queryParams, 'key')) {
      option.query = this.queryParams.key;
      option.filters =  _.omit({ ...filters, ...searchQuery }, 'key');
    }

    /* istanbul ignore else */
    if (this.frameWorkName) {
      option.params.framework = this.frameWorkName;
    }
    this.searchService.contentSearch(option, false)
      .pipe(
        mergeMap(data => {
          const channelFacet = _.find(_.get(data, 'result.facets') || [], facet => _.get(facet, 'name') === 'channel');
          if (channelFacet) {
            const rootOrgIds = this.orgDetailsService.processOrgData(_.get(channelFacet, 'values'));
            return this.orgDetailsService.searchOrgDetails({
              filters: { isTenant: true, id: rootOrgIds },
              fields: ['slug', 'identifier', 'orgName']
            }).pipe(
              mergeMap(orgDetails => {
                channelFacet.values = _.get(orgDetails, 'content');
                return of(data);
              })
            );
          }
          return of(data);
        })
      )
      .subscribe(data => {
        this.showLoader = false;
        this.facets = this.searchService.updateFacetsData(_.get(data, 'result.facets'));
        this.facetsList = this.searchService.processFilterData(_.get(data, 'result.facets'));
        this.paginationDetails = this.paginationService.getPager(data.result.count, this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT);
        const { constantData, metaData, dynamicFields } = this.configService.appConfig.CoursePageSection.course;
        this.contentList = _.map(data.result.content, (content: any) =>
          this.utilService.processContent(content, constantData, dynamicFields, metaData));
        _.each(this.contentList, item => {
          item.hoverData = {
            'actions': [
              {
                'type': 'view',
                'label': this.resourceService.frmelmnts.lbl.group.viewActivity
              },
              {
                'type': 'addToGroup',
                'label': this.resourceService.frmelmnts.lbl.AddtoGroup
              }
            ]
          };
        });

      }, err => {
        this.showLoader = false;
        this.contentList = [];
        this.facetsList = [];
        this.paginationDetails = this.paginationService.getPager(0, this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT);
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      });
  }

  public navigateToPage(page: number): void {
    /* istanbul ignore else */
    if (page < 1 || page > this.paginationDetails.totalPages) {
      return;
    }
    const url = this.router.url.split('?')[0].replace(/[^\/]+$/, page.toString());
    this.router.navigate([url], { queryParams: this.queryParams });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  toggleFilter() {
    this.showFilters = !this.showFilters;
    // TOTO add interact telemetry here
  }

  addActivity(activityCard) {
    this.groupAddableBlocData.pageIds = [_.get(activityCard, 'primaryCategory').toLowerCase(), ADD_ACTIVITY_TO_GROUP];
    this.csGroupAddableBloc.updateState(this.groupAddableBlocData);
    const cdata = [{ id: _.get(activityCard, 'identifier'), type: _.get(activityCard, 'primaryCategory') }];
    this.addTelemetry('activity-course-card', cdata, '', {type: VIEW_ACTIVITY});
    const isTrackable = this.courseConsumptionService.isTrackableCollection(activityCard);
    const contentMimeType = _.get(activityCard, 'mimeType');

    if (contentMimeType === 'application/vnd.ekstep.content-collection' && isTrackable) {

      this.router.navigate(['/learn/course', _.get(activityCard, 'identifier')], { queryParams: { groupId: _.get(this.groupData, 'id') } });

    } else if (contentMimeType === 'application/vnd.ekstep.content-collection' && !isTrackable) {

      this.router.navigate(['/resources/play/collection', _.get(activityCard, 'identifier')],
      {queryParams: {contentType: _.get(activityCard, 'primaryCategory'), groupId: _.get(this.groupData, 'id')}});

    } else if (contentMimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.questionset) {
      this.router.navigate(['/resources/play/questionset', _.get(activityCard, 'identifier')],
      {queryParams: {contentType: _.get(activityCard, 'primaryCategory'), groupId: _.get(this.groupData, 'id')}});
    } else {
      this.router.navigate(['/resources/play/content', _.get(activityCard, 'identifier')],
      {queryParams: {contentType: _.get(activityCard, 'primaryCategory'), groupId: _.get(this.groupData, 'id')}});
    }
  }

  /**
   * @description - To set the telemetry Intract event data
   * @param  {} edata? - it's an object to specify the type and subtype of edata
   */
  addTelemetry(id, cdata, extra?, edata?) {
    this.groupsService.addTelemetry({ id, extra, edata}, this.activatedRoute.snapshot, cdata || [], this.groupId);
  }

  private setNoResultMessage() {
    this.noResultMessage = {
      'message': 'messages.stmsg.m0007',
      'messageText': 'messages.stmsg.m0006'
    };
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  hoverActionClicked(event, appAddToGroupElement: HTMLDivElement) {
    const mode = _.get(event, 'hover.type').toLowerCase();
    switch (mode) {
      case 'view':
        this.addActivity(_.get(event, 'content'));
        break;
      case 'addtogroup':
        appAddToGroupElement.click();
        break;
    }
  }
}
