import { ConfigService, ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from '@sunbird/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.css']
})

export class UserFilterComponent implements OnInit {
  queryParams: any;
  /**
   * To get url, app configs
   */
  public config: ConfigService;
  public resourceService: ResourceService;
  private searchService: SearchService;
  private activatedRoute: ActivatedRoute;
  /**
   * To navigate to other pages
   */
  private router: Router;
  searchGrades: Array<string>;
  searchMediums: Array<string>;
  searchSubjects: Array<string>;
  searchRoles: Array<string>;
  label: any;
  refresh = true;
  isAccordianOpen = false;
  /**
    * Constructor to create injected service(s) object
    Default method of Draft Component class
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService, private cdr: ChangeDetectorRef,
    resourceService: ResourceService, router: Router, activatedRoute: ActivatedRoute) {
    this.config = config;
    this.resourceService = resourceService;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.router.onSameUrlNavigation = 'reload';
  }

  removeFilterSelection(filterType, value) {
    const itemIndex = this.queryParams[filterType].indexOf(value);
    if (itemIndex !== -1) {
      this.queryParams[filterType].splice(itemIndex, 1);
    }
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  applyFilters() {
    const queryParams = {};
    _.forIn(this.queryParams, (value, key) => {
      if (value.length > 0) {
        queryParams[key] = value;
      }
    });
    this.router.navigate(['/search/Users', 1], { queryParams: queryParams });
  }

  resetFilters() {
    this.queryParams = {};
    this.router.navigate(['/search/Users', 1]);
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  setFilters() {
    _.forIn(this.queryParams, (value, key) => {
      if (typeof value === 'string' && key !== 'Location' && key !== 'key') {
        this.queryParams[key] = [value];
      }
    });

    // To keep filter accordian open
    const queryParamData = { ... this.queryParams };
    delete queryParamData['key'];
    if (!_.isEmpty(queryParamData)) {
      this.isAccordianOpen = true;
    }

    this.queryParams = { ...this.config.dropDownConfig.FILTER.SEARCH.Users.DROPDOWN, ...this.queryParams };
    this.searchGrades = this.config.dropDownConfig.COMMON.grades;
    this.searchMediums = this.config.dropDownConfig.COMMON.medium;
    this.searchSubjects = this.config.dropDownConfig.FILTER.RESOURCES.subjects;
    this.searchRoles = this.config.dropDownConfig.FILTER.RESOURCES.roles;
    this.label = this.config.dropDownConfig.FILTER.SEARCH.Users.label;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = { ...params };
      this.setFilters();
    });
  }
}
