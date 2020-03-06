import { Injectable } from '@angular/core';
import { OrgDetailsService, FrameworkService, ChannelService } from '@sunbird/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { skipWhile, mergeMap, first } from 'rxjs/operators';
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
  get searchResults$(): Observable<any[]>  {
    return this._searchResults$.asObservable()
    .pipe(skipWhile(data => data === undefined || data === null));
  }

  constructor( public frameworkService: FrameworkService, private orgDetailsService: OrgDetailsService,
    private channelService: ChannelService) { }

  public initialize(channelId: string, custodianOrg = false, defaultBoard: string) {
    this.channelId = channelId;
    this.custodianOrg = custodianOrg;
    this.defaultBoard = defaultBoard;
    console.log('content search initialize', channelId, custodianOrg, defaultBoard);
    this._filterData$.complete(); // to flush old subscription
    this._searchResults$.complete(); // to flush old subscription
    this._searchResults$ = new BehaviorSubject<any>(undefined);
    this._filterData$ = new BehaviorSubject<any>(undefined);
    this.fetchFilters();
  }
  private fetchFilters() {
    this.channelService.getFrameWork(this.channelId)
      .pipe(mergeMap((channelDetails) => {
        if (this.custodianOrg) {
          this.filters.board = _.get(channelDetails, 'result.channel.frameworks');
          const selectedBoard = this.filters.board.find((board) => board.name === this.defaultBoard);
          this.frameworkId = _.get(selectedBoard, 'identifier');
        } else {
          this.frameworkId = _.get(channelDetails, 'result.channel.defaultFramework');
        }
        return this.frameworkService.getFrameworkCategories(this.frameworkId);
      }), first())
      .subscribe(frameworkDetails => {
        const frameworkCategories: any[] = _.get(frameworkDetails, 'result.framework.categories');
        if (frameworkCategories) {
          frameworkCategories.forEach(category => {
            if (['medium', 'gradeLevel', 'subject'].includes(category.code)) {
              this.filters[category.code] = category.terms;
            } else if (category.code === 'board' && !this.custodianOrg) {
              this.filters[category.code] = category.terms;
            }
          });
          this._filterData$.next({data: _.cloneDeep(this.filters)});
        } else {
          this._filterData$.next({error: new Error('FRAMEWORK_CATEGORY_NOT_FOUND')});
        }
      }, (error) => {
        this._filterData$.next({error: error});
      });
  }
  public boardChanged(boardId) {
    if (!this.custodianOrg) {
      return ;
    }
    this.frameworkId = boardId;
    this.frameworkService.getFrameworkCategories(this.frameworkId).pipe(first())
    .subscribe(frameworkDetails => {
      const frameworkCategories: any[] = _.get(frameworkDetails, 'result.framework.categories');
      if (frameworkCategories) {
        frameworkCategories.forEach(category => {
          if (['medium', 'gradeLevel', 'subject'].includes(category.code)) {
            this.filters[category.code] = category.terms;
          } else if (category.code === 'board' && !this.custodianOrg) {
            this.filters[category.code] = category.terms;
          }
        });
        this._filterData$.next({data: _.cloneDeep(this.filters)});
      } else {
        this._filterData$.next({error: new Error('FRAMEWORK_CATEGORY_NOT_FOUND')});
      }
    }, (error) => {
      this._filterData$.next({error: error});
    });
  }
}
