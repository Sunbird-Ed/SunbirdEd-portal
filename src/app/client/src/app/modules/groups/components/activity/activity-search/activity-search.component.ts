import { Component, OnInit } from '@angular/core';
import { FrameworkService, SearchService } from '@sunbird/core';
import { ConfigService, ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-activity-search',
  templateUrl: './activity-search.component.html',
  styleUrls: ['./activity-search.component.scss']
})
export class ActivitySearchComponent implements OnInit {
  showFilters = false;
  searchResultCount = 0;
  searchQuery: string;
  showLoader = true;
  numberOfSections = new Array(this.configService.appConfig.SEARCH.PAGE_LIMIT);
  queryParams: any;
  unsubscribe$ = new Subject<void>();
  frameworkId: string;
  contentList: any[] = [];
  constructor(
    public resourceService: ResourceService,
    public configService: ConfigService,
    private frameworkService: FrameworkService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.getFrameworkId();
    this.fetchContents();
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

  private fetchContents() {
    const filters: any = {};
    filters.contentType = filters.contentType || this.configService.appConfig.CommonSearch.contentType;
    const option: any = {
      filters,
      fields: this.configService.urlConFig.params.LibrarySearchField,
      limit: this.configService.appConfig.SEARCH.PAGE_LIMIT,
      mode: 'soft',
      params: this.configService.appConfig.ExplorePage.contentApiQueryParams || {}
    };

    /* istanbul ignore else */
    if (this.frameworkId) {
      option.params.framework = this.frameworkId;
    }
    this.searchService.contentSearch(option)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.showLoader = false;
        this.contentList = _.get(data, 'result.content');
      }, err => {
        this.showLoader = false;
        this.contentList = [];
      });
  }

  toggleFilter() {
    this.showFilters = !this.showFilters;
    // TOTO add interact telemetry here
  }

}
