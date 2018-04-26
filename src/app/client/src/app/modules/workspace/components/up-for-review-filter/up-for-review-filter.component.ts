import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { ISelectFilter } from '../../interfaces/selectfilter';

@Component({
  selector: 'app-up-for-review-filter',
  templateUrl: './up-for-review-filter.component.html',
  styleUrls: ['./up-for-review-filter.component.css']
})
export class UpforReviewFilterComponent implements OnInit {
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
   * selectedBoard
  */
  search: ISelectFilter;
  /**
   * upForReviewSortingOptions
  */
  sortingOptions: Array<string>;
  /**
   * Boards dropdown
  */
  boards: Array<string>;
  /**
   * mediums dropdown
  */
  mediums: Array<string>;
  /**
   * contentTypes dropdown
  */
  contentTypes: Array<string>;
  /**
   * subjects dropdown
  */
  subjects: Array<string>;
  /**
   * grades dropdown
  */
  grades: Array<string>;
  /**
    * To show / hide sortIcon
   */
  sortIcon = true;
  /**
    * position for the popup
  */
  position: string;
  /**
    * To show / hide AppliedFilter
   */
  isShowAppliedFilter = true;


  /**
    * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;
  /**
  * To get url, app configs
  */
  public config: ConfigService;

  sortByOption: string;
  @Output('filter')
  filter = new EventEmitter<any>();
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
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.init();
        if (params.text) {
          this.search.searchText = params.text;
        } else if (params.sort_by) {
            console.log('inside else');
            this.sortByOption = params.sort_by;
            console.log(this.sortByOption);
        } else {
          // this.init();
        }
    });
    this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.upForReviewSortingOptions;
    this.boards = this.config.dropDownConfig.FILTER.RESOURCES.boards;
    this.contentTypes = this.config.dropDownConfig.FILTER.RESOURCES.contentTypes;
    this.subjects = this.config.dropDownConfig.COMMON.subjects;
    this.grades = this.config.dropDownConfig.COMMON.grades;
    this.mediums = this.config.dropDownConfig.COMMON.medium;
    // this.init();
  }
  /**
    * initiliaze the applied filter
  */
  init() {
    this.search = {
      'board': [],
      'subject': [],
      'grades': [],
      'medium': [],
      'contentType': [],
      'searchText': ''
    };
  }
  /**
    * To add applied filter and show in tags
  */
  selectFilter(filterType, value, $event) {
    const itemIndex = this.search[filterType].indexOf(value);
    if (itemIndex === -1) {
      this.search[filterType].push(value);
    } else {
      this.search[filterType].splice(itemIndex, 1);
    }
  }
  appliedFilter() {
    this.isShowAppliedFilter = true;
  }
  keyup(event) {
    setTimeout(() => {
      this.filter.emit({'text': this.search.searchText});
     }, 1000);
  }

  applySorting(sortByOption) {
    this.sortIcon = !this.sortIcon;
    this.filter.emit({'sort_by': sortByOption} );
  }
}
