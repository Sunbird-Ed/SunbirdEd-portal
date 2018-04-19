import { ConfigService, ResourceService, Framework, ToasterService, ServerResponse, } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FrameworkService, FormService } from './../../services';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';

@Component({
  selector: 'app-data-driven-filter',
  templateUrl: './data-driven-filter.component.html',
  styleUrls: ['./data-driven-filter.component.css']
})
export class DataDrivenFilterComponent implements OnInit {
  @Input() routerVal: string;
  /**
 * To get url, app configs
 */
  public config: ConfigService;

  private resourceService: ResourceService;

  public contentType: string;
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

  /**
 * formInputData is to take input data's from form
 */
public formInputData: any;

  searchBoards: Array<string>;
  searchLanguages: Array<string>;
  searchSubjects: Array<string>;
  label: any;
  refresh = true;

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
    toasterService: ToasterService

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
    console.log('routerVal', this.routerVal);
    this.contentType = this.routerVal;

    this.getMetaData();
    // this.label = this.config.dropDownConfig.FILTER.SEARCH.All.label;
    // this.searchBoards = this.config.dropDownConfig.FILTER.RESOURCES.boards;
    // this.searchLanguages = this.config.dropDownConfig.FILTER.RESOURCES.languages;
    // this.searchSubjects = this.config.dropDownConfig.FILTER.RESOURCES.subjects;
  }
  /**
* getMetaData is gives form config data
*/
  getMetaData() {
    console.log('getMetaData called');
    this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
      if (frameworkData && !frameworkData.err) {
        this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata);
        this.framework = frameworkData.framework;
        this.exists = this._cacheService.exists(this.contentType);
        console.log('exists', this.exists);
        if (this.exists) {
          const data: any | null = this._cacheService.get(this.contentType);
          this.formFieldProperties = data;
          this.getFormConfig(this.formFieldProperties);
        } else {
          /**
          * Default method of OrganisationService class
          *@param {formType} type form type
          *@param {formAction} action form action type
          * @param {contentType} content selected content type
          */
          this.formService.getFormConfig(this.formType, this.formAction, this.contentType, frameworkData.framework).subscribe(
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
    console.log('this.formFieldProperties', this.formFieldProperties);
  }
  applyFilters() {
    console.log('applyFilters', this.formInputData);
  }
  resetFilters() {
    this.formInputData = {};
  }

}
