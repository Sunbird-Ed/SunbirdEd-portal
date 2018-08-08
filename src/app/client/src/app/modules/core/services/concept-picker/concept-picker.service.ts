import { SearchService } from './../search/search.service';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SearchParam } from '@sunbird/core';
import { ServerResponse, ToasterService, ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
@Injectable()
export class ConceptPickerService {
  private searchService: SearchService;
  private toasterService: ToasterService;
  private resourceService: ResourceService;
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
  private _concepts = [];
  /**
    * Constructor to create injected service(s) object
    * @param {SearchService} searchService Reference of SearchService
  */
  constructor(searchService: SearchService, toasterService: ToasterService, resourceService: ResourceService,
    private cacheService: CacheService, private configService: ConfigService,  private browserCacheTtlService: BrowserCacheTtlService) {
    this.searchService = searchService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
  }
  public initialize() {
    const data: any | null = this.cacheService.get('concepts');
    if (data) {
      this._conceptData$.next({ err: null, data: data });
    } else {
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
        if (apiResponse.result && _.isArray(apiResponse.result.concepts) &&
        apiResponse.result.concepts.length > 0) {
          _.forEach(apiResponse.result.concepts, (value) => {
            this._concepts.push(value);
          });
          if ((apiResponse.result.count > offset) && apiResponse.result.count > (offset + limit)) {
            offset += limit;
            // limit = apiResponse.result.count - limit;
            this.getConcept(offset, limit);
          } else {
            this.loadDomains();
          }
        } else {
          this._conceptData$.next({ err: 'no result' , data: null });
        }
      },
      err => {
        this._conceptData$.next({ err: 'no result' , data: null });
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
                dimension['nodes'] = this.getChild(val.id, this._concepts);
                domainChild.push(dimension);
              });
            domain['nodes'] = domainChild;
            domains.push(domain);
          });
          this.cacheService.set('concepts', domains,
            {
              maxAge: this.browserCacheTtlService.browserCacheTtl
            });
          this._conceptData$.next({ err: null, data: domains });
        }
      },
      err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0015);
      }
    );
  }

  get concepts() {
    return  this._concepts;
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
  /**
   *  search concept by given id
   */
  searchConceptById(id, concepts, found) {
    _.forEach(concepts, (value) => {
      if (id === value['id']) {
        found.push({ identifier: value['id'], name: value['name'] });
      } else if (value['nodes'].length > 0) {
        this.searchConceptById(id, value['nodes'], found);
      }
    });
  }
  /**
   *  process Concepts data
   */
  processConcepts(query, concepts) {
    const found = [];
    _.forEach(query, (id) => {
      this.searchConceptById(id, concepts, found);
    });
    return found;
  }
}
