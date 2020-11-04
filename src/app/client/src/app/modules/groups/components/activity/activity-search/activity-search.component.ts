import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { FrameworkService, SearchService, FormService, UserService } from '@sunbird/core';
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
import { takeUntil, map, catchError, first, debounceTime, tap, delay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination } from '../../../../shared/interfaces/index';
import { CacheService } from 'ng2-cache-service';
import { GroupsService } from '../../../services/groups/groups.service';
import { IImpressionEventInput } from '@sunbird/telemetry';

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
    public layoutService: LayoutService
  ) { }

  ngOnInit() {
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
      this.telemetryImpression = this.groupsService.getImpressionObject(this.activatedRoute.snapshot, this.router.url);
    }, error => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0002);
    });
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }
  private fetchContentOnParamChange() {
    combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams, this.groupsService.getGroupById(this.groupId, true, true)])
      .pipe(debounceTime(5), // to sync params and queryParams events
        delay(10), // to trigger pageexit telemetry event
        tap(data => {
          this.showLoader = true;
          // TODO set telemetry here
        }),
        map((result) => ({ params: { pageNumber: Number(result[0].pageNumber) }, queryParams: result[1], group: result[2] })),
        takeUntil(this.unsubscribe$))
      .subscribe(({ params, queryParams, group }) => {
        const user = _.find(_.get(group, 'members'), (m) => _.get(m, 'userId') === this.userService.userid);

        /* istanbul ignore else */
        if (!user || _.get(user, 'role') === 'member' || _.get(user, 'status') === 'inactive' || _.get(group, 'status') === 'inactive') {
          this.toasterService.warning(this.resourceService.messages.emsg.noAdminRole);
          this.groupsService.goBack();
        } else {
          this.groupData = this.groupsService.addGroupFields(group);
          this.queryParams = { ...queryParams };
          this.paginationDetails.currentPage = params.pageNumber;
          this.contentList = [];
          this.fetchContents();
        }
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
    this.facets = filters.map(element => element.code);
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
    filters = _.omit(filters, ['key', 'sort_by', 'sortType', 'appliedFilters']);
    const option: any = {
      filters: filters,
      limit: this.configService.appConfig.SEARCH.PAGE_LIMIT,
      pageNumber: this.paginationDetails.currentPage,
      facets: this.facets,
      params: this.configService.appConfig.Course.contentApiQueryParams
    };

    if (_.get(this.queryParams, 'sort_by')) {
      option.sort_by = { [this.queryParams.sort_by]: this.queryParams.sortType };
    }

    /* istanbul ignore else */
    if (_.get(this.queryParams, 'key')) {
      option.query = this.queryParams.key;
    }

    /* istanbul ignore else */
    if (this.frameWorkName) {
      option.params.framework = this.frameWorkName;
    }
    this.searchService.courseSearch(option)
      .subscribe(data => {
        this.showLoader = false;
        this.facetsList = this.searchService.processFilterData(_.get(data, 'result.facets'));
        this.paginationDetails = this.paginationService.getPager(data.result.count, this.paginationDetails.currentPage,
          this.configService.appConfig.SEARCH.PAGE_LIMIT);
        const { constantData, metaData, dynamicFields } = this.configService.appConfig.CoursePageSection.course;
        this.contentList = _.map(data.result.course, (content: any) =>
          this.utilService.processContent(content, constantData, dynamicFields, metaData));
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

  addActivity(event) {
    const cdata = [{id: _.get(event, 'data.identifier'), type: 'Course'}];
    this.addTelemetry('activity-course-card', cdata);
    this.router.navigate(['/learn/course', _.get(event, 'data.identifier')], { queryParams: { groupId: _.get(this.groupData, 'id') } });
  }

  addTelemetry(id, cdata, extra?) {
    this.groupsService.addTelemetry(id, this.activatedRoute.snapshot, cdata, this.groupId, extra);
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

}
