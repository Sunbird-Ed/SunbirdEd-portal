import { combineLatest, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil, map, debounceTime, delay } from 'rxjs/operators';

import {
  ResourceService, ConfigService, ToasterService, INoResultMessage,
  ILoaderMessage, UtilService, NavigationHelperService
} from '@sunbird/shared';
import { PublicPlayerService } from '@sunbird/public';
import { Location } from '@angular/common';
import { SearchService, OrgDetailsService, FrameworkService } from '@sunbird/core';
import { ContentManagerService } from '../../services';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

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

  downloadedContents: any[] = [];
  downloadedContentsCount = 0;
  onlineContents = [];
  onlineContentsCount = 0;

  isContentNotAvailable = false;
  readonly MAX_CARDS_TO_SHOW: number = 10;


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
  ) {
    this.filterType = this.configService.appConfig.explore.filterType;

  }

  ngOnInit() {
    this.orgDetailsService.getOrgDetails(this.activatedRoute.snapshot.params.slug).subscribe((orgDetails: any) => {
      this.hashTagId = orgDetails.hashTagId;
      this.initFilters = true;
    }, error => {
      this.router.navigate(['']);
    });
  }

  public getFilters(filters) {
    this.facets = filters.map(element => element.code);
    this.dataDrivenFilters = filters;
    this.fetchContentOnParamChange();
    this.setNoResultMessage();
  }

  onFilterChange(event) {
    this.showLoader = true;
    this.dataDrivenFilters = _.cloneDeep(event.filters);
    this.fetchContents();
  }

  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
      .pipe(debounceTime(5),
        delay(10),
        map(result => ({ params: { pageNumber: Number(result[0].pageNumber) }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$)
      ).subscribe(({ params, queryParams }) => {
        this.showLoader = true;
        this.queryParams = { ...queryParams };
        this.fetchContents();
        this.setNoResultMessage();
      });
  }

  private fetchContents() {
    const onlineRequest = _.cloneDeep(this.constructSearchRequest());
    onlineRequest.params.online = true;

    const offlineRequest = _.cloneDeep(this.constructSearchRequest());
    offlineRequest.params.online = false;

    const { constantData, metaData, dynamicFields } = this.configService.appConfig.LibrarySearch;
    const getDataForCard = (contents) => this.utilService.getDataForCard(contents, constantData, dynamicFields, metaData);

    combineLatest(this.searchService.contentSearch(onlineRequest), this.searchService.contentSearch(offlineRequest))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ([onlineRes, offlineRes]: any) => {
          this.showLoader = false;

          this.downloadedContents = offlineRes.result.count ? _.chunk(getDataForCard(offlineRes.result.content),
            this.MAX_CARDS_TO_SHOW)[0] : [];
          this.downloadedContentsCount = offlineRes.result.count;
          this.downloadedContents = this.addHoverData(this.downloadedContents, false);

          this.onlineContents = onlineRes.result.count ? _.chunk(getDataForCard(onlineRes.result.content), this.MAX_CARDS_TO_SHOW)[0] : [];
          this.onlineContentsCount = onlineRes.result.count;
          this.onlineContents = this.addHoverData(this.onlineContents, true);


          this.isContentNotAvailable = Boolean(!this.downloadedContents.length && !this.onlineContents.length);
        }, err => {
          this.showLoader = false;
          this.onlineContents = [];
          this.downloadedContents = [];
          this.onlineContentsCount = 0;
          this.downloadedContentsCount = 0;
          this.toasterService.error(this.resourceService.messages.fmsg.m0051);
        });
  }

  constructSearchRequest() {
    let filters = _.pickBy(this.dataDrivenFilters, (value: Array<string> | string) => value && value.length);
    filters = _.omit(filters, ['key', 'sort_by', 'sortType', 'appliedFilters']);
    const softConstraintData: any = {
      filters: {
        channel: this.hashTagId
      },
      softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
      mode: 'soft'
    };
    if (this.dataDrivenFilters.board) {
      softConstraintData.board = this.dataDrivenFilters.board;
    }
    const manipulatedData = this.utilService.manipulateSoftConstraint(_.get(this.dataDrivenFilters, 'appliedFilters'),
      softConstraintData);
    const option: any = {
      filters: _.get(this.dataDrivenFilters, 'appliedFilters') ? filters : manipulatedData.filters,
      mode: _.get(manipulatedData, 'mode'),
      params: _.cloneDeep(this.configService.appConfig.ExplorePage.contentApiQueryParams),
      query: this.queryParams.key,
      facets: this.facets,
    };

    option.filters['contentType'] = filters.contentType || ['Collection', 'TextBook', 'LessonPlan', 'Resource'];
    if (manipulatedData.filters) {
      option['softConstraints'] = _.get(manipulatedData, 'softConstraints');
    }

    this.frameworkService.channelData$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((channelData) => {
        if (!channelData.err) {
          option.params.framework = _.get(channelData, 'channelData.defaultFramework');
        }
      });

    return option;
  }

  goBack() {
    this.location.back();
    this.utilService.clearSearchQuery();
  }

  gotoViewMore(isOnlineContents) {
    const queryParams = {
      key: this.queryParams.key,
      apiQuery: JSON.stringify(this.constructSearchRequest())
    };

    if (isOnlineContents) {
      this.router.navigate(['browse/view-more', 1], { queryParams });
    } else {
      this.router.navigate(['view-more'], { queryParams });
    }
  }

  setNoResultMessage() {
    this.noResultMessage = {
      messageText: 'messages.stmsg.m0006',
      message: 'frmelmnts.lbl.searchNotMatchCh',
    };
  }

  addHoverData(contentList, isOnlineSearch) {
    _.each(contentList, (value) => {
      value['hoverData'] = {
        'note': isOnlineSearch && _.get(value, 'downloadStatus') ===
          'DOWNLOADED' ? this.resourceService.frmelmnts.lbl.goToMyDownloads : '',
        'actions': [
          {
            'type': isOnlineSearch ? 'download' : 'save',
            'label': isOnlineSearch ? _.capitalize(_.get(value, 'downloadStatus')) ||
              this.resourceService.frmelmnts.btn.download :
              this.resourceService.frmelmnts.lbl.saveToPenDrive,
            'disabled': isOnlineSearch && _.includes(['DOWNLOADED', 'DOWNLOADING', 'PAUSED'], Boolean(_.get(value, 'downloadStatus')))
          },
          {
            'type': 'open',
            'label': this.resourceService.frmelmnts.lbl.open
          }
        ]
      };
    });

    return contentList;
  }

  clearSearchQuery() {
    this.utilService.clearSearchQuery();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
