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
  @Input() filterEnv: string;
  @Input() redirectUrl: string;
  /**
 * To get url, app configs
 */
  public configService: ConfigService;

  public resourceService: ResourceService;

  public filterType: string;
  /**
 * To navigate to other pages
 */
  public router: Router;
  /**
* To show toaster(error, success etc) after any API calls
*/
  public toasterService: ToasterService;

  public frameworkService: FrameworkService;

  public formService: FormService;

  public formFieldProperties: any;

  public categoryMasterList: any;

  public framework: string;

  public isCachedDataExists: boolean;

  public formType = 'content';

  public formAction = 'search';

  public queryParams: any;
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
  constructor(configService: ConfigService,
    resourceService: ResourceService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private _cacheService: CacheService,
    private cdr: ChangeDetectorRef,
    frameworkService: FrameworkService,
    formService: FormService,
    toasterService: ToasterService,

  ) {
    this.configService = configService;
    this.resourceService = resourceService;
    this.router = router;
    this.frameworkService = frameworkService;
    this.formService = formService;
    this.toasterService = toasterService;
    this.formInputData = {};
  }

  ngOnInit() {
    this.frameworkService.initialize();
    this.formInputData = {};
    this.getQueryParams();
    this.fetchFilterMetaData();
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
        this.queryParams = { ...bothParams.queryParams };
        _.forIn(this.queryParams, (value, key) => {
          if (typeof value === 'string' && key !== 'key') {
            this.queryParams[key] = [value];
          }
        });
        this.formInputData = _.pickBy(this.queryParams);
      });
  }
  /**
* fetchFilterMetaData is gives form config data
*/
  fetchFilterMetaData() {
    this.isCachedDataExists = this._cacheService.exists(this.filterEnv + this.formAction);
    if (this.isCachedDataExists) {
      const data: any | null = this._cacheService.get(this.filterEnv + this.formAction);
      this.formFieldProperties = data;
    } else {
      this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
        if (frameworkData && !frameworkData.err) {
          this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata);
          this.framework = frameworkData.framework;
          const formServiceInputParams = {
            formType: this.formType,
            formAction: this.formAction,
            contentType: this.filterEnv,
            framework: frameworkData.framework
          };
          this.formService.getFormConfig(formServiceInputParams).subscribe(
            (data: ServerResponse) => {
              this.formFieldProperties = data;
              this.getFormConfig();
            },
            (err: ServerResponse) => {
              this.toasterService.error(this.resourceService.messages.emsg.m0005);
            }
          );
        } else if (frameworkData && frameworkData.err) {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        }
      });
    }
  }

  /**
 * @description - Which is used to config the form field vlaues
 * @param {formFieldProperties} formFieldProperties  - Field information
 */
  getFormConfig() {
    _.forEach(this.categoryMasterList, (category) => {
      _.forEach(this.formFieldProperties, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.range = category.terms;
        }
        return formFieldCategory;
      });
    });
    this.formFieldProperties = _.sortBy(_.uniqBy(this.formFieldProperties, 'code'), 'index');
    this._cacheService.set(this.filterEnv + this.formAction, this.formFieldProperties,
      {
        maxAge: this.configService.appConfig.cacheServiceConfig.setTimeInMinutes *
          this.configService.appConfig.cacheServiceConfig.setTimeInSeconds
      });
  }

  resetFilters() {
    this.formInputData = {};
    this.applyFilters();
  }

  applyFilters() {
    this.queryParams = _.pickBy(this.formInputData, value => value.length > 0);
    console.log('this.redirectUrl', this.redirectUrl);
    this.router.navigate([this.redirectUrl], { queryParams: this.queryParams });
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
