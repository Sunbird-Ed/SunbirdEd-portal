
import {combineLatest as observableCombineLatest, Subject} from 'rxjs';
import {
  ServerResponse, PaginationService, ResourceService, ConfigService, ToasterService, INoResultMessage,
  NavigationHelperService, IPagination, LayoutService
} from '@sunbird/shared';
import { SearchService, UserService, PermissionService } from '@sunbird/core';
import {Component, OnInit, NgZone, AfterViewInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { UserSearchService } from './../../services';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { ProfileService } from '@sunbird/profile';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  private searchService: SearchService;
  private resourceService: ResourceService;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  closeIntractEdata: IInteractEventEdata;
  userViewIntractEdata: IInteractEventEdata;
  userDeleteIntractEdata: IInteractEventEdata;
  userEditIntractEdata: IInteractEventEdata;
  filterIntractEdata: IInteractEventEdata;
  /**
   * To get url, app configs
   */
  public config: ConfigService;
  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  private userSearchService: UserSearchService;
  /**
   * Contains list of published course(s) of logged-in user
   */
  searchList: Array<any> = [];
  /**
   * To navigate to other pages
   */
  private route: Router;
  /**
  * To send activatedRoute.snapshot to router navigation
  * service for redirection to parent component
  */
  private activatedRoute: ActivatedRoute;
  /**
   * For showing pagination on inbox list
   */
  private paginationService: PaginationService;
  /**
 * To get user profile of logged-in user
 */
  public user: UserService;

  /**
    * To show / hide no result message when no result found
   */
  noResult = false;
  /**
   * no result  message
  */
  noResultMessage: INoResultMessage;
  /**
    * totalCount of the list
  */
  totalCount: Number;
  /**
   * Current page number of inbox list
   */
  pageNumber = 1;
  /**
	 * Contains page limit of outbox list
	 */
  pageLimit: number;
  /**
   * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
   */
  showLoader = true;
  /**
     * loader message
    */
  loaderMessage: any;
  /**
   * Contains returned object of the pagination service
   * which is needed to show the pagination on inbox view
   */
  pager: IPagination;
  /**
   *url value
   */
  queryParams: any;

  rootOrgId: string;
  userProfile: any;
  inviewLogs: any = [];
  selectedRoles: Array<string>;

  customStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #fff',
    boxShadow: '0 0 6px 0 rgba(0,0,0,0.38)',
    borderRadius: '50%',
    color: '#024F9D',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    fontSize: '48px'
  };
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    headers: []
  };
  layoutConfiguration: any;
  public unsubscribe$ = new Subject<void>();
  avatarConfig: { size: any;  view: any;  isTitle:boolean };

  /**
     * Constructor to create injected service(s) object
     * Default method of Draft Component class
     * @param {SearchService} searchService Reference of SearchService
     * @param {Router} route Reference of Router
     * @param {PaginationService} paginationService Reference of PaginationService
     * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
     * @param {ConfigService} config Reference of ConfigService
   */
  constructor(searchService: SearchService, route: Router, private ngZone: NgZone,
    activatedRoute: ActivatedRoute, paginationService: PaginationService,
    resourceService: ResourceService, toasterService: ToasterService,
    config: ConfigService, user: UserService, userSearchService: UserSearchService,
    public permissionService: PermissionService, public profileService: ProfileService,
    public navigationhelperService: NavigationHelperService, public layoutService: LayoutService) {
    this.searchService = searchService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.paginationService = paginationService;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.userSearchService = userSearchService;
    this.config = config;
    this.user = user;
    this.avatarConfig = {
      size: this.config.constants.SIZE.MEDIUM,
      view: this.config.constants.VIEW.VERTICAL,
      isTitle:false
    };
   
  }
  /**
   * This method sets the make an api call to get all search data with page No and offset
   */
  populateUserSearch() {
    this.showLoader = true;
    this.pageLimit = this.config.appConfig.SEARCH.PAGE_LIMIT;
    const searchParams = {
      filters: {
        'rootOrgId': this.rootOrgId,
        'profileUserType.type': this.queryParams.Usertype,
        'framework.medium': this.queryParams.medium,
        'framework.gradeLevel': this.queryParams.gradeLevel,
        'framework.subject': this.queryParams.subject
      },
      limit: this.pageLimit,
      pageNumber: this.pageNumber,
      query: this.queryParams.key
    };
    if (_.get(searchParams, 'filters["profileUserType.type"]')) {
      const index = _.indexOf(searchParams.filters['profileUserType.type'], 'School head or officials');
      if (index >= 0) {
        searchParams.filters['profileUserType.type'][index] = 'administrator';
      } else if (searchParams.filters['profileUserType.type'] === 'School head or officials') {
        searchParams.filters['profileUserType.type'] = ['administrator'];
      }
    }
    if (!_.isEmpty(this.selectedRoles)) { searchParams.filters['roles.role'] = this.selectedRoles; }
    if (this.queryParams.School) {
      searchParams.filters['organisations.organisationId'] = this.queryParams.School;
    } else {
      const locationArray = [];
      if (this.queryParams.District) {
        locationArray.push(typeof this.queryParams.District === 'string' ? this.queryParams.District : this.queryParams.District[0]);
      }
      if (this.queryParams.Block) {
        locationArray.push(typeof this.queryParams.Block === 'string' ? this.queryParams.Block : this.queryParams.Block[0]);
      }
      if (!_.isEmpty(locationArray)) {
        searchParams.filters['profileLocation.id'] = locationArray;
       }
    }
    this.searchService.userSearch(searchParams).subscribe(
      (apiResponse: ServerResponse) => {
        if (apiResponse.result.response.count && apiResponse.result.response.content.length > 0) {
          this.showLoader = false;
          this.noResult = false;
          this.searchList = apiResponse.result.response.content;
          this.totalCount = apiResponse.result.response.count;
          this.populateLocationDetailsAndSetRoles();
          this.pager = this.paginationService.getPager(apiResponse.result.response.count, this.pageNumber, this.pageLimit);
        } else {
          this.noResult = true;
          this.showLoader = false;
          this.noResultMessage = {
            'message': 'messages.stmsg.m0008',
            'messageText': 'messages.stmsg.m0007'
          };
        }
      },
      err => {
        this.showLoader = false;
        this.noResult = true;
        this.noResultMessage = {
          'messageText': 'messages.fmsg.m0077'
        };
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    );
  }

  populateLocationDetailsAndSetRoles() {
    // Getting all location Ids
    let locationArray = [];
    _.each(this.searchList, (user) => {
      if (_.get(this.userProfile, 'rootOrgAdmin') && this.userProfile.rootOrgAdmin === true) {
        user.isEditableProfile = true;
      }
      _.each(user.locationIds, (location) => {
        locationArray.push(location);
      });
    });

    // Calling location search and setting location details to search list
    if (!_.isEmpty(locationArray)) {
      locationArray = _.uniq(locationArray);
      const requestData = { 'filters': { id: locationArray } };
      this.profileService.getUserLocation(requestData).subscribe(res => {
        _.each(this.searchList, (user) => {
          _.each(user.locationIds, (location) => {
            const locations = _.find(res.result.response, (loc) => {
              return loc.id === location;
            });
            if (locations) { user[locations.type] = locations; }
          });
        });
      });
    }
  }

  downloadUser() {

    const downloadArray = [{
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'organisations': 'Organizations',
      'location': 'Location',
      'grades': 'Grades',
      'language': 'Language',
      'subject': 'Subject'
    }];

    _.each(this.searchList, (key, index) => {
      downloadArray.push({
        'firstName': key.firstName,
        'lastName': key.lastName,
        'organisations': 'test',
        'location': key.location !== null ? key.location : '',
        'grades': _.join(key.grade, ','),
        'language': _.join(key.language, ','),
        'subject': _.join(key.subject, ',')
      });
    });
    return  downloadArray;
  }


  /**
  * This method helps to navigate to different pages.
  * If page number is less than 1 or page number is greater than total number
  * of pages is less which is not possible, then it returns.
  *
  * @param {number} page Variable to know which page has been clicked
  *
  * @example navigateToPage(1)
  */
  navigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.route.navigate(['search/Users', this.pageNumber], {
      queryParams: this.queryParams
    });
  }

  initLayout() {
    this.layoutConfiguration = this.layoutService.initlayoutConfig();
    this.layoutService.switchableLayout().pipe(takeUntil(this.unsubscribe$)).subscribe(layoutConfig => {
      if (layoutConfig != null) {
        this.layoutConfiguration = layoutConfig.layout;
      }
    });
  }

  ngOnInit() {
    this.initLayout();
    this.user.userData$.subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.userProfile = userdata.userProfile;
        this.rootOrgId = this.userProfile.rootOrgId;
        observableCombineLatest(this.activatedRoute.params, this.activatedRoute.queryParams,
          (params: any, queryParams: any) => {
            return {
              params: params,
              queryParams: queryParams
            };
          })
          .subscribe(bothParams => {
            if (bothParams.params.pageNumber) {
              this.pageNumber = Number(bothParams.params.pageNumber);
            }
            this.queryParams = { ...bothParams.queryParams };
            this.selectedRoles = [];
            if (this.queryParams.Roles) {
              this.permissionService.availableRoles$.subscribe(params => {
                _.forEach(this.permissionService.allRoles, (role) => {
                  if (this.queryParams.Roles.includes(role.roleName)) { this.selectedRoles.push(role.role); }
                });
                this.populateUserSearch();
              });
            } else {
              this.populateUserSearch();
            }
          });
      }
    });
    this.setInteractEventData();
    this.userSearchService.userDeleteEvent.subscribe(data => {
      _.each(this.searchList, (key, index) => {
        if (data && data === key.id) {
          this.searchList[index].status = 0;
        }
      });
    });
  }
  setInteractEventData() {
    this.closeIntractEdata = {
      id: 'user-search-close',
      type: 'click',
      pageid: 'user-search'
    };
    this.userViewIntractEdata = {
      id: 'user-profile-view',
      type: 'click',
      pageid: 'user-search'
    };
    this.userEditIntractEdata = {
      id: 'user-profile-edit',
      type: 'click',
      pageid: 'user-search'
    };
    this.userDeleteIntractEdata = {
      id: 'user-profile-delete',
      type: 'click',
      pageid: 'user-search'
    };
    this.filterIntractEdata = {
      id: 'filter',
      type: 'click',
      pageid: 'user-search'
    };
  }
  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: this.route.url,
          subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
      this.inview({ inview: [] });
    });
  }
  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.identifier;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.identifier,
          objtype: 'user',
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
