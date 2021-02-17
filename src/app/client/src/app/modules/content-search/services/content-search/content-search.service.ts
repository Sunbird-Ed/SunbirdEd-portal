import { Injectable, EventEmitter } from '@angular/core';
import { OrgDetailsService, FrameworkService, ChannelService } from '@sunbird/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { skipWhile, mergeMap, first, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
const requiredCategories = { categories: 'board,gradeLevel,medium,class,subject' };
@Injectable({ providedIn: 'root' })
export class ContentSearchService {
  private channelId: string;
  public _frameworkId = '';
  get frameworkId() {
    return this._frameworkId;
  }
  private defaultBoard: string;
  private custodianOrg: boolean;
  private _filters = {
    board: [],
    medium: [],
    gradeLevel: [],
    subject: [],
    publisher: []
  };
  get filters() {
    return _.cloneDeep(this._filters);
  }
  private _searchResults$ = new BehaviorSubject<any>(undefined);
  get searchResults$(): Observable<any[]> {
    return this._searchResults$.asObservable()
      .pipe(skipWhile(data => data === undefined || data === null));
  }

  constructor(private frameworkService: FrameworkService, private orgDetailsService: OrgDetailsService,
    private channelService: ChannelService) { }

  public initialize(channelId: string, custodianOrg = false, defaultBoard: string) {
    this.channelId = channelId;
    this.custodianOrg = custodianOrg;
    this.defaultBoard = defaultBoard;
    this._searchResults$.complete(); // to flush old subscription
    this._searchResults$ = new BehaviorSubject<any>(undefined);
    return this.fetchChannelData();
  }
  private fetchChannelData() {
    return this.channelService.getFrameWork(this.channelId)
      .pipe(mergeMap((channelDetails) => {
        if (this.custodianOrg) {
          this._filters.board = _.get(channelDetails, 'result.channel.frameworks') || [{
            name: _.get(channelDetails, 'result.channel.defaultFramework'),
            identifier: _.get(channelDetails, 'result.channel.defaultFramework')
          }]; // framework array is empty assigning defaultFramework as only board
          const selectedBoard = this._filters.board.find((board) => board.name === this.defaultBoard) || this._filters.board[0];
          this._frameworkId = _.get(selectedBoard, 'identifier');
        } else {
          this._frameworkId = _.get(channelDetails, 'result.channel.defaultFramework');
        }
        if (_.get(channelDetails, 'result.channel.publisher')) {
          this._filters.publisher = JSON.parse(_.get(channelDetails, 'result.channel.publisher'));
        }
        return this.frameworkService.getSelectedFrameworkCategories(this._frameworkId, requiredCategories);
      }), map(frameworkDetails => {
        const frameworkCategories: any[] = _.get(frameworkDetails, 'result.framework.categories');
        frameworkCategories.forEach(category => {
          if (['medium', 'gradeLevel', 'subject'].includes(category.code)) {
            this._filters[category.code] = category.terms || [];
          } else if (!this.custodianOrg && category.code === 'board') {
            this._filters[category.code] = category.terms || [];
          }
        });
        return true;
      }), first());
  }
  public fetchFilter(boardName?) {
    if (!this.custodianOrg || !boardName) {
      return of(this.filters);
    }
    const selectedBoard = this._filters.board.find((board) => board.name === boardName)
      || this._filters.board.find((board) => board.name === this.defaultBoard) || this._filters.board[0];
    this._frameworkId = this._frameworkId = _.get(selectedBoard, 'identifier');
    return this.frameworkService.getSelectedFrameworkCategories(this._frameworkId, requiredCategories).pipe(map(frameworkDetails => {
      const frameworkCategories: any[] = _.get(frameworkDetails, 'result.framework.categories');
      frameworkCategories.forEach(category => {
        if (['medium', 'gradeLevel', 'subject'].includes(category.code)) {
          this._filters[category.code] = category.terms || [];
        } else if (category.code === 'board' && !this.custodianOrg) {
          this._filters[category.code] = category.terms || [];
        }
      });
      return this.filters;
    }), first());
  }

  get getCategoriesMapping() {
    return {
      subject: 'se_subjects',
      medium: 'se_mediums',
      gradeLevel: 'se_gradeLevels',
      board: 'se_boards'
    };
  } 

  public mapCategories({ filters = {}, groupByKey = 'subject' }) {
    if (_.toLower(groupByKey) === 'subject') return filters;
    return _.reduce(filters, (acc, value, key) => {
      const mappedValue = _.get(this.getCategoriesMapping, [key]);
      if (mappedValue) { acc[mappedValue] = value; delete acc[key]; }
      return acc;
    }, filters);
  }
}
