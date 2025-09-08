import { Injectable } from '@angular/core';
import { FrameworkService, ChannelService } from '@sunbird/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { skipWhile, mergeMap, first, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
@Injectable({ providedIn: 'root' })
export class ContentSearchService {
  private channelId: string;
  public _frameworkId = '';
  get frameworkId() {
    return this._frameworkId;
  }
  private defaultBoard: string;
  private custodianOrg: boolean;
  private _filters: { [key: string]: any[] } = { publisher: [] };
  private _frameworkCategoryCodes: string[] = [];
  
  get filters() {
    return _.cloneDeep(this._filters);
  }
  
  get frameworkCategoryCodes(): string[] {
    return [...this._frameworkCategoryCodes];
  }
  
  requiredCategories = { categories: '' };
  private _searchResults$ = new BehaviorSubject<any>(undefined);
  public frameworkCategories;
  public frameworkCategoriesObject;
  public globalFilterCategories;
  get searchResults$(): Observable<any[]> {
    return this._searchResults$.asObservable()
      .pipe(skipWhile(data => data === undefined || data === null));
  }

  constructor(private frameworkService: FrameworkService, private channelService: ChannelService, private cslFrameworkService:CslFrameworkService) { 
    this.frameworkCategories = this.cslFrameworkService.getFrameworkCategories();
    this.frameworkCategoriesObject = this.cslFrameworkService.getFrameworkCategoriesObject();
    
    this._frameworkCategoryCodes = this.cslFrameworkService.getAllFwCatName();
    this.requiredCategories.categories = this._frameworkCategoryCodes.join(',');
    
    this._frameworkCategoryCodes.forEach(category => {
      this._filters[category] = [];
    });
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
    this.requiredCategories = { categories: this._frameworkCategoryCodes.join(',') };
    return this.channelService.getFrameWork(this.channelId)
      .pipe(mergeMap((channelDetails) => {
        if (this.custodianOrg) {
          this._filters[this.frameworkCategories?.fwCategory1?.code] = _.get(channelDetails, 'result.channel.frameworks') || [{
            name: _.get(channelDetails, 'result.channel.defaultFramework'),
            identifier: _.get(channelDetails, 'result.channel.defaultFramework')
          }]; // framework array is empty assigning defaultFramework as only board
          const selectedBoard = this._filters[this.frameworkCategories?.fwCategory1?.code].find((fwCategory1) => fwCategory1.name === this.defaultBoard) || this._filters[this.frameworkCategories?.fwCategory1?.code][0];
          this._frameworkId = _.get(selectedBoard, 'identifier');
        } else {
          this._frameworkId = _.get(channelDetails, 'result.channel.defaultFramework');
        }
        if (_.get(channelDetails, 'result.channel.publisher')) {
          this._filters.publisher = JSON.parse(_.get(channelDetails, 'result.channel.publisher'));
        }
        return this.frameworkService.getSelectedFrameworkCategories(this._frameworkId, this.requiredCategories);
      }), map(frameworkDetails => {
        const frameworkCategories: any[] = _.get(frameworkDetails, 'result.framework.categories');
        const firstCategoryCode = this._frameworkCategoryCodes[0];
        const otherCategoryCodes = this._frameworkCategoryCodes.slice(1);
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
    if (!this.custodianOrg || !boardName) {
      return of(this.filters);
    }
    const selectedBoard = this._filters[this.frameworkCategories?.fwCategory1?.code].find((fwCategory1) => fwCategory1.name === boardName)
      || this._filters[this.frameworkCategories?.fwCategory1?.code].find((fwCategory1) => fwCategory1.name === this.defaultBoard) || this._filters[this.frameworkCategories?.fwCategory1?.code][0];
    this._frameworkId = this._frameworkId = _.get(selectedBoard, 'identifier');
    return this.frameworkService.getSelectedFrameworkCategories(this._frameworkId, this.requiredCategories).pipe(map(frameworkDetails => {
      const frameworkCategories: any[] = _.get(frameworkDetails, 'result.framework.categories');
      const firstCategoryCode = this._frameworkCategoryCodes[0];
      const otherCategoryCodes = this._frameworkCategoryCodes.slice(1);
      
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
    
    this._frameworkCategoryCodes.forEach((code, index) => {
      const reverseIndex = this._frameworkCategoryCodes.length - 1 - index;
      mapping[code] = this.globalFilterCategories[reverseIndex];
    });
    
    return mapping;
  }

  public mapCategories({ filters = {} }) {
    const categoriesMapping = this.getCategoriesMapping;
    const lastCategoryCode = this._frameworkCategoryCodes[this._frameworkCategoryCodes.length - 1];
    
    return _.reduce(filters, (acc, value, key) => {
      const mappedValue = categoriesMapping[key];
      if (mappedValue && key !== lastCategoryCode) {
        acc[mappedValue] = value;
        delete acc[key];
      }
      return acc;
    }, { ...filters });
  }
}
