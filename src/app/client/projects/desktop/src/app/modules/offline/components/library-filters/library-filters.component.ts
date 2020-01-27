import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';

import { OrgDetailsService, FrameworkService, ChannelService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
import { OnboardingService } from '../../services';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  selector: 'app-library-filters',
  templateUrl: './library-filters.component.html',
  styleUrls: ['./library-filters.component.scss']
})
export class LibraryFiltersComponent implements OnInit, OnDestroy {

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
  @Output() filterChange: EventEmitter<IFilterChange> = new EventEmitter();

  constructor(
    public resourceService: ResourceService,
    public frameworkService: FrameworkService,
    private orgDetailsService: OrgDetailsService,
    private channelService: ChannelService,
    private onboardingService: OnboardingService,
    public router: Router
  ) { }

  ngOnInit() {
    this.showDefaultFilter = false;
    this.orgDetailsService.getCustodianOrg()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.hashTagId = _.get(data, 'result.response.value');
        this.userDetails = this.onboardingService.userData;
        this.setBoard();
      });
  }

  setBoard() {
    this.channelService.getFrameWork(this.hashTagId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(orgDetails => {
        this.boards = _.get(orgDetails, 'result.channel.frameworks');

        if (this.boards) {
          const defaultBoard = this.boards.find((board) => board.name === this.userDetails.framework.board);

          if (_.get(this.selectedFilters, 'board[0]')) {
            const offlineBoard = this.boards.find((board) => board.name === this.selectedFilters.board[0]);

            if (offlineBoard) {
              this.selectedBoard = offlineBoard;
            } else {
              this.selectedBoard = defaultBoard;
              this.showDefaultFilter = true;
            }
          } else {
            this.selectedBoard = defaultBoard;
          }
        }

        if (this.selectedBoard) {
          this.frameworkService.getFrameworkCategories(_.get(this.selectedBoard, 'identifier'))
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res) => {
              if (res && _.get(res, 'result.framework.categories')) {
                this.frameworkCategories = _.get(res, 'result.framework.categories');
                if (_.get(this.selectedFilters, 'board[0]') && !this.showDefaultFilter) {
                  this.setFilters(false);
                } else {
                  this.setFilters(true);
                }
              }
            });
        }
      });
  }

  setFilters(showDefault?) {
    this.resetFilters();
    const framework = this.userDetails.framework;

    this.frameworkCategories.forEach(element => {
      switch (element.code) {
        case 'medium':
          this.mediums = element.terms.map(medium => medium.name);
          let mediumIndex;

          if (showDefault) {
            mediumIndex = this.mediums.findIndex(medium => framework.medium.includes(medium));
          } else if (_.get(this.selectedFilters, 'medium[0]')) {
            mediumIndex = this.mediums.findIndex((medium) => medium === this.selectedFilters.medium[0]);
          }

          if (_.isNumber(mediumIndex)) {
            this.selectedMediumIndex.push(mediumIndex);
          }
          break;

        case 'gradeLevel':
          this.classes = element.terms.map(gradeLevel => gradeLevel.name);
          let classIndex;

          if (showDefault) {
            classIndex = this.classes.findIndex(value => framework.gradeLevel.includes(value));
          } else if (_.get(this.selectedFilters, 'gradeLevel[0]')) {
            classIndex = this.classes.findIndex((classElement) =>
              classElement === this.selectedFilters.gradeLevel[0]);
          }

          if (_.isNumber(classIndex)) {
            this.selectedClassIndex.push(classIndex);
          }
          break;
      }
    });

    this.triggerFilterChangeEvent();
  }

  onBoardChange(option) {
    this.resetFilters();
    this.frameworkService.getFrameworkCategories(_.get(option, 'identifier'))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (data && _.get(data, 'result.framework.categories')) {
          this.frameworkCategories = _.get(data, 'result.framework.categories');
          this.setFilters(false);
        }
      });
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
      this.selectedClassIndex = [];
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

