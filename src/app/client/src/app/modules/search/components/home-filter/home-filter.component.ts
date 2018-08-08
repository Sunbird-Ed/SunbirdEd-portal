import { IHomeQueryParams } from './../../interfaces';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, ConceptPickerService } from '@sunbird/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-home-filter',
  templateUrl: './home-filter.component.html',
  styleUrls: ['./home-filter.component.css']
})

export class HomeFilterComponent implements OnInit {
  /**
   * To get url, app configs
   */
  public config: ConfigService;
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;
  /**
 * To call searchService which helps to use list of courses
 */
  private searchService: SearchService;
  /**
   * To navigate to other pages
   */
  private router: Router;
  searchBoards: Array<string>;
  searchLanguages: Array<string>;
  searchSubjects: Array<string>;
  label: Array<string>;
  selectedConcepts: Array<object>;
  refresh = true;
  queryParams: IHomeQueryParams;
  showFilter = false;
  isAccordianOpen = false;
  showConcepts = false;

  /**
    * Constructor to create injected service(s) object
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService,
    resourceService: ResourceService, router: Router, private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef, public conceptPickerService: ConceptPickerService) {
    this.config = config;
    this.resourceService = resourceService;
    this.router = router;
    this.router.onSameUrlNavigation = 'reload';
    this.label = this.config.dropDownConfig.FILTER.SEARCH.All.label;
  }
  /**
   * to get selected concepts from concept picker.
   */
  concepts(events) {
    this.queryParams['Concepts'] = events;
  }
  /**
   * To check filterType.
   */
  isObject(val) { return typeof val === 'object'; }
  /**
   * remove selected values.
   */
  removeFilterSelection(filterType, value) {
    const itemIndex = this.queryParams[filterType].indexOf(value);
    if (itemIndex !== -1) {
      this.queryParams[filterType].splice(itemIndex, 1);
      this.refresh = false;
      this.cdr.detectChanges();
      this.refresh = true;
    }
  }
  /**
   * apply selected values.
   */
  applyFilters() {
    const queryParams = {};
    _.forIn(this.queryParams, (value, key) => {
      if (value.length > 0) {
        if (key === 'Concepts') {
          queryParams[key] = [];
          value.forEach((conceptDetails) => {
            queryParams[key].push(conceptDetails.identifier);
          });
        } else {
          queryParams[key] = value;
        }
      }
    });
    this.router.navigate(['/search/All', 1], { queryParams: queryParams });
  }
  /**
   * reset selected values.
   */
  resetFilters() {
    if (this.queryParams['key']) {
      this.queryParams = _.pick(this.queryParams, 'key');
    } else {
      this.queryParams = {};
    }
    this.router.navigate(['/search/All', 1], { queryParams: this.queryParams });
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
  /**
  * seting initial filter values.
  */
  setFilters() {
    this.searchBoards = this.config.dropDownConfig.FILTER.RESOURCES.boards;
    this.searchLanguages = this.config.dropDownConfig.FILTER.RESOURCES.languages;
    this.searchSubjects = this.config.dropDownConfig.FILTER.RESOURCES.subjects;
    if (this.queryParams && this.queryParams.Concepts) {
      this.queryParams.Concepts = this.conceptPickerService.processConcepts(this.queryParams.Concepts, this.selectedConcepts);
    }
    this.showFilter = true;
    const queryParamData = { ... this.queryParams };
    delete queryParamData['key'];
    if (!_.isEmpty(queryParamData)) {
      this.isAccordianOpen = true;
    }
    this.queryParams = { ...this.config.dropDownConfig.FILTER.SEARCH.All.DROPDOWN, ...this.queryParams };
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.conceptPickerService.conceptData$.subscribe(conceptData => {
        if (conceptData && !conceptData.err) {
          this.selectedConcepts = conceptData.data;
          this.showConcepts = true;
        }
      });
      this.queryParams = { ...params };
      _.forIn(params, (value, key) => {
        if (typeof value === 'string' && key !== 'key') {
          this.queryParams[key] = [value];
        }
      });
      this.setFilters();
    });
  }
}
