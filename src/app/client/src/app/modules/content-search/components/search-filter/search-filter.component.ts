import { Component, Output, EventEmitter, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash-es';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';
import { ResourceService, LayoutService } from '@sunbird/shared';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, map, mergeMap, filter } from 'rxjs/operators';
import { ContentSearchService } from './../../services';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  public filterLayout = LibraryFiltersLayout;
  public refresh = true;
  private unsubscribe$ = new Subject<void>();
  public emptyBoard = false;
  private filters;
  private queryFilters: any = {};
  public selectedMediumIndex = 0;
  public selectedGradeLevelIndex = 0;
  public optionData: any[] = [];
  public selectedBoard: { label: string, value: string, selectedOption: string };
  public selectedChannel: { label: string, value: string, selectedOption: string };
  public selectedOption: { label: string, value: string, selectedOption: string };
  public optionLabel = { Publisher: this.resourceService.RESOURCE_CONSUMPTION_ROOT+'frmelmnts.lbl.publisher', Board: this.resourceService.RESOURCE_CONSUMPTION_ROOT+'frmelmnts.lbl.boards' };
  public type: string;
  public publisher: any[] = [];
  public boards: any[] = [];
  public mediums: any[] = [];
  public gradeLevels: any[] = [];
  filterChangeEvent =  new Subject();
  @Input() isOpen;
  @Input() defaultFilters;
  @Input() pageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
  @Output() filterChange: EventEmitter<{status: string, filters?: any}> = new EventEmitter();
  @Output() fetchingFilters: EventEmitter<any> = new EventEmitter();
  @Input() layoutConfiguration;
  showFilter = true;
  constructor(public resourceService: ResourceService, private router: Router, private contentSearchService: ContentSearchService,
    private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef, public layoutService: LayoutService) {
  }
  ngOnInit() {
    this.type = this.optionLabel.Board;
    this.fetchSelectedFilterAndFilterOption();
    this.handleFilterChange();
    // screen size
    if (window.innerWidth <= 992 ) {
      this.isOpen = false;
    }
  }

  private fetchSelectedFilterAndFilterOption() {
    this.activatedRoute.queryParams.pipe(map((queryParams) => {
      const queryFilters: any = {};
      _.forIn(queryParams, (value, key) => {
        if (['medium', 'gradeLevel', 'board', 'channel'].includes(key)) {
          queryFilters[key] = _.isArray(value) ? value : [value];
        }
      });
      return queryFilters;
    }),
    mergeMap((queryParams) => {
      if (queryParams.channel) {
        this.selectedChannel = { label: this.optionLabel.Publisher, value: 'channel', selectedOption: queryParams.channel[0] };
        this.type = this.optionLabel.Publisher;
      }
      this.filterChange.emit({status: 'FETCHING'}); // used to show loader until framework is fetched
      this.queryFilters = _.cloneDeep(queryParams);
      const boardName = _.get(queryParams, 'board[0]') || _.get(this.boards, '[0]');
      return this.contentSearchService.fetchFilter(boardName);
    }))
    .subscribe(filters => {
      if (filters && filters.hasOwnProperty('medium')) {
        filters['medium'] = _.sortBy(filters['medium'], ['name']);
      }
      if (filters && filters.hasOwnProperty('board')) {
        filters['board'] = _.sortBy(filters['board'], ['name']);
      }
      this.filters = filters;
      this.updateBoardList();
      this.updateMediumAndGradeLevelList();
      this.emitFilterChangeEvent(true);
      this.hardRefreshFilter();
    }, error => {
      console.error('fetching filter data failed', error);
    });
  }
  private handleFilterChange() {
    this.filterChangeEvent.pipe(filter(({type, event}) => {
      if (type === 'medium' && this.selectedMediumIndex !== event.data.index) {
        this.selectedMediumIndex = event.data.index;
        return true;
      } else if (type === 'gradeLevel' && this.selectedGradeLevelIndex !== event.data.index) {
        this.selectedGradeLevelIndex = event.data.index;
        return true;
      }
      return false;
    }), debounceTime(1000)).subscribe(({type, event}) => {
      this.emitFilterChangeEvent();
    });
  }

  private mediumFilterChange(event) {
    this.selectedMediumIndex = event.label;
    this.emitFilterChangeEvent();
  }
  private updateBoardList() {
    if (this.filters.board || !this.filters.board.length) {
      this.emptyBoard = true;
    }
    this.boards = this.filters.board || [];
    this.boards = _.map(this.boards, node => ({
      name: node.name,
      value: node.name,
    }));
    if (_.get(this.filters, 'publisher') && _.get(this.filters, 'publisher').length > 0) {
      this.optionData.push({
        label: this.optionLabel.Publisher,
        value: 'channel',
        option: _.get(this.filters, 'publisher'),
      });
    }
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
      this.selectedOption = this.type === this.optionLabel.Publisher ? this.selectedChannel : this.selectedBoard;
    }
  }
  private updateMediumAndGradeLevelList() {
    this.mediums = _.map(this.filters.medium, medium => medium.name);
    if (this.mediums.length) {
      let mediumIndex = -1;
      if (_.get(this.queryFilters, 'medium[0]')) {
        mediumIndex = this.mediums.findIndex((medium) => medium === this.queryFilters.medium[0]);
      }
      if (_.get(this.defaultFilters, 'medium[0]') && mediumIndex === -1) {
        mediumIndex = this.mediums.findIndex((medium) => medium === this.defaultFilters.medium[0]);
      }
      mediumIndex = mediumIndex === -1 ? 0 : mediumIndex;
      this.selectedMediumIndex = mediumIndex;
    }
    this.gradeLevels = _.map(this.filters.gradeLevel, gradeLevel => gradeLevel.name);
    if (this.gradeLevels.length) {
      let gradeLevelIndex = -1;
      if (_.get(this.queryFilters, 'gradeLevel[0]')) {
        gradeLevelIndex = this.gradeLevels.findIndex((gradeLevel) => gradeLevel === this.queryFilters.gradeLevel[0]);
      }
      if (_.get(this.defaultFilters, 'gradeLevel[0]') && gradeLevelIndex === -1) {
        gradeLevelIndex = this.gradeLevels.findIndex((gradeLevel) => gradeLevel === this.defaultFilters.gradeLevel[0]);
      }
      gradeLevelIndex = gradeLevelIndex === -1 ? 0 : gradeLevelIndex;
      this.selectedGradeLevelIndex = gradeLevelIndex;
    }
  }

  /**
  * @description Function to update route
  * @since release-3.1.0
  */
  private updateRoute() {
    this.router.navigate([], {
      queryParams: this.getSelectedFilter(),
      relativeTo: this.activatedRoute.parent
    });
  }

  /**
  * @description Function called after selection of Board/publisher
  * @since release-3.1.0
  */
  selectedGroupOption(data) {
    this.type = data.label;
    this.selectedOption = data;
    if (data.label === this.optionLabel.Publisher) {
      this.selectedChannel = data;
    } else {
      this.selectedBoard = data;
    }
    this.mediums = [];
    this.gradeLevels = [];
    this.filterChange.emit({ status: 'FETCHING' }); // used to show loader until framework is fetched
    this.contentSearchService.fetchFilter(data.selectedOption).subscribe((filters) => {
      this.filters.medium = _.sortBy(filters['medium'], ['name']) || [];
      this.filters.gradeLevel = filters.gradeLevel || [];
      this.updateMediumAndGradeLevelList();
      this.updateRoute();
    }, error => {
      console.error('fetching filters on board change error', error);
    });
  }

  private getSelectedFilter() {
    const filters = {
      medium: this.mediums[this.selectedMediumIndex] ? [this.mediums[this.selectedMediumIndex]] : [],
      gradeLevel: this.gradeLevels[this.selectedGradeLevelIndex] ? [this.gradeLevels[this.selectedGradeLevelIndex]] : []
    };
    if (this.type === this.optionLabel.Publisher) {
      filters['channel'] = [_.get(this.selectedChannel, 'selectedOption')];
    } else {
      filters['board'] = _.get(this.selectedBoard, 'selectedOption') ? [this.selectedBoard.selectedOption] : [];
    }
    filters['selectedTab'] = _.get(this.activatedRoute, 'snapshot.queryParams.selectedTab') || 'textbook';
    return filters;
  }
  private emitFilterChangeEvent(skipUrlUpdate = false) {
    const filters = this.getSelectedFilter();
    this.filterChange.emit({status: 'FETCHED', filters});
    if (!skipUrlUpdate) {
      this.updateRoute();
    }
  }
  public getBoardInteractEdata() {
    const selectBoardInteractEdata: IInteractEventEdata = {
      id: 'apply-filter',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    const appliedFilter: any = this.getSelectedFilter() || {};
    appliedFilter.board = _.get(this.selectedBoard, 'selectedOption') ? _.get(this.selectedBoard, 'selectedOption') : appliedFilter.board;
    selectBoardInteractEdata['extra'] = {
      filters: appliedFilter
    };
    return selectBoardInteractEdata;
  }

  public getMediumInteractEdata() {
    const selectBoardInteractEdata: IInteractEventEdata = {
      id: 'apply-filter',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    const appliedFilter = this.getSelectedFilter();
    selectBoardInteractEdata['extra'] = {
      filters: appliedFilter
    };
    return selectBoardInteractEdata;
  }

  public getGradeLevelInteractEdata() {
    const selectBoardInteractEdata: IInteractEventEdata = {
      id: 'apply-filter',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    const appliedFilter = this.getSelectedFilter();
    selectBoardInteractEdata['extra'] = {
      filters: appliedFilter
    };
    return selectBoardInteractEdata;
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
}
