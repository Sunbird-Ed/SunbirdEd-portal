import { combineLatest, Subject } from 'rxjs';
import { PageApiService, OrgDetailsService, UserService } from '@sunbird/core';
import { PublicPlayerService } from './../../../../services';
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import {
  ResourceService, ToasterService, INoResultMessage, ConfigService, UtilService, ICaraouselData, BrowserCacheTtlService
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, filter } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
@Component({
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit, OnDestroy {

  public showLoader = true;
  public noResult = false;
  public showLoginModal = false;
  public baseUrl: string;
  public noResultMessage: INoResultMessage;
  public carouselData: Array<ICaraouselData> = [];
  public filterType: string;
  public queryParams: any;
  public hashTagId: string;
  public unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  public inViewLogs = [];
  public sortIntractEdata: IInteractEventEdata;
  public prominentFilters: any = {};
  public dataDrivenFilter = new EventEmitter();

  constructor(private pageApiService: PageApiService, private toasterService: ToasterService,
    public resourceService: ResourceService, private configService: ConfigService, private activatedRoute: ActivatedRoute,
    public router: Router, private utilService: UtilService, private orgDetailsService: OrgDetailsService,
    private publicPlayerService: PublicPlayerService, private cacheService: CacheService,
    private browserCacheTtlService: BrowserCacheTtlService, private userService: UserService) {
    this.router.onSameUrlNavigation = 'reload';
    this.filterType = this.configService.appConfig.explore.filterType;
    this.setTelemetryData();
  }

  ngOnInit() {
    this.orgDetailsService.getOrgDetails(this.activatedRoute.snapshot.params.slug).pipe(
      mergeMap((orgDetails: any) => {
        this.hashTagId = orgDetails.hashTagId;
        return this.dataDrivenFilter;
      }), first()
    ).subscribe((filters: any) => {
        this.prominentFilters = filters;
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
    this.dataDrivenFilter.emit(defaultFilters);
  }
  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
    .pipe(map((result) => ({params: result[0], queryParams: result[1]})),
        filter(({queryParams}) => !_.isEqual(this.queryParams, queryParams)), // fetch data if queryParams changed
        takeUntil(this.unsubscribe$))
      .subscribe(({params, queryParams}) => {
        this.showLoader = true;
        this.noResult = false;
        this.queryParams = { ...queryParams };
        this.carouselData = [];
        this.fetchPageData();
      }, err => {
        this.showLoader = false;
        this.noResult = true;
        this.carouselData = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
    });
  }
  private fetchPageData() {
    const filters = _.pickBy(this.queryParams, (value: Array<string> | string) => value.length);
    filters.channel = this.hashTagId;
    filters.board = _.get(this.queryParams, 'board') || this.prominentFilters.board;
    const option = {
      source: 'web',
      name: 'Explore',
      filters: filters,
      softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 },
      mode: 'soft',
      exists: [],
      params : this.configService.appConfig.ExplorePage.contentApiQueryParams
    };
    this.pageApiService.getPageData(option)
      .subscribe(data => {
        this.showLoader = false;
        this.carouselData = this.prepareCarouselData(_.get(data, 'sections'));
        if (this.carouselData.length) {
          this.noResult = false;
        } else {
          this.noResult = true;
        }
      }, err => {
        this.showLoader = false;
        this.noResult = true;
        this.carouselData = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
    });
  }
  private prepareCarouselData(sections = []) {
    const carouselData = _.reduce(sections, (collector, element) => {
      const contents = _.get(element, 'contents') || [];
      const { constantData, metaData, dynamicFields } = this.configService.appConfig.ExplorePage;
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
    if (!this.userService.loggedIn && event.data.contentType === 'Course') {
      this.showLoginModal = true;
      this.baseUrl = '/' + 'learn' + '/' + 'course' + '/' + event.data.metaData.identifier;
    } else {
      this.publicPlayerService.playContent(event);
    }
  }
  public viewAll(event) {
    const searchQuery = JSON.parse(event.searchQuery);
    searchQuery.request.filters.defaultSortBy = JSON.stringify(searchQuery.request.sort_by);
    searchQuery.request.filters.channel = this.hashTagId;
    searchQuery.request.filters.board = this.prominentFilters.board;
    this.cacheService.set('viewAllQuery', searchQuery.request.filters, { maxAge: this.browserCacheTtlService.browserCacheTtl });
    const queryParams = { ...searchQuery.request.filters, ...this.queryParams};
    const sectionUrl = this.router.url.split('?')[0] + '/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], {queryParams: queryParams});
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
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype
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
      'message': _.get(this.resourceService, 'messages.stmsg.m0007') || 'No results found',
      'messageText': _.get(this.resourceService, 'messages.stmsg.m0006') || 'Please search for something else.'
    };
  }
}
