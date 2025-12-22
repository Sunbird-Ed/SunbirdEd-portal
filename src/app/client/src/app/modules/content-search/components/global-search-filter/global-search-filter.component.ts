import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges, ViewChild
} from '@angular/core';
import * as _ from 'lodash-es';
import { ResourceService, UtilService, ConnectionService } from '@sunbird/shared';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, map, takeUntil, filter } from 'rxjs/operators';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';
import { UserService } from '@sunbird/core';
import { IFacetFilterFieldTemplateConfig } from '@project-sunbird/common-form-elements-full';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

@Component({
  selector: 'app-global-search-filter',
  templateUrl: './global-search-filter.component.html',
  styleUrls: ['./global-search-filter.component.scss']
})
export class GlobalSearchFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() facets;
  @Input() queryParamsToOmit;
  @Input() supportedFilterAttributes = [ 'se_boards', 'se_mediums', 'se_gradeLevels', 'se_subjects', 'primaryCategory', 'mediaType', 'additionalCategories', 'channel'];
  public filterLayout = LibraryFiltersLayout;
  public selectedMediaTypeIndex = 0;
  public selectedMediaType: string;
  public selectedFilters: any = {};
  public refresh = true;
  public isConnected = true;
  public filterChangeEvent = new Subject();
  private unsubscribe$ = new Subject<void>();
  public resetFilterInteractEdata: IInteractEventEdata;
  @Input() layoutConfiguration;
  @Input() isOpen;
  @Output() filterChange: EventEmitter<{ status: string, filters?: any }> = new EventEmitter();
  @Input() cachedFilters?: any;
  public frameworkCategoriesObject;
  public frameworkCategoriesList;
  public globalFilterCategories;

  @ViewChild('sbSearchFacetFilterComponent') searchFacetFilterComponent: any;

  filterFormTemplateConfig?: IFacetFilterFieldTemplateConfig[];

  constructor(public resourceService: ResourceService, public router: Router,
    private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef, private utilService: UtilService,
    public userService: UserService, private cacheService: CacheService, public connectionService: ConnectionService, public cslFrameworkService: CslFrameworkService) {
  }

  onChange(facet) {
    let channelData;
    if (this.selectedFilters.channel) {
      const channelIds = [];
      const facetsData = _.find(this.facets, { 'name': 'channel' });
      _.forEach(this.selectedFilters.channel, (value, index) => {
        channelData = _.find(facetsData.values, { 'identifier': value });
        if (!channelData) {
          channelData = _.find(facetsData.values, { 'name': value });
        }
        channelIds.push(channelData.name);
      });
      this.selectedFilters.channel = channelIds;
    }
    this.filterChangeEvent.next({ event: this.selectedFilters[facet.name], type: facet.name });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (_.get(changes, 'facets.currentValue.length')) {
      const updatedFacets = changes['facets'].currentValue;

      this.filterFormTemplateConfig = [...updatedFacets].sort((a, b) => {
        if (a.index && b.index) {
          return a.index.localeCompare(b.index);
        }
        if (a.index) {
          return 1;
        }
        return -1;
      }).map((f) => {
        if (f.name === 'mediaType') {
          f.values = f.mimeTypeList.map((m) => ({ name: m }));

          return {
            facet: f.name,
            type: 'pills',
            labelText: f.label || f.name,
            placeholderText: `${this.resourceService.frmelmnts.lbl.Select} ${f.label || f.name}`,
            multiple: true
          };
        }

        return {
          facet: f.name,
          type: 'dropdown',
          labelText: f.label || f.name,
          placeholderText: `${this.resourceService.frmelmnts.lbl.Select} ${f.label || f.name}`,
          multiple: true
        };
      });
      this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe((languageData) => {
        this.filterFormTemplateConfig.forEach((facet) => {
          facet['labelText'] = this.utilService.transposeTerms(facet['labelText'], facet['labelText'], this.resourceService.selectedLang);
          facet['placeholderText'] = this.utilService.transposeTerms(facet['placeholderText'], facet['placeholderText'], this.resourceService.selectedLang);
        });
      });
    }
  }

  ngOnInit() {
    this.frameworkCategoriesList = this.cslFrameworkService.getAllFwCatName();
    this.globalFilterCategories = this.cslFrameworkService.getAlternativeCodeForFilter();
    this.supportedFilterAttributes = [ ...this.globalFilterCategories, 'primaryCategory', 'mediaType', 'additionalCategories', 'channel'];
    this.setResetFilterInteractData();
    this.fetchSelectedFilterAndFilterOption();
    this.handleFilterChange();
    // screen size
    if (window.innerWidth <= 992) {
      this.isOpen = false;
    }
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  public resetFilters() {
    this.selectedFilters = _.pick(this.selectedFilters, ['key', 'selectedTab']);
    if (this.utilService.isDesktopApp) {
      const userPreferences: any = this.userService.anonymousUserPreference;
      if (userPreferences) {
        _.forEach([this.frameworkCategoriesList[0], this.frameworkCategoriesList[1], this.frameworkCategoriesList[2], 'channel'], (item) => {
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
      queryFilters = { ...queryFilters, ...this.selectedFilters };
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
          if ([...this.frameworkCategoriesList, ...this.globalFilterCategories, 'channel', 'primaryCategory', 'key', 'mediaType', 'additionalCategories'].includes(key)) {
            queryFilters[key] = key === 'key' || _.isArray(value) ? value : [value];
          }
        });
        if (_.get(queryParams, 'ignoreSavedFilter')) {
          queryFilters['ignoreSavedFilter'] = queryParams.ignoreSavedFilter;
        }
        if (queryParams.selectedTab) {
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
        if (_.get(filters, 'key') && _.get(filters, 'ignoreSavedFilter') !== 'true') {
          this.cacheService.remove('searchFiltersAll');
        }
        if (this.cacheService.exists('searchFiltersAll') && !_.get(filters, 'key') &&
          _.get(filters, 'ignoreSavedFilter') !== 'true') {
          this.selectedFilters = _.cloneDeep(this.cacheService.get('searchFiltersAll'));
        } else {
          if (_.get(filters, 'ignoreSavedFilter') === 'true') {

          } else {
            this.cacheService.remove('searchFiltersAll');
            this.selectedFilters = _.cloneDeep(filters);
          }
        }
        this.emitFilterChangeEvent(true);
        this.hardRefreshFilter();
      }, error => {
        console.error('fetching filter data failed', error);
      });
  }

  private handleFilterChange() {
    this.filterChangeEvent.pipe(
      filter(({ type, event }) => {
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
    if (this?.selectedFilters?.channel) {
      const channelIds = [];
      const facetsData = _.find(this.facets, { 'name': 'channel' });
      _.forEach(this.selectedFilters.channel, (value, index) => {
        const data = _.find(facetsData.values, { 'name': value });
        channelIds.push(data.identifier);
      });
      this.selectedFilters.channel = channelIds;
    }
    if(this?.utilService?.isDesktopApp && queryFilters?.selectedTab === 'mydownloads' && this.isConnected) {
      this.queryParamsToOmit = this.queryParamsToOmit && this.queryParamsToOmit.length ? this.queryParamsToOmit.push('key') : ['key']
      if (this.selectedFilters.key) {
        delete this.selectedFilters.key;
      }
    }
    if (this.queryParamsToOmit) {
      queryFilters = _.omit(_.get(this.activatedRoute, 'snapshot.queryParams'), this.queryParamsToOmit);
      queryFilters = { ...queryFilters, ...this.selectedFilters };
    }
    if (this.cacheService.get('searchFiltersAll')) {
      this.selectedFilters['selectedTab'] = 'all';
    }
    this.router.navigate([], {
      queryParams: this.queryParamsToOmit ? queryFilters : { ...queryFilters, ...this.selectedFilters },
      relativeTo: this.activatedRoute.parent
    });
  }

  private emitFilterChangeEvent(skipUrlUpdate = false) {
    this.updateTerms();
    this.filterChange.emit({ status: 'FETCHED', filters: this.selectedFilters });
    if (!skipUrlUpdate) {
      this.updateRoute();
    } else if (this.cacheService.get('searchFiltersAll') && !_.get(this.selectedFilters, 'key')) {
      this.updateRoute();
    } else if (_.get(this.selectedFilters, 'key')) {
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

  onSearchFacetFilterReset() {
    this.cacheService.remove('searchFiltersAll');
    /* istanbul ignore else */
    if (this.searchFacetFilterComponent) {
      this.searchFacetFilterComponent.resetFilter();
    }
    /* istanbul ignore next */
    this.router.navigate([], {
      queryParams: {
        ...(() => {
          const queryParams = _.cloneDeep(this.activatedRoute.snapshot.queryParams);
          const queryFilters = [...this.supportedFilterAttributes, ...[this.frameworkCategoriesList[0],this.frameworkCategoriesList[1],this.frameworkCategoriesList[2], 'channel']];
          queryFilters.forEach((attr) => delete queryParams[attr]);
          return queryParams;
        })()
      },
      relativeTo: this.activatedRoute.parent
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateTerms() {
    this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe((languageData) => {
      if (this.facets) {
        this.facets.forEach((facet) => {
          facet['label'] = this.utilService.transposeTerms(facet['label'], facet['label'], this.resourceService.selectedLang);
        });
      }
    });
  }
}
