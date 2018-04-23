import { ConfigService, ResourceService, Framework, ToasterService, ServerResponse, } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FrameworkService, FormService } from './../../services';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-data-driven-filter',
  templateUrl: './data-driven-filter.component.html',
  styleUrls: ['./data-driven-filter.component.css']
})
export class DataDrivenFilterComponent implements OnInit {
  @Input() routerVal: string;
  @Input() inPageFilter: boolean;
  @Output() triggerParentSearch: EventEmitter<any> = new EventEmitter();
  /**
 * To get url, app configs
 */
  public config: ConfigService;

  private resourceService: ResourceService;

  public filterType: string;
  /**
 * To navigate to other pages
 */
  private router: Router;
  /**
* To show toaster(error, success etc) after any API calls
*/
  private toasterService: ToasterService;

  public frameworkService: FrameworkService;

  public formService: FormService;

  public formFieldProperties: any;

  public categoryMasterList: any;

  public framework: string;

  public exists: boolean;

  public formType = 'content';

  public formAction = 'search';

  public pageNumber: Number = 1;

  public queryParams: any;

  public redirectUrl: any;
  /**
 * formInputData is to take input data's from form
 */
  public formInputData: any;

  refresh = true;
  isShowFilterPlaceholder = true;
  /**
    * Constructor to create injected service(s) object
    Default method of Draft Component class
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService,
    resourceService: ResourceService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private _cacheService: CacheService,
    private cdr: ChangeDetectorRef,
    frameworkService: FrameworkService,
    formService: FormService,
    toasterService: ToasterService,

  ) {
    this.config = config;
    this.resourceService = resourceService;
    this.router = router;
    this.frameworkService = frameworkService;
    this.formService = formService;
    this.toasterService = toasterService;
    this.frameworkService.initialize();
    this.formInputData = {};
  }

  ngOnInit() {
    this.formInputData = {};
    this.getQueryParams();
   // console.log('routerVal', this.routerVal);
    this.filterType = this.routerVal;
    this.getMetaData();
    // this.label = this.config.dropDownConfig.FILTER.SEARCH.All.label;
    // this.searchBoards = this.config.dropDownConfig.FILTER.RESOURCES.boards;
    // this.searchLanguages = this.config.dropDownConfig.FILTER.RESOURCES.languages;
    // this.searchSubjects = this.config.dropDownConfig.FILTER.RESOURCES.subjects;
  }
  getQueryParams() {
    Observable
      .combineLatest(
        this.activatedRoute.params,
        this.activatedRoute.queryParams,
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
        _.forIn(this.queryParams, (value, key) => {
          if (typeof value === 'string') {
            this.queryParams[key] = [value];
          }
        });
       // console.log('this.queryParams', this.queryParams);
        this.formInputData = _.pickBy(this.queryParams);
       // console.log('this.queryParams', this.formInputData);
      });
  }
  /**
* getMetaData is gives form config data
*/
  getMetaData() {
    this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
      if (frameworkData && !frameworkData.err) {
        this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata);
        this.framework = frameworkData.framework;
        this.exists = this._cacheService.exists(this.filterType + this.formAction);
        if (this.exists) {
          const data: any | null = this._cacheService.get(this.filterType + this.formAction);
          this.formFieldProperties = data;
          this.getFormConfig(this.formFieldProperties);
        } else {
          /**
          * Default method of OrganisationService class
          *@param {formType} type form type
          *@param {formAction} action form action type
          * @param {contentType} content selected content type
          */
          this.formService.getFormConfig(this.formType, this.formAction, this.filterType, frameworkData.framework).subscribe(
            (data: ServerResponse) => {
              setTimeout(() => {
                this.formFieldProperties = data;
                this.getFormConfig(this.formFieldProperties);
              }, 0);
            },
            (err: ServerResponse) => {
              this.toasterService.error(this.resourceService.messages.emsg.m0005 || 'Something went wrong, please try again later...');
            }
          );
        }
      } else if (frameworkData && frameworkData.err) {
        this.toasterService.error(this.resourceService.messages.emsg.m0005 || 'Something went wrong, please try again later...');
      }
    });
  }

  /**
 * @description            - Which is used to config the form field vlaues
 * @param {formFieldProperties} formFieldProperties  - Field information
 */
  getFormConfig(formFieldProperties) {
    _.forEach(this.categoryMasterList, (category) => {
      _.forEach(this.formFieldProperties, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.range = category.terms;
        }
        return formFieldCategory;
      });
    });
    // this.formFieldProperties.sort((a, b) => a.index - b.index);
    this.formFieldProperties = _.sortBy(_.uniqBy(this.formFieldProperties, 'code'), 'index');
  }
  applyFilters() {

    this.initSearch();
  }
  resetFilters() {
    this.formInputData = {};
    this.initSearch();
  }
  initSearch() {

      this.queryParams = _.pickBy(this.formInputData, value => value.length > 0);
     // console.log('this.queryParams in filter', this.queryParams);
      this.redirectUrl = this.config.appConfig[this.filterType]['redirectUrl'];
      if (this.router.url.indexOf(this.redirectUrl) >= 0 || this.inPageFilter) {
        this.triggerParentSearch.emit(_.pickBy(this.queryParams));
      } else {
        this.router.navigate([this.redirectUrl, this.pageNumber], { queryParams: this.queryParams });
      }
  }
  removeFilterSelection(field, item) {
    const itemIndex = this.formInputData[field].indexOf(item);
    if (itemIndex !== -1) {
      this.formInputData[field].splice(itemIndex, 1);
      this.formInputData = _.pickBy(this.formInputData);
      this.refresh = false;
      this.cdr.detectChanges();
      this.refresh = true;
    }
  }
}
