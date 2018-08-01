import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash';
@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styles: [`
         >>> .ui.dropdown:not(.button)>.default.text {
              display: none;
           }
          .ui.inline.dropdown.search-dropdown {
              margin-left: 5px;
              box-sizing: border-box;
           }
       `]
})
export class SortByComponent implements OnInit {

  @Input() sortingOptions: Array<any>;
  @Input() url: string;
  sortByOption: string;
  /**
      * To navigate to other pages
      */
  route: Router;
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
  */
  private activatedRoute: ActivatedRoute;
  /**
   * To call resource service which helps to use language constant
   */
  public resourceService: ResourceService;
  /**
    * To show / hide sortIcon
   */
  sortIcon = true;
  queryParams: any;
  constructor(resourceService: ResourceService, activatedRoute: ActivatedRoute, route: Router) {
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.queryParams = { ...params };
        const checkSortByType = this.queryParams['sort_by'] instanceof Array;
        if (this.queryParams['sort_by'] && !checkSortByType ) {
          const options = this.sortingOptions.find(o => o.field === this.queryParams['sort_by']);
          this.sortByOption = options.field;
        } else if (this.queryParams['sort_by'] && checkSortByType ) {
          const options = this.sortingOptions.find(o => o.field === this.queryParams['sort_by'].toString());
          this.sortByOption = options.field;
        } else {
          this.sortByOption = '';
        }
      });
  }

  applySorting() {
    this.sortIcon = !this.sortIcon;
    this.queryParams['sortType'] = this.sortIcon ? 'desc' : 'asc';
    this.queryParams['sort_by'] = this.sortByOption;
    this.route.navigate([this.url], { queryParams: this.queryParams });
  }

}
