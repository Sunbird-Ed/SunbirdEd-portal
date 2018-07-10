import { ConfigService, ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from '@sunbird/core';
import { OrgTypeService } from '@sunbird/org-management';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-org-filter',
  templateUrl: './org-filter.component.html',
  styleUrls: ['./org-filter.component.css']
})
export class OrgFilterComponent implements OnInit {
  queryParams: any;

  public config: ConfigService;
  public resourceService: ResourceService;
  private searchService: SearchService;
  private orgTypeService: OrgTypeService;
  private cdr: ChangeDetectorRef;
  private router: Router;
  searchOrgType: Array<string>;
  label: Array<string>;
  refresh = true;
  isAccordianOpen = false;
  /**
    * Constructor to create injected service(s) object
    Default method of Draft Component class
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService, orgTypeService: OrgTypeService,
    resourceService: ResourceService, router: Router, cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute) {
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
      queryParams[key] = [];
      if (value.length > 0 && key === 'key') {
        queryParams[key] = value;
      } else if (value.length > 0) {
        value.forEach((orgDetails) => {
          queryParams[key].push(orgDetails.id);
        });
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
    this.label = this.config.dropDownConfig.FILTER.SEARCH.Organisations.label;
    this.orgTypeService.orgTypeData$.subscribe((apiResponse) => {
      if (apiResponse && apiResponse.orgTypeData) {
        this.searchOrgType = apiResponse.orgTypeData.result.response;
        const OrgType = [];
        if (this.queryParams.OrgType) {
          this.queryParams.OrgType.forEach((orgId) => {
            this.searchOrgType.forEach((orgDetails: any) => {
              if (orgDetails.id === orgId) {
                OrgType.push(orgDetails);
              }
            });
          });
          this.queryParams.OrgType = OrgType;
        }
        const queryParamData = { ... this.queryParams };
        delete queryParamData['key'];
        if (!_.isEmpty(queryParamData)) {
          this.isAccordianOpen = true;
        }
        this.queryParams = { ...this.config.dropDownConfig.FILTER.SEARCH.Organisations.DROPDOWN, ...this.queryParams };
      }
    });
  }

  ngOnInit() {
    this.orgTypeService.getOrgTypes();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = { ...params };
      _.forIn(this.queryParams, (value, key) => {
        if (typeof value === 'string' && key !== 'key') {
          this.queryParams[key] = [value];
        }
      });
      this.setFilters();
    });
  }
}
