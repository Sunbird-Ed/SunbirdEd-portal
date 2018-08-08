import { Subject , Observable, of} from 'rxjs';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { ISelectFilter } from '../../interfaces/selectfilter';
import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged, delay, flatMap } from 'rxjs/operators';
@Component({
  selector: 'app-up-for-review-filter',
  templateUrl: './up-for-review-filter.component.html',
  styles: [`
     >>> .ui.dropdown:not(.button)>.default.text {
      display: none;
       }
      .ui.inline.dropdown.search-dropdown {
       margin-left: 5px;
       box-sizing: border-box;
       }
      .popup-content{
        width: 850px !important;
       }
   `]
})
export class UpforReviewFilterComponent implements OnInit {
  modelChanged: Subject<string> = new Subject<string>();
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
   * value typed
   */
  query: string;
  /**
   * upForReviewSortingOptions
  */
  sortingOptions: Array<string>;
  /**
    * To show / hide sortIcon
   */
  sortIcon = true;
  /**
    * position for the popup
  */
  position: string;
  /**
    * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;
  /**
  * To get url, app configs
  */
  public config: ConfigService;

  sortByOption: string;
  /**
  * type of filter
  */
  public filterType: any;
  /**
  * label for filter selected
  */
  label: Array<string>;
  /**
  * redirect url
  */
  public redirectUrl: string;
  queryParams: any;
  /**
   * Constructor to create injected service(s) object
   Default method of Draft Component class
   * @param {SearchService} SearchService Reference of SearchService
   * @param {UserService} UserService Reference of UserService
   * @param {Router} route Reference of Router
   * @param {PaginationService} paginationService Reference of PaginationService
   * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   * @param {ConfigService} config Reference of ConfigService
 */
  constructor(resourceService: ResourceService, config: ConfigService,
    activatedRoute: ActivatedRoute,
    route: Router) {
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.config = config;
    this.position = 'bottom right';
    this.route.onSameUrlNavigation = 'reload';
    this.label = this.config.dropDownConfig.FILTER.WORKSPACE.label;
    this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.upForReviewSortingOptions;
  }

  ngOnInit() {
    this.filterType = this.config.appConfig.upForReview.filterType;
    this.redirectUrl = this.config.appConfig.upForReview.inPageredirectUrl;
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.queryParams = { ...params };
        this.query = this.queryParams['query'];
        this.sortByOption = this.queryParams['sort_by'];
        _.forIn(params, (value, key) => {
          if (typeof value === 'string' && key !== 'query') {
            this.queryParams[key] = [value];
          }
        });
      });
    this.modelChanged.pipe(debounceTime(1000),
      distinctUntilChanged(),
      flatMap(search => of(search).pipe(delay(500)))
      ).
      subscribe(query => {
        this.query = query;
        this.handleSearch();
      });
  }
  public handleSearch() {
    if (this.query.length > 0) {
      this.queryParams['query'] = this.query;
    } else {
      delete this.queryParams['query'];
    }
    this.route.navigate(['workspace/content/upForReview', 1], { queryParams: this.queryParams });
  }
  keyup(event) {
    this.query = event;
    this.modelChanged.next(this.query);
  }

  applySorting(sortByOption) {
    this.sortIcon = !this.sortIcon;
    this.queryParams['sortType'] = this.sortIcon ? 'desc' : 'asc';
     this.queryParams['sort_by'] = sortByOption;
    this.route.navigate(['workspace/content/upForReview', 1], { queryParams: this.queryParams });
  }
  removeFilterSelection(filterType, value) {
    const itemIndex = this.queryParams[filterType].indexOf(value);
    if (itemIndex !== -1) {
      this.queryParams[filterType].splice(itemIndex, 1);
    }
    this.route.navigate(['workspace/content/upForReview', 1], { queryParams: this.queryParams  });
  }
}
