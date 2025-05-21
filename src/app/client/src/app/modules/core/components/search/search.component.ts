import { filter } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UserService } from './../../services';
import { ResourceService, ConfigService, IUserProfile, LayoutService, UtilService, ConnectionService, ToasterService } from '@sunbird/shared';
import { Subscription } from 'rxjs';
import * as _ from 'lodash-es';
/**
 * Main menu component
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  /**
   * Sui dropdown initiator
   */
  isOpen: boolean;

  showSuiSelectDropdown: boolean;

  /**
   *
   */
  queryParam: any = {};
  /**
   * value of current url
   */
  value: any;
  /**
   * key enter for search
   */
  key: string;
  resourceService: ResourceService;
  resourceDataSubscription: Subscription;


  /**
   * option selected on dropdown
   */
  selectedOption: string;
  /**
   * show input field
   */
  showInput: boolean;
  /**
   * input keyword depending on url
   */
  search: object;
  /**
   * url
   */
  searchUrl: object;
  config: ConfigService;
  userProfile: IUserProfile;

  searchDropdownValues: Array<string> = ['All', 'Courses', 'Library'];

  searchPlaceHolderValue: string;

  searchDisplayValueMappers: object;
  isDesktopApp = false;
  isConnected = true;

  /**
   * reference of UserService service.
   */
  public userService: UserService;

  /**
   * To navigate to other pages
   */
  private route: Router;
  /**
  * To send activatedRoute.snapshot to router navigation
  * service for redirection to parent component
  */
  @Input() layoutConfiguration: any;
  private activatedRoute: ActivatedRoute;
  /**
     * Constructor to create injected service(s) object
     * Default method of Draft Component class
     * @param {Router} route Reference of Router
     * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   */
  constructor(route: Router, activatedRoute: ActivatedRoute, userService: UserService,
    resourceService: ResourceService, config: ConfigService, public utilService: UtilService,
    private cdr: ChangeDetectorRef, public toasterService: ToasterService, public layoutService: LayoutService, public connectionService: ConnectionService) {
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.config = config;
    this.userService = userService;
    this.searchDisplayValueMappers = {
      'Users': 'users'
    };
  }

  ngOnInit() {
    this.isDesktopApp = this.utilService.isDesktopApp;
    this.showInput = true;
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.queryParam = { ...queryParams };
      this.key = this.queryParam['key'];
    });
    this.userService.userData$.subscribe(userdata => {
      if (userdata && !userdata.err) {
        this.userProfile = userdata.userProfile;
        if (this.userProfile.rootOrgAdmin) {
            this.searchDropdownValues.push('Users');
        }
      }
      this.setFilters();
      this.route.events.pipe(
        filter(e => e instanceof NavigationEnd)).subscribe((params: any) => {
          this.setFilters();
        });
    });
    this.showSuiSelectDropdown = true;
    this.resourceDataSubscription = this.resourceService.languageSelected$
      .subscribe(item => {
        this.setSearchPlaceHolderValue();
      }
    );
    this.connectionService.monitor().subscribe(isConnected => {
        this.isConnected = isConnected;
    });
  }

  /**
   * on changing dropdown option
   * it navigate
   */
  onChange() {
    this.route.navigate([this.search[this.selectedOption], 1]);
  }
  ngOnDestroy() {
    if (this.resourceDataSubscription) {
      this.resourceDataSubscription.unsubscribe();
    }
  }
  /**
   * search input box placeholder value
   */
  setSearchPlaceHolderValue () {
    const keyName = this.searchDisplayValueMappers[this.selectedOption];
    if (keyName) {
      this.searchPlaceHolderValue = this.selectedOption;
    }
  }

  /**
   * on entering keyword
   * it navigate
   */
  onEnter(key) {
    this.key = key?.trim();
    this.queryParam = {};
    this.queryParam['key'] = this.key;
    if (this.key && this.key.length > 0) {
      this.queryParam['key'] = this.key;
    } else {
      delete this.queryParam['key'];
      this.toasterService.error(this.resourceService.messages.emsg.searchinputerror);
      return
    }
    const url = this.route.url.split('?')[0];
    let redirectUrl;
    if (this.selectedOption) {
      redirectUrl = this.search[this.selectedOption];
    } else {
      redirectUrl = url.substring(0, url.indexOf('explore')) + 'explore';
    }
    this.queryParam['selectedTab'] = new URLSearchParams(this.route.url).get("selectedTab")
    // if (!_.includes(['Users', 'profile'], this.selectedOption)) {
    //   this.queryParam['selectedTab'] = this.isDesktopApp && !this.isConnected ? 'mydownloads' : 'all';

    // }
    if (this.isDesktopApp && !this.isConnected) {
      this.route.navigate(['mydownloads'], { queryParams: this.queryParam });
    } else {
      this.route.navigate([redirectUrl, 1], { queryParams: this.queryParam });
    }
  }

  setFilters() {
    this.search = this.config.dropDownConfig.FILTER.SEARCH.search;
    this.searchUrl = this.config.dropDownConfig.FILTER.SEARCH.searchUrl;
    const currUrl = this.route.url.split('?');
    this.value = currUrl[0].split('/', 3);
    const searchEnabledStates = this.config.dropDownConfig.FILTER.SEARCH.searchEnabled;
    if (this.searchUrl[this.value[1]] && searchEnabledStates.includes(this.value[1])) {
      this.setDropdownSelectedOption(this.searchUrl[this.value[1]]);
    } else if (this.value[1] === 'search' && searchEnabledStates.includes(this.value[1])) {
      this.setDropdownSelectedOption(this.value[2]);
    } else if (this.value[1] === 'observation') {
      this.showInput = true;
    } else {
      this.selectedOption = 'All';
      this.setSearchPlaceHolderValue();
      this.showInput = false;
    }
  }

  setDropdownSelectedOption (value) {
    if ( value === 'Users' ) {
      if ( !this.userProfile.rootOrgAdmin ) {
        this.selectedOption = 'All';
      } else {
        this.selectedOption = value;
        this.showSuiSelectDropdown = false;
        this.cdr.detectChanges();
        this.showSuiSelectDropdown = true;
      }
    } else {
      this.selectedOption = value;
    }
    this.setSearchPlaceHolderValue();
    this.showInput = true;
  }


  getInteractEdata(key) {
    const searchInteractEdata = {
      id: `search-${_.lowerCase(this.searchPlaceHolderValue)}-button`,
      type: 'click',
      pageid: this.route.url.split('/')[1]
    };
    if (key) {
      searchInteractEdata['extra'] = {
        query: key
      };
    }
    return searchInteractEdata;
  }
  isLayoutAvailable() {
    return this.layoutService.isLayoutAvailable(this.layoutConfiguration);
  }
}
