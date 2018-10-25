
import { filter } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UserService } from './../../services';
import { ResourceService, ConfigService, IUserProfile } from '@sunbird/shared';

/**
 * Main menu component
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
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

  /**
   * Contains roles
   */
  userSearchRoles: Array<string>;

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
  private activatedRoute: ActivatedRoute;
  /**
     * Constructor to create injected service(s) object
     * Default method of Draft Component class
     * @param {Router} route Reference of Router
     * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
   */
  constructor(route: Router, activatedRoute: ActivatedRoute, userService: UserService,
    resourceService: ResourceService, config: ConfigService,
    private cdr: ChangeDetectorRef) {
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.config = config;
    this.userService = userService;
  }
  /**
   * on changing dropdown option
   * it navigate
   */
  onChange() {
    this.route.navigate([this.search[this.selectedOption], 1]);
  }
  /**
   * on entering keyword
   * it navigate
   */
  onEnter(key) {
    this.key = key;
    this.queryParam = {};
    this.queryParam['key'] = this.key;
    if (this.key && this.key.length > 0) {
      this.queryParam['key'] = this.key;
    } else {
      delete this.queryParam['key'];
    }
    this.route.navigate([this.search[this.selectedOption], 1], {
      queryParams: this.queryParam
    });
  }

  setFilters() {
    this.search = this.config.dropDownConfig.FILTER.SEARCH.search;
    this.searchUrl = this.config.dropDownConfig.FILTER.SEARCH.searchUrl;
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.queryParam = { ...queryParams };
      this.key = this.queryParam['key'];
    });
    this.route.events.pipe(
      filter(e => e instanceof NavigationEnd)).subscribe((params: any) => {
        this.userService.userData$.subscribe(userdata => {
          if (userdata && !userdata.err) {
            this.userProfile = userdata.userProfile;
            const currUrl = this.route.url.split('?');
            this.value = currUrl[0].split('/', 3);
            const searchEnabledStates = this.config.dropDownConfig.FILTER.SEARCH.searchEnabled;
            if (this.searchUrl[this.value[1]] && searchEnabledStates.includes(this.value[1])) {
              if (this.searchUrl[this.value[1]] === 'Users') {
                if (!this.userProfile.rootOrgAdmin) {
                  this.selectedOption = 'All';
                } else {
                  if (this.searchDropdownValues.indexOf('Users') === -1) {
                    this.searchDropdownValues.push('Users');
                  }
                  this.selectedOption = this.searchUrl[this.value[1]];
                  this.showSuiSelectDropdown = false;
                  this.cdr.detectChanges();
                  this.showSuiSelectDropdown = true;
                }
              } else {
                this.selectedOption = this.searchUrl[this.value[1]];
              }
              this.showInput = true;
            } else if (this.value[1] === 'search' && searchEnabledStates.includes(this.value[1])) {
              this.selectedOption = this.value[2];
              this.showInput = true;
            } else {
              this.selectedOption = 'All';
              this.showInput = false;
            }
          }
        });
      });
  }
  /**
   * gets the current url,
   * and queryParams
   */
  ngOnInit() {
    this.setFilters();
    this.showSuiSelectDropdown = true;
    this.userSearchRoles = this.config.rolesConfig.ROLES.userSearch;
  }
}
