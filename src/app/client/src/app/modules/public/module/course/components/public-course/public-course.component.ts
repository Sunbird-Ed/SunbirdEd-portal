import { combineLatest, Subject, of, Observable } from 'rxjs';
import { PageApiService, OrgDetailsService, FormService, UserService } from '@sunbird/core';
import { Component, OnInit, OnDestroy, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import {
  ResourceService, ToasterService, INoResultMessage, ConfigService, UtilService, ICaraouselData, BrowserCacheTtlService, ServerResponse,
  NavigationHelperService
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { PublicPlayerService } from './../../../../services';
import { takeUntil, map, mergeMap, first, filter, catchError } from 'rxjs/operators';

@Component({
  templateUrl: './public-course.component.html',
  styleUrls: ['./public-course.component.scss']
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
    public navigationhelperService: NavigationHelperService) {
    this.router.onSameUrlNavigation = 'reload';
    this.filterType = this.configService.appConfig.exploreCourse.filterType;
    this.setTelemetryData();
  }

  ngOnInit() {
    combineLatest(
      this.orgDetailsService.getOrgDetails(this.activatedRoute.snapshot.params.slug),
      this.getFrameWork()
    ).pipe(
      mergeMap((data: any) => {
        this.hashTagId = data[0].hashTagId;
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
  public getFilters(filters) {
    const defaultFilters = _.reduce(filters, (collector: any, element) => {
        if (element.code === 'board') {
          collector.board = _.get(_.orderBy(element.range, ['index'], ['asc']), '[0].name') || '';
        }
        return collector;
      }, {});
    this.dataDrivenFilterEvent.emit(defaultFilters);
  }
  private getFrameWork() {
    const framework = this.cacheService.get('framework' + 'search');
    if (framework) {
      return of(framework);
    } else {
      const formServiceInputParams = {
        formType: 'framework',
        formAction: 'search',
        contentType: 'framework-code',
      };
      return this.formService.getFormConfig(formServiceInputParams, this.hashTagId)
        .pipe(map((data: ServerResponse) => {
            const frameWork = _.find(data, 'framework').framework;
            this.cacheService.set('framework' + 'search', frameWork, { maxAge: this.browserCacheTtlService.browserCacheTtl});
            return frameWork;
        }), catchError((error) => {
          return of(false);
        }));
    }
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
  private fetchPageData() {
    const filters = _.pickBy(this.queryParams, (value: Array<string> | string, key) => {
      if ( key === 'appliedFilters') {
        return false;
      }
      return value.length;
    });
    // filters.board = _.get(this.queryParams, 'board') || this.dataDrivenFilters.board;
    const option = {
      source: 'web',
      name: 'AnonymousCourse',
      filters: filters,
      // softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 },
      // mode: 'soft',
      // exists: [],
      params : this.configService.appConfig.ExplorePage.contentApiQueryParams
    };
    this.pageApiService.getPageData(option).pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.showLoader = false;
        this.carouselMasterData = this.prepareCarouselData(_.get(data, 'sections'));
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
    this.publicPlayerService.playExploreCourse(event.data.metaData.identifier);
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
        uri: this.router.url,
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
}
