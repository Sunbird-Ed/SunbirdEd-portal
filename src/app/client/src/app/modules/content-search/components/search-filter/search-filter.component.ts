import { Component, Output, EventEmitter, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';
import { OrgDetailsService, FrameworkService, ChannelService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
import { OnboardingService } from './../../../../../../projects/desktop/src/app/modules/offline/services';
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
  classLayout: LibraryFiltersLayout = LibraryFiltersLayout.ROUND;
  public unsubscribe$ = new Subject<void>();
  filters;

  selectedBoard: any = {};
  selectedMediumIndex: number[] = [];
  selectedClassIndex: number[] = [];

  boards: any[] = [];
  mediums: any[] = [];
  classes: any[] = [];

  @Input() selectedFilters;
  @Output() filterChange: EventEmitter<any> = new EventEmitter();

  constructor(public resourceService: ResourceService, public frameworkService: FrameworkService,
    public router: Router, private contentSearchService: ContentSearchService,
  ) { }

  ngOnInit() {
    console.log('====this.selectedFilters in filter=====', this.selectedFilters);
    this.contentSearchService.filterData$.pipe(takeUntil(this.unsubscribe$)).subscribe(({data, error}) => {
      console.log('filters comp', data);
      if (error || !data) {
        console.log('error should be handled', error, data);
      }
      this.filters = data;
      if (!this.boards.length && this.filters.board) {
        this.boards = this.filters.board;
        this.pushDummyBoard();
        this.selectedBoard = this.boards.find((board) => {
          if (this.selectedBoard.name) {
            return board.name === this.selectedBoard.name;
          } else if (this.selectedFilters.board) {
            return board.name === this.selectedFilters.board;
          }
        });
        console.log(this.selectedBoard);
      }
      if (this.filters.medium) {
        this.mediums = this.filters.medium.map(medium => medium.name);
        let mediumIndex = 0;
        if (this.selectedFilters.medium) {
          mediumIndex = this.mediums.findIndex((medium) => medium === this.selectedFilters.medium);
          console.log('mediumIndex', mediumIndex);
          mediumIndex = mediumIndex === -1 ? 0 : mediumIndex;
        }
        this.selectedMediumIndex.push(mediumIndex);
      }
      if (this.filters.gradeLevel) {
        this.classes = this.filters.gradeLevel.map(gradeLevel => gradeLevel.name);
        let classIndex = 0;
        if (this.selectedFilters.class) {
          classIndex = this.classes.findIndex((classes) => classes === this.selectedFilters.class);
          console.log('classIndex', classIndex);
          classIndex = classIndex === -1 ? 0 : classIndex;
        }
        this.selectedClassIndex.push(classIndex);
      }
      this.triggerFilterChangeEvent();
    });
  }
  pushDummyBoard() {
    this.boards.push({
      identifier: 'NCF',
      code: 'NCF',
      name: 'NCF framework',
      description: ' NCF framework...',
      type: 'K-12',
      objectType: 'Framework'
    });
  }
  onBoardChange(option) {
    console.log('board changed', this.selectedBoard);
    this.contentSearchService.boardChanged(option.identifier);
  }

  applyFilters(event, type) {
    if (type === 'medium') {
      this.selectedMediumIndex = [event.data.index];
    } else if (type === 'class') {
      this.selectedClassIndex = [event.data.index];
    }
    this.triggerFilterChangeEvent();
  }

  triggerFilterChangeEvent() {
    const filters = {
      board: this.selectedBoard.name,
      medium: this.mediums[this.selectedMediumIndex[0]],
      gradeLevel: this.classes[this.selectedClassIndex[0]]
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

    if (this.selectedMediumIndex.length) {
      selectMediumInteractEdata['extra'] = {
        medium: [this.mediums[this.selectedMediumIndex[0]]]
      };
    }

    return selectMediumInteractEdata;
  }

  getClassInteractEdata() {
    const selectClassInteractEdata: IInteractEventEdata = {
      id: 'grade-level-select-button',
      type: 'click',
      pageid: this.router.url.split('/')[1] || 'library'
    };

    if (this.selectedClassIndex.length) {
      selectClassInteractEdata['extra'] = {
        gradeLevel: [this.classes[this.selectedClassIndex[0]]]
      };
    }

    return selectClassInteractEdata;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

