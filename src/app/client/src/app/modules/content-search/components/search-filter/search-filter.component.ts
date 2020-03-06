import { Component, Output, EventEmitter, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';
import { FrameworkService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContentSearchService } from './../../services';

interface IFilters {
  board: string[];
  medium?: string[];
  gradeLevel?: string[];
}

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnDestroy {

  mediumLayout: LibraryFiltersLayout = LibraryFiltersLayout.SQUARE;
  gradeLevelLayout: LibraryFiltersLayout = LibraryFiltersLayout.ROUND;
  public unsubscribe$ = new Subject<void>();
  filters;

  selectedBoard: any = {};
  selectedMediumIndex = 0;
  selectedGradeLevelIndex = 0;

  boards: any[] = [];
  mediums: any[] = [];
  gradeLevels: any[] = [];
  selectedBoardLocalCopy: any = {};
  @Input() selectedFilters;
  @Output() filterChange: EventEmitter<any> = new EventEmitter();

  constructor(public resourceService: ResourceService, public frameworkService: FrameworkService,
    public router: Router, private contentSearchService: ContentSearchService,
  ) { }

  ngOnInit() {
    console.log('selected index in search filter', this.selectedFilters);
    this.contentSearchService.filterData$.pipe(takeUntil(this.unsubscribe$)).subscribe(({data, error}) => {
      if (error || !data) {
        console.log('search-filter: framework error', error, data);
        this.emitFilterChangeEvent(); // emitting prev filter or empty filter if error
        return;
      }
      this.filters = data;
      if (!this.boards.length && this.filters.board) {
        this.boards = this.filters.board;
        this.selectedBoard = this.boards.find((board) => {
          if (this.selectedBoard.name) {
            return board.name === this.selectedBoard.name;
          } else if (this.selectedFilters.board[0]) {
            return board.name === this.selectedFilters.board[0];
          }
        }) || this.boards[0];
      }
      if (this.filters.medium) {
        this.mediums = this.filters.medium.map(medium => medium.name);
        let mediumIndex = 0;
        if (this.selectedFilters.medium[0]) {
          mediumIndex = this.mediums.findIndex((medium) => medium === this.selectedFilters.medium[0]);
          mediumIndex = mediumIndex === -1 ? 0 : mediumIndex;
        }
        this.selectedMediumIndex = mediumIndex;
      }
      if (this.filters.gradeLevel) {
        this.gradeLevels = this.filters.gradeLevel.map(gradeLevel => gradeLevel.name);
        let gradeLevelIndex = 0;
        if (this.selectedFilters.gradeLevel[0]) {
          gradeLevelIndex = this.gradeLevels.findIndex((gradeLevel) => gradeLevel === this.selectedFilters.gradeLevel[0]);
          gradeLevelIndex = gradeLevelIndex === -1 ? 0 : gradeLevelIndex;
        }
        this.selectedGradeLevelIndex = gradeLevelIndex;
      }
      this.emitFilterChangeEvent();
    });
  }
  onBoardChange(option) {
    if (this.selectedBoardLocalCopy.name === option.name) {
      return;
    }
    this.selectedBoardLocalCopy = option;
    this.contentSearchService.boardChanged(option.identifier);
  }

  applyFilters(event, type) {
    if (type === 'medium' && this.selectedMediumIndex !== event.data.index) {
      this.selectedMediumIndex = event.data.index;
      this.emitFilterChangeEvent();
    } else if (type === 'gradeLevel' && this.selectedGradeLevelIndex !== event.data.index) {
      this.selectedGradeLevelIndex = event.data.index;
      this.emitFilterChangeEvent();
    }
  }

  emitFilterChangeEvent() {
    const filters = {
      board: _.get(this.selectedBoard, 'name') ? [this.selectedBoard.name] : [],
      medium: this.mediums[this.selectedMediumIndex] ? [this.mediums[this.selectedMediumIndex]] : [],
      gradeLevel: this.gradeLevels[this.selectedGradeLevelIndex] ? [this.gradeLevels[this.selectedGradeLevelIndex]] : []
    };
    this.filterChange.emit(filters);
  }

  getBoardInteractEdata(selectedBoard) {
    const selectBoardInteractEdata: IInteractEventEdata = {
      id: 'board-select-button',
      type: 'click',
      pageid: this.router.url.split('/')[1] || 'library'
    };
    if (selectedBoard) {
      selectBoardInteractEdata['extra'] = {
        board: selectedBoard.name
      };
    }
    return selectBoardInteractEdata;
  }

  getMediumInteractEdata() {
    const selectMediumInteractEdata: IInteractEventEdata = {
      id: 'medium-select-button',
      type: 'click',
      pageid: this.router.url.split('/')[1] || 'library'
    };
    if (this.selectedMediumIndex || this.selectedMediumIndex === 0) {
      selectMediumInteractEdata['extra'] = {
        medium: [this.mediums[this.selectedMediumIndex]]
      };
    }
    return selectMediumInteractEdata;
  }

  getGradeLevelInteractEdata() {
    const selectGradeLevelInteractEdata: IInteractEventEdata = {
      id: 'grade-level-select-button',
      type: 'click',
      pageid: this.router.url.split('/')[1] || 'library'
    };
    if (this.selectedGradeLevelIndex || this.selectedGradeLevelIndex === 0) {
      selectGradeLevelInteractEdata['extra'] = {
        gradeLevel: [this.gradeLevels[this.selectedGradeLevelIndex]]
      };
    }
    return selectGradeLevelInteractEdata;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

