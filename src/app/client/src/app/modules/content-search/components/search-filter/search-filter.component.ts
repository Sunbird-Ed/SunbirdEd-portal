import { Component, Output, EventEmitter, Input, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';
import { ResourceService, LayoutService, UtilService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, merge, of, zip, BehaviorSubject, defer } from 'rxjs';
import { debounceTime, map, tap, switchMap, takeUntil, retry, catchError } from 'rxjs/operators';
import { ContentSearchService } from '../../services';
import { FormService } from '@sunbird/core';
import { IFrameworkCategoryFilterFieldTemplateConfig } from '@project-sunbird/common-form-elements-full';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { CslFrameworkService } from  '../../../public/services/csl-framework/csl-framework.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  public filterLayout = LibraryFiltersLayout;
  public refresh = true;
  private unsubscribe$ = new Subject<void>();
  private boardChange$ = new Subject<void>();
  public emptyBoard = false;
  private filters;
  private queryFilters: any = {};
  public optionData: any[] = [];
  public selectedBoard: { label: string, value: string, selectedOption: string };
  public selectedOption: { label: string, value: string, selectedOption: string };
  public optionLabel = {
    Publisher: _.get(this.resourceService, 'frmelmnts.lbl.publisher'), Board: _.get(this.resourceService, 'frmelmnts.lbl.board')
  };
  public fwCategory1: any[] = [];
  filterChangeEvent = new Subject();
  @Input() isOpen;
  @Input() defaultFilters = {};
  @Input() pageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
  @Output() filterChange: EventEmitter<{ status: string, filters?: any }> = new EventEmitter();
  @Input() layoutConfiguration;
  @Input() pageData;
  @Input() facets$ = new BehaviorSubject({});
  @Input() defaultTab = {};
  @Input() filterResponseData;
  @Input() userSelectedPreference;
  selectedFilters = {};
  allValues = {};
  selectedNgModels = {};
  private audienceList;
  public refreshSearchFilterComponent = true;
  public frameworkCategories;
  public frameworkCategoriesObject;

  @ViewChild('sbSearchFrameworkFilterComponent') searchFrameworkFilterComponent: any;
  filterFormTemplateConfig: IFrameworkCategoryFilterFieldTemplateConfig[];
  private _filterConfig$: any;
  constructor(public resourceService: ResourceService, private router: Router,
    private contentSearchService: ContentSearchService,
    private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef,
    public layoutService: LayoutService, private formService: FormService,
    private cacheService: CacheService, private utilService: UtilService, private cslFrameworkService: CslFrameworkService ) { }

  get filterData() {
    return _.get(this.pageData, 'metaData.filters') || [ this.frameworkCategories?.fwCategory1?.code,this.frameworkCategories?.fwCategory2?.code,this.frameworkCategories?.fwCategory3?.code,this.frameworkCategories?.fwCategory4?.code, 'channel', 'audience', 'publisher', 'se_subjects', 'se_boards', 'se_gradeLevels', 'se_mediums'];
  }

  public getChannelId(index) {
    const { publisher: publishers = [] } = this.filters || {};
    return _.get(publishers[index], 'value');
  }

  private fetchAndFormatQueryParams() {
    return this.activatedRoute.queryParams
      .pipe(
        map(
          queryParams => {
            const queryFilters: Record<string, string[]> = {};
            _.forIn(queryParams, (value, key) => {
              if (this.filterData.includes(key)) {
                queryFilters[key] = _.isArray(value) ? value : [value];
              }
            });
            this.queryFilters = _.cloneDeep(queryFilters);
            return queryFilters;
          }
        )
      );
  }

  private checkForWindowSize() {
    if (window.innerWidth <= 992) {
      this.isOpen = false;
    }
  }

  private getFramework({ boardName = null }) {
    return this.contentSearchService.fetchFilter(boardName);
  }

  private sortFilters({ filters, filterBy = 'name', omitKeys = [this.frameworkCategories?.fwCategory3?.code] }) {
    const sortedFilters = _.cloneDeep(filters);
    _.forEach(sortedFilters, (values, key) => {
      sortedFilters[key] = _.includes(omitKeys, key) ? values : _.sortBy(values, [filterBy]);
    });
    return sortedFilters;
  }

  private fetchFilters() {
    return this.fetchAndFormatQueryParams()
      .pipe(
        switchMap(queryParams => {
          this.filterChange.emit({ status: 'FETCHING' });
          let boardName = _.get(queryParams, `${this.frameworkCategories?.fwCategory1?.code}[0]`) || _.get(this.fwCategory1, '[0]');
          return zip(this.getFramework({ boardName }), this.getAudienceTypeFormConfig())
            .pipe(map(([filters, audienceTypeFilter]: [object, object]) => ({ ...filters, audience: audienceTypeFilter })));
        })
      );
  }

  ngOnInit() {
    this.frameworkCategories = this.cslFrameworkService.getFrameworkCategories();
    this.getFilterForm$();
    this.checkForWindowSize();
    merge(this.boardChangeHandler(), this.fetchSelectedFilterOptions(), this.handleFilterChange(), this.getFacets(), this.filterConfig$)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(null, error => {
        console.error('Error while fetching filters', error);
      });

    // Checking the fix for #ED-2455
    // if (!_.get(this.activatedRoute, 'snapshot.queryParams["board"]')) {
    //   const queryParams = { ...this.defaultFilters, selectedTab: _.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || _.get(this.defaultTab, 'contentType') || 'textbook' };
    //   this.router.navigate([], { queryParams, relativeTo: this.activatedRoute });
    // }
  }

  /**
  * @description - Method for old layout, triggered when the selected board changed in the old layout
  */
  private boardChangeHandler() {
    return this.boardChange$.pipe(
      switchMap(boardName => {
        return this.getFramework({ boardName })
          .pipe(
            tap(filters => {
              this.filters = { ...this.filters, ...this.sortFilters({ filters }) };
              this.updateRoute();
            })
          );
      })
    );
  }

  private fetchSelectedFilterOptions() {
    return this.fetchFilters()
      .pipe(
        tap(filters => {
          filters = _.pick(filters || {}, this.filterData);
          this.filters = filters = this.sortFilters({ filters });
          this.updateBoardList();
          this.updateFiltersList({ filters: _.omit(filters, this.frameworkCategories?.fwCategory1?.code) });
          this.emitFilterChangeEvent(true);
          this.hardRefreshFilter();
        })
      );
  }

  private handleFilterChange() {
    return this.filterChangeEvent
      .pipe(
        debounceTime(1000),
        tap(({ type, event }) => {
          if (_.has(event, 'data.index')) {
            const index = _.get(event, 'data.index');
            const selectedIndices = _.get(this.selectedFilters, type) || [];
            if (_.includes(selectedIndices, index)) {
              if (_.get(selectedIndices, 'length') > 1) {
                this.popFilter({ type, index });
              }
            } else {
              this.pushNewFilter({ type, index });
            }
          } else {
            if (type === this.frameworkCategories?.fwCategory4?.code) {
              this.selectedNgModels['selected_subjects'] = event;
            }
            this.pushNewFilter({
              type, updatedValues: _.map(event || [],
                selectedValue => _.findIndex(this.allValues[type], val => val === selectedValue))
            });
          }
          this.emitFilterChangeEvent();
        }));
  }

  private updateBoardList() {
    if (_.get(this.filters, this.frameworkCategories?.fwCategory1?.code) || !_.get(this.filters, `${this.frameworkCategories?.fwCategory1?.code}.length`)) {
      this.emptyBoard = true;
    }
    this.fwCategory1 = this.allValues[this.frameworkCategories?.fwCategory1?.code] = this.filters[this.frameworkCategories?.fwCategory1?.code] || [];
    this.fwCategory1 = _.map(this.fwCategory1, node => ({
      name: node.name,
      value: node.name,
    }));
    this.optionData.push({
      label: this.frameworkCategories?.fwCategory1?.label,
      value: this.frameworkCategories?.fwCategory1?.code,
      option: this.fwCategory1
    });
    this.optionData = _.uniqBy(this.optionData, 'label');
    if (this.fwCategory1.length) {
      const selectedOption = _.find(this.fwCategory1, { name: _.get(this.queryFilters, `${this.frameworkCategories?.fwCategory1?.code}[0]`) }) ||
        _.find(this.fwCategory1, { name: _.get(this.defaultFilters, `${this.frameworkCategories?.fwCategory1?.code}[0]`) }) || this.fwCategory1[0];
      this.selectedBoard = { label: this.frameworkCategories?.fwCategory1?.label, value: this.frameworkCategories?.fwCategory1?.code, selectedOption: _.get(selectedOption, 'name') };
      this.selectedOption = this.selectedBoard;
    }
  }

  private popFilter({ type, index }) {
    const selectedIndices = _.get(this.selectedFilters, type) || [];
    _.remove(selectedIndices, (currentIndex) => {
      return currentIndex === index;
    });
  }

  private pushNewFilter({ type, index = null, updatedValues = [] }) {
    if (index != null) {
      this.selectedFilters[type] = [index, ...(this.selectedFilters.hasOwnProperty(type) ? this.selectedFilters[type] : [])];
    } else {
      this.selectedFilters[type] = updatedValues;
    }
  }
  private getIndicesFromDefaultFilters({ type }) {
    const defaultValues = _.get(this.defaultFilters, type) || [];
    let indices = [];
    if (_.get(defaultValues, 'length')) {
      indices = _.filter(_.map(defaultValues, defaultValue => _.findIndex(this.allValues[type] || [],
        val => val === defaultValue)), index => index !== -1);
    }
    if (['audience', 'publisher', this.frameworkCategories?.fwCategory4?.code].includes(type) && !indices.length) {
      return [];
    }
    return indices.length ? indices : [];
  }

  /**
   *@description - This method is used to update the filters list  
   * @param  {{filters:Record<string,any[]>} {filter}- The filter list that need to be updated 
   */
  private updateFiltersList({ filters }: { filters: Record<string, any[]> }) {
    this.selectedFilters = {};
    this.selectedNgModels = {};
    this.allValues = {};
    _.forEach(filters, (filterValues: { name: any }[], filterKey: string) => {
     const values = this.allValues[filterKey] = _.map(filterValues, 'name');
      if (_.get(values, 'length')) {
        let selectedIndices;
        const filterValuesFromQueryParams = this.queryFilters[filterKey] || [];
        if (_.get(filterValuesFromQueryParams, 'length')) {
          const indices = _.filter(_.map(filterValuesFromQueryParams, queryParamValue => values.findIndex((val) =>
            _.toLower(val) === _.toLower(queryParamValue))), index => index !== -1);
          selectedIndices = _.get(indices, 'length') ? indices : this.getIndicesFromDefaultFilters({ type: filterKey });
        } else {
          selectedIndices = this.getIndicesFromDefaultFilters({ type: filterKey });
        }
        this.selectedFilters[filterKey] = selectedIndices;
        this.selectedNgModels[filterKey] = _.map(selectedIndices, index => this.allValues[filterKey][index]);
        if (filterKey === this.frameworkCategories?.fwCategory4?.code) {
          this.selectedNgModels['selected_subjects'] = filterValuesFromQueryParams;
        }
      }
    });
  }
  private updateRoute(resetFilters?: boolean) {
    const selectedTab = _.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || _.get(this.defaultTab, 'contentType') || 'textbook';
    this.router.navigate([], {
      queryParams: resetFilters ? { ...this.defaultFilters, selectedTab } : _.omit(this.getSelectedFilter() || {}, ['audienceSearchFilterValue']),
      relativeTo: this.activatedRoute.parent
    });
  }

  /**
   * @description - Method which gets triggered when selected value changes in old layout
   * @param  {} data event object that gets passed when selected value is changed in old layout
   */
  selectedGroupOption(data) {
    this.selectedOption = data;
    this.selectedBoard = data;
    this.filterChange.emit({ status: 'FETCHING' });
    this.boardChange$.next(_.get(data, 'selectedOption'));
  }
  private getSelectedFilter() {
    const filters = _.mapValues(this.selectedFilters, (value, key) => {
      return _.compact(_.map(value, index => _.has(this.allValues, [key, index]) ? this.allValues[key][index] : null));
    });
    if (_.has(this.selectedFilters, 'publisher')) {
      filters['channel'] = _.compact(_.map(this.selectedFilters['publisher'], publisher => this.getChannelId(publisher)));
    }
    if (_.has(this.selectedNgModels, 'selected_subjects')) {
      filters[this.frameworkCategories?.fwCategory4?.code] = this.selectedNgModels['selected_subjects'] || [];
    }
    if (_.has(this.selectedFilters, 'audience')) {
      filters['audienceSearchFilterValue'] = _.flatten(_.compact(_.map(filters['audience'] || {}, audienceType => {
        const audience = _.find(this.audienceList || {}, { 'name': audienceType });
        return audience ? _.get(audience, 'searchFilter') : null;
      })));
    }
    filters[this.frameworkCategories?.fwCategory1?.code] = _.get(this.selectedBoard, 'selectedOption') ? [this.selectedBoard.selectedOption] : [];
    filters['selectedTab'] = _.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || _.get(this.defaultTab, 'contentType') || 'textbook';
    return filters;
  }
  private emitFilterChangeEvent(skipUrlUpdate = false) {
    const filters = this.getSelectedFilter();
    this.filterChange.emit({ status: 'FETCHED', filters });
    if (!skipUrlUpdate) {
      this.updateRoute();
    }
  }

  /**
   *@description -  Method that gets called when any user interaction happens on the page. Used for telemetry purpose
   */
  public getInteractEdata() {
    return {
      id: 'reset-filter',
      type: 'click',
      pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
      extra: {
        filters: this.getSelectedFilter() || {}
      }
    };
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private hardRefreshFilter() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
  isLayoutAvailable() {
    return this.layoutService.isLayoutAvailable(this.layoutConfiguration);
  }
  public resetFilters() {
    this.updateRoute(true);
  }

  onSearchFrameworkFilterReset() {
    if (this.cacheService.exists('searchFilters')) {
      this.cacheService.remove('searchFilters');
    }
    if (this.searchFrameworkFilterComponent) {
      const selectedTab = _.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || _.get(this.defaultTab, 'contentType') || 'textbook';
      this.router.navigate([], {
        queryParams: { ...this.userSelectedPreference, selectedTab },
        relativeTo: this.activatedRoute.parent
      });
    }
  }

  private getAudienceTypeFormConfig() {
    const formServiceInputParams = { formType: 'config', formAction: 'get', contentType: 'userType', component: 'portal' };
    return this.formService.getFormConfig(formServiceInputParams).pipe(
      map(response => _.map(_.filter(response, 'visibility'), value => {
        const { name, searchFilter } = value;
        return { name: name, searchFilter };
      })),
      tap(mapping => { this.audienceList = mapping; }),
      retry(5),
      catchError(err => of([]))
    );
  }

  /**
   * @description - Method to fetch facets passed from parent component. Subjects from facets are overridden here
   */
  private getFacets() {
    return this.facets$.pipe(tap(filters => {
      filters = this.filters = { ...this.filters, ...this.sortFilters({ filters }) };
      const categoryMapping = Object.entries(this.contentSearchService.getCategoriesMapping);
      filters = _.mapKeys(filters, (value, filterKey) => {
        const [key = null] = categoryMapping.find(([category, mappedValue]) => mappedValue === filterKey) || [];
        return key || filterKey;
      });
      this.updateFiltersList({ filters });
      this.hardRefreshFilter();
    }));
  }

  /**
   * @description - Method to get the formconfig for filters. Language translation for labels also takes place here
   */
  get filterConfig$() {
    return this.resourceService.languageSelected$.pipe(
      switchMap(_ => this._filterConfig$),
      tap((config: IFrameworkCategoryFilterFieldTemplateConfig[]) => {
        this.filterFormTemplateConfig = config;
        this.resourceService.languageSelected$.pipe(takeUntil(this.unsubscribe$)).subscribe((languageData) => {
          this.filterFormTemplateConfig?.forEach((facet) => {
            facet['labelText'] = this.utilService.transposeTerms(facet['labelText'], facet['labelText'], this.resourceService.selectedLang);
            facet['placeholderText'] = this.utilService.transposeTerms(facet['placeholderText'], facet['placeholderText'], this.resourceService.selectedLang);
          });
        });
        this.refreshSearchFilterComponent = false;
        this.cdr.detectChanges();
        this.refreshSearchFilterComponent = true;
      }))
  }

  /**
   * @description - Method to transform the input formconfig to pass it as config to the search filter plugin
   */
  private getFilterForm$() {
    if (this.filterResponseData) {
      this._filterConfig$ = defer(() => of(
        this.filterResponseData.map((value) => {
          return {
            category: _.get(value, 'category'),
            type: _.get(value, 'type'),
            labelText: _.get(this.resourceService, value.labelText) ? _.get(this.resourceService, value.labelText) : _.get(value, 'defaultLabelText'),
            placeholderText: _.get(this.resourceService, value.placeholderText) ? _.get(this.resourceService, value.placeholderText) : _.get(value, 'defaultPlaceholderText'),
            multiple: _.get(value, 'multiple'),
          }
        }
        )));
    }
    return this._filterConfig$;
  }
}
