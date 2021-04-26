import { Component, Output, EventEmitter, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash-es';
import { ResourceService, UtilService } from '@sunbird/shared';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, map, takeUntil, filter } from 'rxjs/operators';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption-v8';
import { UserService } from '@sunbird/core';
@Component({
  selector: 'app-global-search-filter',
  templateUrl: './global-search-filter.component.html',
  styleUrls: ['./global-search-filter.component.scss']
})
export class GlobalSearchFilterComponent implements OnInit, OnDestroy {
  @Input() facets;
  @Input() queryParamsToOmit;
  public filterLayout = LibraryFiltersLayout;
  public selectedMediaTypeIndex = 0;
  public selectedMediaType: string;
  public selectedFilters: any = {};
  public refresh = true;
  public filterChangeEvent = new Subject();
  private unsubscribe$ = new Subject<void>();
  public resetFilterInteractEdata: IInteractEventEdata;
  @Input() layoutConfiguration;
  @Input() isOpen;
  @Output() filterChange: EventEmitter<{ status: string, filters?: any }> = new EventEmitter();
  constructor(public resourceService: ResourceService, public router: Router,
    private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef, private utilService: UtilService,
    public userService: UserService) {
  }

  onChange(facet) {
    let channelData;
    if (this.selectedFilters.channel) {
      const channelIds = [];
      const facetsData = _.find(this.facets, {'name': 'channel'});
      _.forEach(this.selectedFilters.channel, (value, index) => {
        channelData = _.find(facetsData.values, {'identifier': value});
        if (!channelData) {
          channelData = _.find(facetsData.values, {'name': value});
        }
        channelIds.push(channelData.name);
      });
      this.selectedFilters.channel = channelIds;
    }
    this.filterChangeEvent.next({event: this.selectedFilters[facet.name], type: facet.name});
  }

  ngOnInit() {
    this.setResetFilterInteractData();
    this.fetchSelectedFilterAndFilterOption();
    this.handleFilterChange();
        // screen size
        if (window.innerWidth <= 992 ) {
          this.isOpen = false;
        }
  }

  public resetFilters() {
    this.selectedFilters = _.pick(this.selectedFilters, ['key', 'selectedTab']);
    if (this.utilService.isDesktopApp) {
      const userPreferences: any = this.userService.anonymousUserPreference;
      if (userPreferences) {
        _.forEach(['board', 'medium', 'gradeLevel'], (item) => {
          if (!_.has(this.selectedFilters, item)) {
            this.selectedFilters[item] = _.isArray(userPreferences.framework[item]) ?
            userPreferences.framework[item] : _.split(userPreferences.framework[item], ', ');
          }
        });
      }
    }
    let queryFilters = _.get(this.activatedRoute, 'snapshot.queryParams');
    let redirectUrl; // if pageNumber exist then go to first page every time when filter changes, else go exact path
    if (_.get(this.activatedRoute, 'snapshot.params.pageNumber')) { // when using dataDriven filter should this should be verified
      redirectUrl = this.router.url.split('?')[0].replace(/[^\/]+$/, '1');
    } else {
      redirectUrl = this.router.url.split('?')[0];
    }
    if (this.queryParamsToOmit) {
      queryFilters = _.omit(_.get(this.activatedRoute, 'snapshot.queryParams'), this.queryParamsToOmit);
      queryFilters = {...queryFilters, ...this.selectedFilters};
    }
    redirectUrl = decodeURI(redirectUrl);
    this.router.navigate([redirectUrl], {
      relativeTo: this.activatedRoute.parent, queryParams: this.queryParamsToOmit ? queryFilters : this.selectedFilters
    });
    this.hardRefreshFilter();
  }

  private fetchSelectedFilterAndFilterOption() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe$),
      map((queryParams) => {
        const queryFilters: any = {};
        _.forIn(queryParams, (value, key) => {
          if (['medium', 'gradeLevel', 'board', 'channel', 'subject', 'primaryCategory', 'key', 'mediaType'].includes(key)) {
            queryFilters[key] = key === 'key' || _.isArray(value) ? value : [value];
          }
        });
        if (queryParams.selectedTab){
          queryFilters['selectedTab'] = queryParams.selectedTab;
        }
        if (queryParams.mediaType) {
          this.selectedMediaType = _.isArray(queryParams.mediaType) ? queryParams.mediaType[0] : queryParams.mediaType;
        } else {
          this.selectedMediaType = '';
          this.selectedMediaTypeIndex = 0;
        }
        return queryFilters;
      })).subscribe(filters => {
        this.selectedFilters = _.cloneDeep(filters);
        this.emitFilterChangeEvent(true);
        this.hardRefreshFilter();
      }, error => {
        console.error('fetching filter data failed', error);
      });
  }

  private handleFilterChange() {
    this.filterChangeEvent.pipe(
      filter(({type, event}) => {
        if (type === 'mediaType' && this.selectedMediaTypeIndex !== event.data.index) {
          this.selectedMediaTypeIndex = event.data.index;
        }
        return true;
      }),
      debounceTime(1000)).subscribe(({ type, event }) => {
      this.emitFilterChangeEvent();
    });
  }

  public updateRoute() {
    let queryFilters = _.get(this.activatedRoute, 'snapshot.queryParams');
    if (this.selectedFilters.channel) {
      const channelIds = [];
      const facetsData = _.find(this.facets, {'name': 'channel'});
      _.forEach(this.selectedFilters.channel, (value, index) => {
        const data = _.find(facetsData.values, {'name': value});
        channelIds.push(data.identifier);
      });
      this.selectedFilters.channel = channelIds;
    }
    if (this.queryParamsToOmit) {
      queryFilters = _.omit(_.get(this.activatedRoute, 'snapshot.queryParams'), this.queryParamsToOmit);
      queryFilters = {...queryFilters, ...this.selectedFilters};
    }
    this.router.navigate([], {
      queryParams: this.queryParamsToOmit ? queryFilters : this.selectedFilters,
      relativeTo: this.activatedRoute.parent
    });
  }

  private emitFilterChangeEvent(skipUrlUpdate = false) {
    this.filterChange.emit({ status: 'FETCHED', filters: this.selectedFilters });
    if (!skipUrlUpdate) {
      this.updateRoute();
    }
  }

  private hardRefreshFilter() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  private setResetFilterInteractData() {
    setTimeout(() => { // wait for model to change
      this.resetFilterInteractEdata = {
        id: 'reset-filter',
        type: 'click',
        pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
        extra: { filters: this.selectedFilters }
      };
    }, 5);
  }

  removeFilterSelection(data) {
    _.map(this.selectedFilters, (value, key) => {
      if (this.selectedFilters[data.type] && !_.isEmpty(this.selectedFilters[data.type])) {
        _.remove(value, (n) => {
          return n === data.value && data.type === key;
        });
      }
      if (_.isEmpty(value)) { delete this.selectedFilters[key]; }
    });
    this.filterChange.emit({ status: 'FETCHED', filters: this.selectedFilters });
    this.updateRoute();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
