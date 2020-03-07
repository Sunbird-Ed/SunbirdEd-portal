import { Injectable, EventEmitter } from '@angular/core';
import { OrgDetailsService, FrameworkService, ChannelService } from '@sunbird/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { skipWhile, mergeMap, first, map } from 'rxjs/operators';
import * as _ from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class ContentSearchService {

  private _filterData$ = new BehaviorSubject<any>(undefined);
  get filterData$(): Observable<any> {
    return this._filterData$.asObservable()
      .pipe(skipWhile(data => data === undefined || data === null));
  }
  private channelId: string;
  public frameworkId = '';
  private defaultBoard: string;
  private custodianOrg: boolean;
  private filters = {
    board: [],
    medium: [],
    gradeLevel: [],
    subject: []
  };
  private _searchResults$ = new BehaviorSubject<any>(undefined);
  get searchResults$(): Observable<any[]> {
    return this._searchResults$.asObservable()
      .pipe(skipWhile(data => data === undefined || data === null));
  }

  constructor(public frameworkService: FrameworkService, private orgDetailsService: OrgDetailsService,
    private channelService: ChannelService) { }

  public initialize(channelId: string, custodianOrg = false, defaultBoard: string) {
    this.channelId = channelId;
    this.custodianOrg = custodianOrg;
    this.defaultBoard = defaultBoard;
    this._filterData$.complete(); // to flush old subscription
    this._searchResults$.complete(); // to flush old subscription
    this._searchResults$ = new BehaviorSubject<any>(undefined);
    this._filterData$ = new BehaviorSubject<any>(undefined);
    return this.fetchChannelData();
  }
  fetchChannelData() {
    return this.channelService.getFrameWork(this.channelId)
    .pipe(mergeMap((channelDetails) => {
      if (this.custodianOrg) {
        this.filters.board = _.get(channelDetails, 'result.channel.frameworks') || [{
          name: _.get(channelDetails, 'result.channel.defaultFramework'),
          identifier: _.get(channelDetails, 'result.channel.defaultFramework')
        }]; // framework array is empty assigning defaultFramework as only board
        this.pushDummyBoard();
        const selectedBoard = this.filters.board.find((board) => board.name === this.defaultBoard) || this.filters.board[0];
        this.frameworkId = _.get(selectedBoard, 'identifier');
      } else {
        this.frameworkId = _.get(channelDetails, 'result.channel.defaultFramework');
      }
      return this.frameworkService.getFrameworkCategories(this.frameworkId);
    }), map(frameworkDetails => {
      const frameworkCategories: any[] = _.get(frameworkDetails, 'result.framework.categories');
      frameworkCategories.forEach(category => {
        if (['medium', 'gradeLevel', 'subject'].includes(category.code)) {
          this.filters[category.code] = category.terms || [];
        } else if (!this.custodianOrg && category.code === 'board') {
          this.filters[category.code] = category.terms || [];
        }
      });
      return true;
    }), first());
  }
  pushDummyBoard() {
    this.filters.board.push({
      identifier: 'NCF',
      code: 'NCF',
      name: 'NCF framework',
      description: ' NCF framework...',
      type: 'K-12',
      objectType: 'Framework'
    });
  }
  public fetchFilter(boardName?) {
    if (!this.custodianOrg || !boardName) {
      return of(_.cloneDeep(this.filters));
    }
    const selectedBoard = this.filters.board.find((board) => board.name === boardName)
      || this.filters.board.find((board) => board.name === this.defaultBoard) || this.filters.board[0];
    this.frameworkId = this.frameworkId = _.get(selectedBoard, 'identifier');
    return this.frameworkService.getFrameworkCategories(this.frameworkId).pipe(map(frameworkDetails => {
      const frameworkCategories: any[] = _.get(frameworkDetails, 'result.framework.categories');
      frameworkCategories.forEach(category => {
        if (['medium', 'gradeLevel', 'subject'].includes(category.code)) {
          this.filters[category.code] = category.terms || [];
        } else if (category.code === 'board' && !this.custodianOrg) {
          this.filters[category.code] = category.terms || [];
        }
      });
      return _.cloneDeep(this.filters);
    }), first());
  }
}
