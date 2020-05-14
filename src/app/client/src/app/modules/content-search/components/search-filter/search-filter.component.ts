import { Component, Output, EventEmitter, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash-es';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';
import { ResourceService } from '@sunbird/shared';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, of } from 'rxjs';
import { takeUntil, debounceTime, map, mergeMap, filter, tap } from 'rxjs/operators';
import { ContentSearchService } from './../../services';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  public filterLayout = LibraryFiltersLayout;
  public initialized = false;
  public refresh = true;
  private unsubscribe$ = new Subject<void>();
  public emptyBoard = false;
  private filters;
  private queryFilters: any = {};
  public selectedBoard: any = {};
  public selectedMediumIndex = 0;
  public selectedGradeLevelIndex = 0;

  public boards: any[] = [];
  public mediums: any[] = [];
  public gradeLevels: any[] = [];
  private selectedBoardLocalCopy: any = {};
  filterChangeEvent =  new Subject();
  @Input() defaultFilters;
  @Input() pageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
  @Output() filterChange: EventEmitter<{status: string, filters?: any}> = new EventEmitter();
  @Output() fetchingFilters: EventEmitter<any> = new EventEmitter();
  constructor(public resourceService: ResourceService, private router: Router, private contentSearchService: ContentSearchService,
    private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.fetchSelectedFilterAndFilterOption();
    this.handleFilterChange();
  }
  private fetchSelectedFilterAndFilterOption() {
    this.activatedRoute.queryParams.pipe(map((queryParams) => {
      const queryFilters: any = {};
      _.forIn(queryParams, (value, key) => {
        if (['medium', 'gradeLevel', 'board'].includes(key)) {
          queryFilters[key] = _.isArray(value) ? value : [value];
        }
      });
      return queryFilters;
    }),
    filter((queryFilters) => {
      const selectedFilters = this.getSelectedFilter();
      if (_.isEqual(queryFilters, selectedFilters) && this.initialized) { // same filter change, no need to fetch filter again
        return false;
      }
      this.initialized = true;
      return true;
    }),
    mergeMap((queryParams) => {
      this.filterChange.emit({status: 'FETCHING'}); // used to show loader until framework is fetched
      this.queryFilters = _.cloneDeep(queryParams);
      const boardName = _.get(queryParams, 'board[0]') || _.get(this.boards, '[0]');
      return this.contentSearchService.fetchFilter(boardName);
    }))
    .subscribe(filters => {
      this.filters = filters;
      this.updateBoardList();
      this.updateMediumAndGradeLevelList();
      this.selectedBoardLocalCopy = this.selectedBoard;
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
  private updateBoardList() {
    if (this.filters.board || !this.filters.board.length) {
      this.emptyBoard = true;
    }
    this.boards = this.filters.board || [];
    if (this.boards.length) {
      this.selectedBoard = _.find(this.boards, {name: _.get(this.queryFilters, 'board[0]')}) ||
        _.find(this.boards, {name: _.get(this.defaultFilters, 'board[0]')}) || this.boards[0];
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
  public onBoardChange(option) {
    if (this.selectedBoardLocalCopy.name === option.name) {
      return;
    }
    this.selectedBoardLocalCopy = option;
    this.mediums = [];
    this.gradeLevels = [];
    this.filterChange.emit({status: 'FETCHING'}); // used to show loader until framework is fetched
    this.contentSearchService.fetchFilter(option.name).subscribe((filters) => {
      this.filters.medium = filters.medium || [];
      this.filters.gradeLevel = filters.gradeLevel || [];
      this.updateMediumAndGradeLevelList();
      this.emitFilterChangeEvent();
    }, error => {
      console.error('fetching filters on board change error', error);
    });
  }
  private getSelectedFilter() {
    return {
      board: _.get(this.selectedBoard, 'name') ? [this.selectedBoard.name] : [],
      medium: this.mediums[this.selectedMediumIndex] ? [this.mediums[this.selectedMediumIndex]] : [],
      gradeLevel: this.gradeLevels[this.selectedGradeLevelIndex] ? [this.gradeLevels[this.selectedGradeLevelIndex]] : []
    };
  }
  private emitFilterChangeEvent(skipUrlUpdate = false) {
    const filters = this.getSelectedFilter();
    this.filterChange.emit({status: 'FETCHED', filters});
    if (!skipUrlUpdate) {
      this.router.navigate([], { queryParams: this.getSelectedFilter(),
        relativeTo: this.activatedRoute.parent
      });
    }
  }
  public getBoardInteractEdata(selectedBoard: any = {}) {
    const selectBoardInteractEdata: IInteractEventEdata = {
      id: 'apply-filter',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
    const appliedFilter: any = this.getSelectedFilter() || {};
    appliedFilter.board = selectedBoard.name ? selectedBoard.name : appliedFilter.board;
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
}
