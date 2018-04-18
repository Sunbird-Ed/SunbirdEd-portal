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
  /**
   * To get url, app configs
   */
  public config: ConfigService;
  private resourceService: ResourceService;
  private searchService: SearchService;
  private orgTypeService: OrgTypeService;
  /**
   * To navigate to other pages
   */
  private router: Router;
  searchOrgType: Array<string>;
  label: any;
  refresh = true;
  /**
    * Constructor to create injected service(s) object
    Default method of Draft Component class
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService, orgTypeService: OrgTypeService,
    resourceService: ResourceService, router: Router,  private cdr: ChangeDetectorRef) {
    this.config = config;
    this.orgTypeService = orgTypeService;
    this.resourceService = resourceService;
    this.router = router;
  }

  removeFilterSelection(filterType, value) {
    this.refresh = false;
    if (filterType === 'selectedConcepts') {
    // for concept picker
    } else {
      const itemIndex = this.queryParams[filterType].indexOf(value);
      if (itemIndex !== -1) {
        console.log(this.queryParams[filterType], value);
        this.queryParams[filterType].splice(itemIndex, 1);
        console.log(this.queryParams[filterType]);
       // this.cdr.detectChanges();
      }
    }
   /// this.appRef.tick();
    setTimeout(() => {
      this.refresh = true;
    }, 0);
  }

  applyFilters() {
    this.filter.emit(this.queryParams);
  }

  resetFilters() {
    this.refresh = false;
    this.queryParams = {};
    this.router.navigate(['/search/Organisations', 1]);
    setTimeout(() => {
      this.refresh = true;
    }, 0);
  }
  ngOnInit() {
    _.forIn(this.queryParams, (value, key) => {
      if (typeof value === 'string') {
        this.queryParams[key] = [value];
      }
    });
    this.queryParams = { ...this.config.dropDownConfig.FILTER.SEARCH.Organisations.DROPDOWN, ...this.queryParams };
    console.log(this.queryParams);

    this.label = this.config.dropDownConfig.FILTER.SEARCH.Organisations.label;


this.orgTypeService.getOrgTypes();
    this.orgTypeService.orgTypeData$.subscribe((apiResponse) => {
      if (apiResponse && apiResponse.orgTypeData) {
        console.log('apiResponse', apiResponse);

this.searchOrgType = apiResponse.orgTypeData.result.response;


      } else if (apiResponse && apiResponse.err) {

      }
    });


  }

}

