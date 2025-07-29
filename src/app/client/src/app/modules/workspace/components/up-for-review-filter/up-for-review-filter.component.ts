import { Subject, of, Subscription} from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ConfigService, UtilService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { debounceTime, distinctUntilChanged, delay, flatMap } from 'rxjs/operators';
import { IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-up-for-review-filter',
  templateUrl: './up-for-review-filter.component.html',
  styleUrls: ['./up-for-review-filter.component.scss']
})
export class UpforReviewFilterComponent implements OnInit, OnDestroy {
  modelChanged: Subject<string> = new Subject<string>();
  private languageSubscription: Subscription;
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
   * reference of UtilService.
   */
  public utilService: UtilService;
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
  filterIntractEdata: IInteractEventEdata;
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
    route: Router, utilService: UtilService) {
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.config = config;
    this.position = 'bottom right';
    this.route.onSameUrlNavigation = 'reload';
    this.label = this.config.dropDownConfig.FILTER.WORKSPACE.label;
    this.utilService = utilService;
    this.updateSortingOptions();
  }

  private updateSortingOptions() {
    const language = localStorage.getItem('portalLanguage') || 'ar';
    this.sortingOptions = this.utilService.updateDataWithI18n(this.config.dropDownConfig.FILTER.RESOURCES.upForReviewSortingOptions, language);
  }

  ngOnInit() {
    this.filterType = this.config.appConfig.upForReview.filterType;
    this.redirectUrl = this.config.appConfig.upForReview.inPageredirectUrl;
    
    this.languageSubscription = this.resourceService.languageSelected$.subscribe((language) => {
      if (language) {
        this.updateSortingOptions();
      }
    });
    
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.queryParams = { ...params };
        this.query = this.queryParams['query'];
        this.sortByOption = _.isArray(this.queryParams['sort_by']) ? this.queryParams['sort_by'][0] : this.queryParams['sort_by'];
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
      this.filterIntractEdata = {
        id: 'filter',
        type: 'click',
        pageid: 'up-for-review-page'
      };
  }
  public handleSearch() {
    if (this.query.length > 0) {
      this.queryParams['query'] = this.query;
    } else {
      delete this.queryParams['query'];
    }
    this.route.navigate(['workspace/content/upForReview', 1], { queryParams: this.queryParams});
  }
  keyup(event) {
    this.query = event;
    this.modelChanged.next(this.query);
  }

  ngOnDestroy() {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
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
