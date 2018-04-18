import { SearchService } from './../../services/search/search.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ResourceService, ConfigService } from '@sunbird/shared';


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
   * option selected on dropdown
   */
  selectedOption: string;
  /**
   * input keyword depending on url
   */
  search: object;
  /**
   * url
   */
  searchUrl: object;
  config: ConfigService;
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
  constructor( route: Router,  activatedRoute: ActivatedRoute,
  resourceService: ResourceService, config: ConfigService) {
      this.route = route;
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.config = config;
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
    this.queryParam['key'] = this.key;
    this.route.navigate([this.search[this.selectedOption], 1], {
      queryParams: this.queryParam
    });
  }
  /**
   * gets the current url,
   * and queryParams
   */
  ngOnInit() {

    this.search = this.config.dropDownConfig.FILTER.SEARCH.search;
    this.searchUrl = this.config.dropDownConfig.FILTER.SEARCH.searchUrl;
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.queryParam = { ...queryParams };
      this.key = this.queryParam['key'];
    });
    this.route.events
      .filter(e => e instanceof NavigationEnd).subscribe((params: any) => {
        console.log(params);
        this.value = params.url.split('/', 3);
        if (this.searchUrl[this.value[1]]) {
          this.selectedOption = this.searchUrl[this.value[1]];
        } else if (this.value[1] === 'search') {
          this.selectedOption = this.value[2];
        } else {
          this.selectedOption = 'All';
        }
      });
  }

}
