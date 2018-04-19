import { ConfigService, ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '@sunbird/core';
import { OrgTypeService } from '@sunbird/org-management';
import * as _ from 'lodash';

@Component({
  selector: 'app-org-filter',
  templateUrl: './org-filter.component.html',
  styleUrls: ['./org-filter.component.css']
})
export class OrgFilterComponent implements OnInit {
  @Input() queryParams: any;
  @Output('filter')
  filter = new EventEmitter<any>();

  public config: ConfigService;
  public resourceService: ResourceService;
  private searchService: SearchService;
  private orgTypeService: OrgTypeService;
  private cdr: ChangeDetectorRef;
  private router: Router;
  searchOrgType: Array<string>;
  label: Array<string>;
  refresh = true;
  /**
    * Constructor to create injected service(s) object
    Default method of Draft Component class
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService, orgTypeService: OrgTypeService,
    resourceService: ResourceService, router: Router, cdr: ChangeDetectorRef) {
    this.config = config;
    this.orgTypeService = orgTypeService;
    this.resourceService = resourceService;
    this.router = router;
    this.cdr = cdr;
  }

  removeFilterSelection(filterType, value) {
    const itemIndex = this.queryParams[filterType].indexOf(value);
    if (itemIndex !== -1) {
      this.queryParams[filterType].splice(itemIndex, 1);
      this.refresh = false;
      this.cdr.detectChanges();
      this.refresh = true;
    }
  }

  applyFilters() {
    const queryParams = {};
    _.forIn(this.queryParams, (value, key) => {
      if (value.length > 0) {
        queryParams[key] = value;
      }
    });
    this.router.navigate(['/search/Organisations', 1], { queryParams: queryParams });
  }

  resetFilters() {
    this.queryParams = {};
    this.router.navigate(['/search/Organisations', 1]);
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  setFilters() {
    _.forIn(this.queryParams, (value, key) => {
      if (typeof value === 'string') {
        this.queryParams[key] = [value];
      }
    });
    this.queryParams = { ...this.config.dropDownConfig.FILTER.SEARCH.Organisations.DROPDOWN, ...this.queryParams };
    this.label = this.config.dropDownConfig.FILTER.SEARCH.Organisations.label;
    this.orgTypeService.getOrgTypes();
    this.orgTypeService.orgTypeData$.subscribe((apiResponse) => {
      if (apiResponse && apiResponse.orgTypeData) {
        this.searchOrgType = apiResponse.orgTypeData.result.response;
      }
    });
  }

  ngOnInit() {
    this.setFilters();
  }
}
