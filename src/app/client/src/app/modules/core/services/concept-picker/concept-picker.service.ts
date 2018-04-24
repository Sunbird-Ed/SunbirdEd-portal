import { SearchService } from './../search/search.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { SearchParam } from '@sunbird/core';
import { ServerResponse } from '@sunbird/shared';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';
@Injectable()
export class ConceptPickerService {
  private searchService: SearchService;
  /**
   * BehaviorSubject Containing user profile.
   */
  private _conceptData$ = new BehaviorSubject<any>(undefined);
  /**
   * Read only observable Containing user profile.
   */
  public readonly conceptData$: Observable<any> = this._conceptData$.asObservable();
  /**
   * concepts list
   */
  concepts = [];
  apiCall = true;
  /**
    * Constructor to create injected service(s) object
    * @param {SearchService} searchService Reference of SearchService
  */
  constructor(searchService: SearchService) {
    this.searchService = searchService;
  }
  public initialize() {
    if (this.apiCall === true) {
       this.getConcept(0, 200);
    }
  }
  /**
  * call search api with objectType =['Concept']
  */
  getConcept(offset, limit) {
    const searchParams = {
      filters: {
        objectType: ['Concept']
      },
      offset: offset,
      limit: limit
    };
    this.searchService.compositeSearch(searchParams).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse.result && _.isArray(apiResponse.result.concepts)) {
          _.forEach(apiResponse.result.concepts, (value) => {
            this.concepts.push(value);
          });
          if ((apiResponse.result.count > offset) && apiResponse.result.count > (offset + limit)) {
            offset += limit;
            limit = apiResponse.result.count - limit;
            this.getConcept(offset, limit);
          } else {
            this.loadDomains();
          }
        }
      }
    );
  }
  /**
  * call search api with objectType: ['Dimension', 'Domain']
  */

  loadDomains() {
    const domains = [];
    const searchParams = {
      filters: {
        objectType: ['Dimension', 'Domain']
      }
    };
    this.searchService.compositeSearch(searchParams).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse.result && _.isArray(apiResponse.result.domains)) {
          _.forEach(apiResponse.result.domains, (value) => {
            const domain = {};
            domain['id'] = value['identifier'];
            domain['name'] = value['name'];
            const domainChild = [];
            _.forEach(this.getChild(value['identifier']
              , apiResponse.result.dimensions),
              (val) => {
                const dimension = {};
                dimension['id'] = val['id'];
                dimension['name'] = val['name'];
                dimension['nodes'] = this.getChild(val.id, this.concepts);
                domainChild.push(dimension);
              });
            domain['nodes'] = domainChild;
            domains.push(domain);
          });
          this._conceptData$.next({ err: null, data: domains });
          this.apiCall = false;
        }
      }
    );
  }
  /**
   *  Get child recursively
   */
  getChild(id, resp) {
    const childArray = [];
    _.forEach(resp, (value) => {
      if (value.parent !== undefined) {
        if (value.parent[0] === id) {
          const child = {};
          child['id'] = value['identifier'];
          child['name'] = value['name'];
          child['selectable'] = 'selectable';
          child['nodes'] = this.getChild(value.identifier, resp);
          childArray.push(child);
        }
      }
    });
    return _.uniqBy(childArray, 'id');
  }

  getObjectById(id, concepts, found) {
    concepts.forEach((value) => {
      if (id === value['id']) {
        found.push({ id: value['id'], name: value['name'] });
      } else if (value['nodes'].length > 0) {
        this.getObjectById(id, value['nodes'], found);
      } else {
      }
    });
  }

}
