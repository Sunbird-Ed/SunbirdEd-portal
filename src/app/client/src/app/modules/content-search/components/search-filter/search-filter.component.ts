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

interface IFilterChange {
  filters: IFilters;
  channelId: string;
}

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnDestroy, OnChanges {

  selectedBoard: any;
  selectedMediumIndex: number[] = [];
  selectedClassIndex: number[] = [];

  boards: any[] = [];
  mediums: any[] = [];
  classes: any[] = [];

  mediumLayout: LibraryFiltersLayout = LibraryFiltersLayout.SQUARE;
  classLayout: LibraryFiltersLayout = LibraryFiltersLayout.ROUND;

  frameworkCategories: any;
  userDetails: any;
  hashTagId: string;
  showDefaultFilter: boolean;
  public unsubscribe$ = new Subject<void>();

  @Input() selectedFilters;
  @Input() filters;
  @Output() filterChange: EventEmitter<IFilterChange> = new EventEmitter();

  constructor(
    public resourceService: ResourceService,
    public frameworkService: FrameworkService,
    private orgDetailsService: OrgDetailsService,
    private channelService: ChannelService,
    private onboardingService: OnboardingService,
    public router: Router,
    private contentSearchService: ContentSearchService,
  ) { }

  ngOnInit() {
    console.log('=====this.filters --====', this.filters, this.selectedFilters);
    if (this.filters.board) {
      this.boards = this.filters.board;
      this.boards.push({
        identifier: "NCF",
        code: "NCF",
        name: "NCF framework",
        description: " NCF framework...",
        type: "K-12",
        objectType: "Framework"
      });
      this.selectedBoard = this.boards.find((board) => board.name === this.selectedFilters.board);
    }
    this.contentSearchService.filterData$.pipe(takeUntil(this.unsubscribe$)).subscribe(({data}) => {
      console.log('filters comp', data);
      if (data) {
        this.filters = data;
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
          if (this.selectedFilters.medium) {
            classIndex = this.mediums.findIndex((medium) => medium === this.selectedFilters.gradeLevel);
            console.log('classIndex', classIndex);
            classIndex = classIndex === -1 ? 0 : classIndex;
          }
          this.selectedClassIndex.push(classIndex);
        }
      }
    });
  }
  ngOnChanges(...arg) {
    console.log('---ngOnChanges-----', arg);
  }
  onBoardChange(option) {
    console.log('board changed', option);
    this.contentSearchService.boardChanged(option.identifier);
    // this.resetFilters();
    // this.frameworkService.getFrameworkCategories(_.get(option, 'identifier'))
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((data) => {
    //     if (data && _.get(data, 'result.framework.categories')) {
    //       this.frameworkCategories = _.get(data, 'result.framework.categories');
    //       this.setFilters(false);
    //     }
    //   });
  }

  resetFilters() {
    this.mediums = [];
    this.classes = [];
    this.selectedClassIndex = [];
    this.selectedMediumIndex = [];

  }

  applyFilters(event, type) {
    this.getSelectedFilters();

    if (type === 'medium') {
      this.selectedMediumIndex = [event.data.index];
    } else if (type === 'class') {
      this.selectedClassIndex = [event.data.index];
    }

    this.triggerFilterChangeEvent();
  }

  getSelectedFilters() {
    const filters: any = {};
    filters.board = [this.selectedBoard.name];

    if (this.selectedMediumIndex.length) {
      filters.appliedFilters = true;
      filters.medium = [this.mediums[this.selectedMediumIndex[0]]];
    }

    if (this.selectedClassIndex.length) {
      filters.appliedFilters = true;
      filters.gradeLevel = [this.classes[this.selectedClassIndex[0]]];
    }

    return filters;
  }

  triggerFilterChangeEvent() {
    const data: IFilterChange = {
      filters: this.getSelectedFilters(),
      channelId: this.hashTagId
    };
    this.filterChange.emit(data);
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

