import { combineLatest, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil, map, debounceTime, delay } from 'rxjs/operators';

import {
  ResourceService, ConfigService, ToasterService, INoResultMessage,
  ILoaderMessage, UtilService, PaginationService, NavigationHelperService
} from '@sunbird/shared';
import { PublicPlayerService } from '@sunbird/public';
import { Location } from '@angular/common';
import { SearchService, OrgDetailsService, FrameworkService } from '@sunbird/core';
import { IPagination } from '@sunbird/announcement';
import { ContentManagerService, ConnectionService } from '../../services';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.scss']
})
export class ViewMoreComponent implements OnInit {
  showLoader = true;
  noResultMessage: INoResultMessage;
  filterType: string;
  queryParams: any;
  unsubscribe$ = new Subject<void>();
  initFilters = false;
  loaderMessage: ILoaderMessage;
  showFilters = false;
  hashTagId: string;
  dataDrivenFilters: any = {};
  facets: string[];
  isViewAll = false;
  contentList = [];
  apiQuery: any = {};

  paginationDetails: IPagination;
  isConnected = false;
  isBrowse = false;
  showDownloadLoader = false;
  downloadedContents: any[] = [];

  backButtonInteractEdata: IInteractEventEdata;
  filterByButtonInteractEdata: IInteractEventEdata;
  telemetryImpression: IImpressionEventInput;
  constructor(
    public contentManagerService: ContentManagerService,
    public router: Router,
    public searchService: SearchService,
    public activatedRoute: ActivatedRoute,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public configService: ConfigService,
    public utilService: UtilService,
    private publicPlayerService: PublicPlayerService,
    public location: Location,
    public orgDetailsService: OrgDetailsService,
    public frameworkService: FrameworkService,
    public navigationHelperService: NavigationHelperService,
    public telemetryService: TelemetryService,
    public paginationService: PaginationService,
    private connectionService: ConnectionService,
  ) {
    this.filterType = this.configService.appConfig.explore.filterType;
  }

  ngOnInit() {
    this.isBrowse = Boolean(_.includes(this.router.url, 'browse'));
    this.orgDetailsService.getOrgDetails(this.activatedRoute.snapshot.params.slug).subscribe((orgDetails: any) => {
      this.hashTagId = orgDetails.hashTagId;
      this.initFilters = true;
    }, error => {
      this.router.navigate(['']);
    });

    this.connectionService.monitor()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isConnected => {
        this.isConnected = isConnected;
      });

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.queryParams = { ...queryParams };
      this.apiQuery = JSON.parse(this.queryParams.apiQuery);

      if (_.includes(this.router.url, 'view-all')) {
        this.isViewAll = true;
        this.fetchRecentlyAddedContent(false);
      } else {
        this.fetchContents(false);
        this.paginationDetails = this.paginationService.getPager(0, 1, this.configService.appConfig.SEARCH.PAGE_LIMIT);
      }
    });
  }

  public getFilters(filters) {
    this.facets = filters.map(element => element.code);
    this.dataDrivenFilters = filters;

    if (!this.isViewAll) {
      this.fetchContentOnParamChange();
    }
  }

  goBack() {
    this.location.back();

    if (this.isViewAll) {
      this.clearSearchQuery();
    }
  }

  clearSearchQuery() {
    this.utilService.clearSearchQuery();
  }

  fetchRecentlyAddedContent(addFilter) {
    const option = _.cloneDeep(this.apiQuery);
    if (addFilter && _.get(this.dataDrivenFilters, 'appliedFilters')) {
      option.filters = _.omit(this.dataDrivenFilters, ['appliedFilters']);
    }

    this.searchService.contentSearch(option)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        this.showLoader = false;
        const orderedContents = _.orderBy(_.get(response, 'result.content'), ['desktopAppMetadata.updatedOn'], ['desc']);
        this.contentList = this.formatSearchResults(orderedContents);
        this.contentList = this.utilService.addHoverData(this.contentList, this.isBrowse);
      }, error => {
        this.showLoader = false;
        this.setNoResultMessage();
      });
  }

  fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
      .pipe(debounceTime(5),
        delay(10),
        map(result => ({ params: { pageNumber: Number(result[0].pageNumber) }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$)
      ).subscribe(({ params, queryParams }) => {
        this.showLoader = true;

        if (this.paginationDetails && _.get(params, 'pageNumber') !== 1) {
          this.paginationDetails.currentPage = params.pageNumber;
          this.queryParams = { ...queryParams };
          this.fetchContents(false);
        }
      });
  }

  fetchContents(addFilter) {
    const option = _.cloneDeep(this.apiQuery);
    option.params.online = Boolean(this.isBrowse);

    if (this.isBrowse) {
      option.limit = this.configService.appConfig.SEARCH.PAGE_LIMIT;
      option.pageNumber = _.get(this.paginationDetails, 'currentPage');
    }

    if (addFilter && _.get(this.dataDrivenFilters, 'appliedFilters')) {
      option.filters = _.omit(this.dataDrivenFilters, ['appliedFilters']);
    }

    this.searchService.contentSearch(option)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.showLoader = false;
        if (this.isBrowse) {
          this.paginationDetails = this.paginationService.getPager(data.result.count, this.paginationDetails.currentPage,
            this.configService.appConfig.SEARCH.PAGE_LIMIT);
        }
        const { constantData, metaData, dynamicFields } = this.configService.appConfig.LibrarySearch;
        this.contentList = this.utilService.getDataForCard(data.result.content, constantData, dynamicFields, metaData);
        this.contentList = this.utilService.addHoverData(this.contentList, this.isBrowse);
      }, err => {
        this.showLoader = false;
        this.contentList = [];

        if (this.isBrowse) {
          this.paginationDetails = this.paginationService.getPager(0, this.paginationDetails.currentPage,
            this.configService.appConfig.SEARCH.PAGE_LIMIT);
        }
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      });
  }

  onFilterChange(event) {
    this.showLoader = true;
    this.dataDrivenFilters = _.cloneDeep(event.filters);

    if (this.isViewAll) {
      this.fetchRecentlyAddedContent(true);
    } else {
      this.fetchContents(true);
    }
  }


  updateCardData(downloadListdata) {
    _.each(this.contentList, (contents) => {
      this.publicPlayerService.updateDownloadStatus(downloadListdata, contents);
    });
    this.contentList = this.utilService.addHoverData(this.contentList, this.isBrowse);
  }

  public navigateToPage(page: number): void {
    if (page < 1 || page > this.paginationDetails.totalPages) {
      return;
    }
    const url = _.replace(_.split(this.router.url, '?')[0], /[^\/]+$/, page.toString());
    this.router.navigate([url], { queryParams: this.queryParams });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  formatSearchResults(list) {
    const { constantData, metaData, dynamicFields } = this.configService.appConfig.ViewAll;
    _.forEach(list, (value, index) => {
      list[index] = this.utilService.processContent(list[index],
        constantData, dynamicFields, metaData);
    });

    return list;
  }

  setNoResultMessage() {
    if (!(this.router.url.includes('/browse'))) {
      this.noResultMessage = {
        'message': 'messages.stmsg.m0007',
        'messageText': 'messages.stmsg.m0133'
      };
    } else {
      this.noResultMessage = {
        'message': 'messages.stmsg.m0007',
        'messageText': 'messages.stmsg.m0006'
      };
    }
  }
}
