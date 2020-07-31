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
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  public filterLayout = LibraryFiltersLayout;
  public refresh = true;
  private unsubscribe$ = new Subject<void>();
  private filters;
  private queryFilters: any = {};
  public boards: any[] = [];
  public selectedBoard;
  public mediums: any[] = [];
  public selectedMediums;
  public subjects: any[] = [];
  public selectedSubjects;
  public gradeLevels: any[] = [];
  public selectedGradeLevelIndex = 0;
  public publishers: any[] = [];
  public selectedPublisher;
  public selectedContentTypes;

  filterChangeEvent = new Subject();
  @Input() globalSearchFacets: Array<string>;
  @Input() contentTypes: Array<string>;
  @Input() defaultFilters;
  @Input() pageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
  @Output() filterChange: EventEmitter<{ status: string, filters?: any }> = new EventEmitter();
  @Output() fetchingFilters: EventEmitter<any> = new EventEmitter();
  @Input() layoutConfiguration;
  constructor(public resourceService: ResourceService, private router: Router, private contentSearchService: ContentSearchService,
    private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef, public layoutService: LayoutService) {
  }

  ngOnInit() {
    console.log('this.globalSearchFacets', this.globalSearchFacets)
    this.fetchSelectedFilterAndFilterOption();
    this.handleFilterChange();
  }

  showFields(field: string) {
    return _.includes(this.globalSearchFacets, field);
  }

  private fetchSelectedFilterAndFilterOption() {
    this.activatedRoute.queryParams.pipe(map((queryParams) => {
      const queryFilters: any = {};
      _.forIn(queryParams, (value, key) => {
        if (['medium', 'gradeLevel', 'board', 'channel', 'subject', 'contentType'].includes(key)) {
          queryFilters[key] = _.isArray(value) ? value : [value];
        }
      });
      return queryFilters;
    }),
      mergeMap((queryParams) => {
        this.filterChange.emit({ status: 'FETCHING' });
        this.queryFilters = _.cloneDeep(queryParams);
        const boardName = _.get(queryParams, 'board[0]') || _.get(this.boards, '[0]');
        return this.contentSearchService.fetchFilter(boardName);
      }))
      .subscribe(filters => {
        if (filters && filters.hasOwnProperty('board')) {
          filters['board'] = _.sortBy(filters['board'], ['name']);
        }
        if (filters && filters.hasOwnProperty('medium')) {
          filters['medium'] = _.sortBy(filters['medium'], ['name']);
        }
        if (filters && filters.hasOwnProperty('subject')) {
          filters['subject'] = _.sortBy(filters['subject'], ['name']);
        }
        if (filters && filters.hasOwnProperty('publisher')) {
          filters['publisher'] = _.sortBy(filters['publisher'], ['name']);
        }

        this.filters = filters;
        this.updateFilters();
        this.emitFilterChangeEvent(true);
        this.hardRefreshFilter();
      }, error => {
        console.error('fetching filter data failed', error);
      });
  }

  private handleFilterChange() {
    this.filterChangeEvent.pipe(filter(({ type, event }) => {
      if (type === 'board') {
        this.selectedMediums = this.selectedSubjects = [];
        this.selectedGradeLevelIndex = 0;
        return true;
      } else if (_.includes(['medium', 'subject', 'publisher', 'contentType'], type)) {
        return true;
      } else if (type === 'gradeLevel' && this.selectedGradeLevelIndex !== event.data.index) {
        this.selectedGradeLevelIndex = event.data.index;
        return true;
      }
      return false;
    }), debounceTime(1000)).subscribe(({ type, event }) => {
      this.emitFilterChangeEvent();
    });
  }

  private updateFilters() {
    this.boards = _.map(this.filters.board, board => board.name);
    if (this.boards.length && _.get(this.queryFilters, 'board[0]')) {
      this.selectedBoard = this.queryFilters.board[0];
    }

    this.mediums = _.map(this.filters.medium, medium => medium.name);
    if (this.mediums.length && _.get(this.queryFilters, 'medium')) {
      this.selectedMediums = this.queryFilters.medium;
    }

    this.subjects = _.map(this.filters.subject, subject => subject.name);
    if (this.subjects.length && _.get(this.queryFilters, 'subject')) {
      this.selectedSubjects = this.queryFilters.subject;
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

    this.publishers = this.filters.publisher;
    if (this.publishers.length && _.get(this.queryFilters, 'channel[0]')) {
      this.selectedPublisher = this.queryFilters.channel[0];
    }

    if (this.contentTypes.length && _.get(this.queryFilters, 'contentType')) {
      this.selectedContentTypes = this.queryFilters.contentType;
    }
  }

  private updateRoute() {
    this.router.navigate([], {
      queryParams: this.getSelectedFilter(),
      relativeTo: this.activatedRoute.parent
    });
  }

  private getSelectedFilter() {
    const filters = {
      board: this.selectedBoard ? [this.selectedBoard] : [],
      medium: !_.isEmpty(this.selectedMediums) ? this.selectedMediums : [],
      gradeLevel: this.gradeLevels[this.selectedGradeLevelIndex] ? [this.gradeLevels[this.selectedGradeLevelIndex]] : [],
      subject: !_.isEmpty(this.selectedSubjects) ? this.selectedSubjects : [],
      channel: this.selectedPublisher ? this.selectedPublisher : [],
      contentType: this.selectedContentTypes ? this.selectedContentTypes : [],

    };
    return filters;
  }

  private emitFilterChangeEvent(skipUrlUpdate = false) {
    const filters = this.getSelectedFilter();
    this.filterChange.emit({ status: 'FETCHED', filters });
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

  private hardRefreshFilter() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  isLayoutAvailable() {
    return this.layoutService.isLayoutAvailable(this.layoutConfiguration);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
