import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ConfigService, UtilService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Subject, of, Subscription} from 'rxjs';
import { debounceTime, distinctUntilChanged, delay, flatMap } from 'rxjs/operators';
import { IInteractEventEdata, IInteractEventInput, IInteractEventObject, IProducerData, TelemetryService } from '@sunbird/telemetry';
@Component({
  selector: 'app-collaboration-content-filter',
  templateUrl: './collaboration-content-filter.component.html',
  styleUrls: ['./collaboration-content-filter.component.scss']
})
export class CollaborationContentFilterComponent implements OnInit, OnDestroy {
  modelChanged: Subject<string> = new Subject<string>();
  private languageSubscription: Subscription;
  /**
   * To navigate to other pages
   */
  route: Router;
  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to collaboration  component
  */
  private activatedRoute: ActivatedRoute;
  /**
   * value typed
   */
  query: string;
  /**
   * SortingOptions
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
  * queryParams
  */
  queryParams: any;
  /**
  * Telemetry filterIntractEdata
  */
  filterIntractEdata: IInteractEventEdata;
  telemetryInteractEdata: any;
  appTelemetryInteractData: IInteractEventInput;

  public telemetryService: TelemetryService;

  @Input() telemetryInteractContext;
  @Input() telemetryInteractCdata: Array<{}>;
  @Input() telemetryInteractObject: IInteractEventObject;
  @Input() telemetryInteractPdata: IProducerData;

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
    route: Router, telemetryService: TelemetryService, utilService: UtilService) {
    this.telemetryService = telemetryService;
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
    this.sortingOptions = this.utilService.updateDataWithI18n(this.config.dropDownConfig.FILTER.RESOURCES.collaboratingOnSortingOptions, language);
  }

  ngOnInit() {
    this.filterType = this.config.appConfig.collaboration.filterType;
    
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
        pageid: 'collaboration-content-page'
      };
  }
  public handleSearch() {
    if (this.query.length > 0) {
      this.queryParams['query'] = this.query;
    } else {
      delete this.queryParams['query'];
    }
    this.setCollabartionContentSearchInteractEdata();
    this.route.navigate(['workspace/content/collaborating-on', 1], { queryParams: this.queryParams });
  }
  keyup(event) {
    this.query = event;
    this.modelChanged.next(this.query);
  }
  setCollabartionContentSearchInteractEdata() {
    const searchInteractEdata = {
      id: 'search-collabaration-content',
      type: 'click',
      pageid: 'collabratingon'
    };
    if (this.query) {
      searchInteractEdata['extra'] = {
        query: this.query
      };
    }
      this.appTelemetryInteractData = {
       context: {
          env: _.get(this.telemetryInteractContext, 'env') || _.get(this.activatedRoute, 'snapshot.root.firstChild.data.telemetry.env') ||
          _.get(this.activatedRoute, 'snapshot.data.telemetry.env'),
          cdata: this.telemetryInteractCdata || [],
        },
        edata: searchInteractEdata
      };
      this.telemetryService.interact(this.appTelemetryInteractData);
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
    this.route.navigate(['workspace/content/collaborating-on', 1], { queryParams: this.queryParams });
  }
  removeFilterSelection(filterType, value) {
    const itemIndex = this.queryParams[filterType].indexOf(value);
    if (itemIndex !== -1) {
      this.queryParams[filterType].splice(itemIndex, 1);
    }
    this.route.navigate(['workspace/content/collaborating-on', 1], { queryParams: this.queryParams  });
  }
}
