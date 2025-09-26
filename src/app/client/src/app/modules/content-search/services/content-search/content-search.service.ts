import { Injectable } from '@angular/core';
import { FrameworkService, ChannelService } from '@sunbird/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { skipWhile, mergeMap, first, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

interface FrameworkCategory {
  code: string;
}
@Injectable({ providedIn: 'root' })
export class ContentSearchService {
  private channelId: string;
  public _frameworkId = '';
  get frameworkId() {
    return this._frameworkId;
  }
  private defaultBoard: string;
  private custodianOrg: boolean;
  private _filters: any = {};
  public filters: any = {};
  requiredCategories: any;
  private _searchResults$ = new BehaviorSubject<any>(undefined);
  public frameworkCategories;
  public frameworkCategoriesObject;
  public globalFilterCategories;
  get searchResults$(): Observable<any[]> {
    return this._searchResults$.asObservable()
      .pipe(skipWhile(data => data === undefined || data === null));
  }

  constructor(private frameworkService: FrameworkService, private channelService: ChannelService, private cslFrameworkService: CslFrameworkService) { 
    this.frameworkCategories = this.cslFrameworkService.getFrameworkCategories();
    this.frameworkCategoriesObject = this.cslFrameworkService.getFrameworkCategoriesObject();
    
    Object.values(this.frameworkCategories || {}).forEach((category: any) => {
      if (category?.code) {
        this._filters[category.code] = [];
      }
    });
    this._filters['publisher'] = [];
    
    this.requiredCategories = {
      categories: Object.values(this.frameworkCategories || {})
        .map((category: any) => category?.code)
        .filter(Boolean)
        .join(',')
    };
  }

  public initialize(channelId: string, custodianOrg = false, defaultBoard: string) {
    this.channelId = channelId;
    this.custodianOrg = custodianOrg;
    this.defaultBoard = defaultBoard;
    this._searchResults$.complete(); // to flush old subscription
    this._searchResults$ = new BehaviorSubject<any>(undefined);
    return this.fetchChannelData();
  }
  fetchChannelData() {

    this.requiredCategories = {
      categories: Object.values<FrameworkCategory>(this.frameworkCategories || {})
        .map((category) => category?.code)
        .filter(Boolean)
        .join(',')
    };
    
    return this.channelService.getFrameWork(this.channelId)
      .pipe(mergeMap((channelDetails) => {
        if (this.custodianOrg) {
          const firstCategoryCode = Object.values<FrameworkCategory>(this.frameworkCategories || {})[0]?.code;
          if (firstCategoryCode) {
            this._filters[firstCategoryCode] = _.get(channelDetails, 'result.channel.frameworks') || [{
              name: _.get(channelDetails, 'result.channel.defaultFramework'),
              identifier: _.get(channelDetails, 'result.channel.defaultFramework')
            }]; 
            const selectedBoard = this._filters[firstCategoryCode].find((category: any) => 
              category.name === this.defaultBoard
            ) || this._filters[firstCategoryCode][0];
            this._frameworkId = _.get(selectedBoard, 'identifier');
          }
        } else {
          this._frameworkId = _.get(channelDetails, 'result.channel.defaultFramework');
        }
        if (_.get(channelDetails, 'result.channel.publisher')) {
          this._filters.publisher = JSON.parse(_.get(channelDetails, 'result.channel.publisher'));
        }
        return this.frameworkService.getSelectedFrameworkCategories(this._frameworkId, this.requiredCategories);
      }), map(frameworkDetails => {
        const frameworkCategories: any[] = _.get(frameworkDetails, 'result.framework.categories');
        const allCategoryCodes = Object.values<FrameworkCategory>(this.frameworkCategories || {}).map(c => c.code);
        const firstCategoryCode = allCategoryCodes[0];
        const otherCategoryCodes = allCategoryCodes.slice(1);
        
        frameworkCategories.forEach(category => {
          if (otherCategoryCodes.includes(category.code)) {
            this._filters[category.code] = category.terms || [];
          } else if (!this.custodianOrg && category.code === firstCategoryCode) {
            this._filters[category.code] = category.terms || [];
          }
        });
        return true;
      }), first());
  }
  public fetchFilter(boardName?) {
    this.filters = _.cloneDeep(this._filters);
    if (!this.custodianOrg || !boardName) {
      return of(this.filters);
    }
    
    const firstCategoryCode = Object.values<FrameworkCategory>(this.frameworkCategories || {})[0]?.code;
    if (!firstCategoryCode) {
      return of(this.filters);
    }
    
    const selectedBoard = this._filters[firstCategoryCode]?.find((fwCategory: any) => fwCategory.name === boardName) ||
      this._filters[firstCategoryCode]?.find((fwCategory: any) => fwCategory.name === this.defaultBoard) ||
      (this._filters[firstCategoryCode]?.[0] || {});
      
    this._frameworkId = _.get(selectedBoard, 'identifier');
    
    return this.frameworkService.getSelectedFrameworkCategories(this._frameworkId, this.requiredCategories).pipe(map(frameworkDetails => {
      const frameworkCategories: any[] = _.get(frameworkDetails, 'result.framework.categories');
      const allCategoryCodes = Object.values<FrameworkCategory>(this.frameworkCategories || {}).map(c => c.code);
      const firstCategoryCode = allCategoryCodes[0];
      const otherCategoryCodes = allCategoryCodes.slice(1);
      
      frameworkCategories.forEach(category => {
        if (otherCategoryCodes.includes(category.code)) {
          this._filters[category.code] = category.terms || [];
        } else if (category.code === firstCategoryCode && !this.custodianOrg) {
          this._filters[category.code] = category.terms || [];
        }
      });
      return this.filters;
    }), first());
  }

  get getCategoriesMapping() {
    this.globalFilterCategories = this.cslFrameworkService.getAlternativeCodeForFilter();
    const mapping = {};
    
    const categories = Object.values<FrameworkCategory>(this.frameworkCategories || {});
    
    categories.forEach((category, index) => {
      if (category?.code && this.globalFilterCategories[index] !== undefined) {
        mapping[category.code] = this.globalFilterCategories[index];
      }
    });
    
    return mapping;
  }

  public mapCategories({ filters = {} }) {
    const mapping = this.getCategoriesMapping;
    const categories = Object.values<FrameworkCategory>(this.frameworkCategories || {});
    const lastCategoryCode = categories[categories.length - 1]?.code;
    
    return _.reduce(filters, (acc, value, key) => {
      const mappedValue = mapping[key];
      if (mappedValue && key !== lastCategoryCode) { 
        acc[mappedValue] = value; 
        delete acc[key]; 
      }
      return acc;
    }, { ...filters });
  }
}