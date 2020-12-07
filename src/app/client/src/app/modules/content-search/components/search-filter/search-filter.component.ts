import { Component, Output, EventEmitter, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash-es';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';
import { ResourceService, LayoutService, ConfigService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, merge } from 'rxjs';
import { debounceTime, map, tap, switchMap, takeUntil } from 'rxjs/operators';
import { ContentSearchService } from '../../services';

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
  public optionLabel = { Publisher: this.resourceService.RESOURCE_CONSUMPTION_ROOT +
    'frmelmnts.lbl.publisher', Board: this.resourceService.RESOURCE_CONSUMPTION_ROOT + 'frmelmnts.lbl.boards' };
  public boards: any[] = [];
  filterChangeEvent = new Subject();
  @Input() isOpen;
  @Input() defaultFilters = {};
  @Input() pageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
  @Output() filterChange: EventEmitter<{ status: string, filters?: any }> = new EventEmitter();
  @Input() layoutConfiguration;
  @Input() pageData;
  selectedFilters = {};
  allValues = {};
  selectedNgModels = {};

  constructor(public resourceService: ResourceService, private router: Router,
     private contentSearchService: ContentSearchService,
    private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef,
     public layoutService: LayoutService, private configService: ConfigService) {
  }

  get audienceTypeMapping() {
    return _.get(this.configService, 'appConfig.userTypeMapping') || {};
  }
  get audienceList() {
    return _.map(this.audienceTypeMapping, (value, key) => ({ name: key }));
  }
  get filterData() {
    return _.get(this.pageData, 'search.facets') || ['medium', 'gradeLevel', 'board', 'channel', 'subject', 'audience', 'publisher'];
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
  private sortFilters({ filters, filterBy = 'name', omitKeys = ['gradeLevel'] }) {
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
          const boardName = _.get(queryParams, 'board[0]') || _.get(this.boards, '[0]');
          return this.getFramework({ boardName });
        })
      );
  }
  ngOnInit() {
    this.checkForWindowSize();
    merge(this.boardChangeHandler(), this.fetchSelectedFilterOptions(), this.handleFilterChange())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(null, error => {
        console.error('Error while fetching filters');
      });
  }
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
          filters['audience'] = this.audienceList;
          filters = _.pick(filters || {}, this.filterData);
          this.filters = filters = this.sortFilters({ filters });
          this.updateBoardList();
          this.updateFiltersList({ filters: _.omit(filters, 'board') });
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
            this.pushNewFilter({ type, updatedValues: _.map(event || [],
              selectedValue => _.findIndex(this.allValues[type], val => val === selectedValue)) });
          }
          this.emitFilterChangeEvent();
        }));
  }

  private updateBoardList() {
    if (this.filters.board || !this.filters.board.length) {
      this.emptyBoard = true;
    }
    this.boards = this.allValues['board'] = this.filters.board || [];
    this.boards = _.map(this.boards, node => ({
      name: node.name,
      value: node.name,
    }));
    this.optionData.push({
      label: this.optionLabel.Board,
      value: 'board',
      option: this.boards
    });
    this.optionData = _.uniqBy(this.optionData, 'label');
    if (this.boards.length) {
      const selectedOption = _.find(this.boards, { name: _.get(this.queryFilters, 'board[0]') }) ||
        _.find(this.boards, { name: _.get(this.defaultFilters, 'board[0]') }) || this.boards[0];
      this.selectedBoard = { label: this.optionLabel.Board, value: 'board', selectedOption: _.get(selectedOption, 'name') };
      this.selectedOption = this.selectedBoard;
    }
  }
  private popFilter({ type, index }) {
    const selectedIndices = _.get(this.selectedFilters, type) || [];
    _.remove(selectedIndices,  (currentIndex) => {
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
    if (['audience', 'publisher', 'subject'].includes(type) && !indices.length) {
      return [];
    }
    return indices.length ? indices : [0];
  }
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
          val === queryParamValue)), index => index !== -1);
          selectedIndices = _.get(indices, 'length') ? indices : this.getIndicesFromDefaultFilters({ type: filterKey });
        } else {
          selectedIndices = this.getIndicesFromDefaultFilters({ type: filterKey });
        }
        this.selectedFilters[filterKey] = selectedIndices;
        this.selectedNgModels[filterKey] = _.map(selectedIndices, index => this.allValues[filterKey][index]);
      }
    });
  }
  private updateRoute(resetFilters?: boolean) {
    const selectedTab = _.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'textbook';
    this.router.navigate([], {
      queryParams: resetFilters ? { selectedTab } : this.getSelectedFilter(),
      relativeTo: this.activatedRoute.parent
    });
  }
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
    filters['board'] = _.get(this.selectedBoard, 'selectedOption') ? [this.selectedBoard.selectedOption] : [];
    filters['selectedTab'] = _.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'textbook';
    return filters;
  }
  private emitFilterChangeEvent(skipUrlUpdate = false) {
    const filters = this.getSelectedFilter();
    this.filterChange.emit({ status: 'FETCHED', filters });
    if (!skipUrlUpdate) {
      this.updateRoute();
    }
  }
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
}
