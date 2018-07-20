import { Subscription, Observable } from 'rxjs';
import { ConfigService, ResourceService, Framework, ToasterService, ServerResponse, BrowserCacheTtlService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ApplicationRef, ChangeDetectorRef, OnDestroy, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FrameworkService, FormService, ConceptPickerService, PermissionService } from './../../services';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';

@Component({
  selector: 'app-prominent-filter',
  templateUrl: './prominent-filter.component.html',
  styleUrls: ['./prominent-filter.component.css']
})
export class ProminentFilterComponent implements OnInit, OnDestroy {
  @Input() filterEnv: string;
  @Input() redirectUrl: string;
  @Input() accordionDefaultOpen: boolean;
  @Input() isShowFilterLabel: boolean;
  @Input() hashTagId = '';
  @Input() ignoreQuery = [];
  @Input() showSearchedParam = true;
  @Output() filters = new EventEmitter();

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
  public filtersDetails: any;

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

  userRoles = [];

  public permissionService: PermissionService;

  selectedConcepts: Array<object>;
  showConcepts = false;
  refresh = true;
  isShowFilterPlaceholder = true;
  contentTypes: any;
  frameworkDataSubscription: Subscription;
  /**
   *
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
    public conceptPickerService: ConceptPickerService,
    permissionService: PermissionService,
    private browserCacheTtlService: BrowserCacheTtlService

  ) {
    this.configService = configService;
    this.resourceService = resourceService;
    this.router = router;
    this.frameworkService = frameworkService;
    this.formService = formService;
    this.toasterService = toasterService;
    this.permissionService = permissionService;
    this.formInputData = {};
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
    this.frameworkService.initialize(this.hashTagId);
    this.formInputData = {};
    this.getQueryParams();
    this.fetchFilterMetaData();
    this.contentTypes = this.configService.dropDownConfig.FILTER.RESOURCES.contentTypes;
  }
  getQueryParams() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = { ...params };
      _.forIn(params, (value, key) => {
        if (typeof value === 'string' && key !== 'key' && key !== 'language') {
          this.queryParams[key] = [value];
        }
      });
      this.formInputData = _.pickBy(this.queryParams);
      this.refresh = false;
      this.cdr.detectChanges();
      this.refresh = true;
      this.conceptPickerService.conceptData$.subscribe(conceptData => {
        if (conceptData && !conceptData.err) {
          this.selectedConcepts = conceptData.data;
          if (this.formInputData && this.formInputData.concepts) {
            this.formInputData.concepts = this.conceptPickerService.processConcepts(this.formInputData.concepts, this.selectedConcepts);
          }
          this.showConcepts = true;
        }
      });
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
      this.frameworkDataSubscription = this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
        if (frameworkData && !frameworkData.err) {
          this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata);
          this.framework = frameworkData.framework;
          const formServiceInputParams = {
            formType: this.formType,
            formAction: this.formAction,
            contentType: this.filterEnv,
            framework: frameworkData.framework
          };
          this.formService.getFormConfig(formServiceInputParams, this.hashTagId).subscribe(
            (data: ServerResponse) => {
              this.formFieldProperties = data;
              _.forEach(this.formFieldProperties, (formFieldCategory) => {
                if (formFieldCategory && formFieldCategory.allowedRoles) {
                  const userRoles = formFieldCategory.allowedRoles.filter(element => this.userRoles.includes(element));
                  if (!this.showField(formFieldCategory.allowedRoles)) {
                    this.formFieldProperties.splice(this.formFieldProperties.indexOf(formFieldCategory), 1);
                  }
                }
              });
              this.getFormConfig();
            },
            (err: ServerResponse) => {
              // this.toasterService.error(this.resourceService.messages.emsg.m0005);
            }
          );
        } else if (frameworkData && frameworkData.err) {
          // this.toasterService.error(this.resourceService.messages.emsg.m0005);
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
        if (category.code === formFieldCategory.code && category.terms) {
          formFieldCategory.range = category.terms;
        }
        return formFieldCategory;
      });
    });
    this.formFieldProperties = _.sortBy(_.uniqBy(this.formFieldProperties, 'code'), 'index');
    this._cacheService.set(this.filterEnv + this.formAction, this.formFieldProperties,
      {
        maxAge: this.browserCacheTtlService.browserCacheTtl
      });
  }

  resetFilters() {
    if (!_.isEmpty(this.ignoreQuery)) {
      this.formInputData = _.pick(this.formInputData, this.ignoreQuery);
    } else {
      this.formInputData = {};
    }
    this.router.navigate([this.redirectUrl], { queryParams: this.formInputData });
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
  selectedValue(event, code) {
    this.formInputData[code] = event;
  }

  /**
 * to get selected concepts from concept picker.
 */
  concepts(events) {
    this.formInputData['concepts'] = events;
  }
  /**
 * To check filterType.
 */
  isObject(val) { return typeof val === 'object'; }

  applyFilters() {
    this.queryParams = _.pickBy(this.formInputData, value => value.length > 0);
    let queryParams = {};
    _.forIn(this.queryParams, (value, key) => {
      if (key === 'concepts') {
        queryParams[key] = [];
        value.forEach((conceptDetails) => {
          queryParams[key].push(conceptDetails.identifier);
        });
      } else {
        queryParams[key] = value;
      }
    });
    queryParams = _.pickBy(queryParams, value => value.length > 0);
    this.router.navigate([this.redirectUrl], { queryParams: queryParams });
  }
  showField(allowedRoles) {
    if (allowedRoles) {
      return this.permissionService.checkRolesPermissions(allowedRoles);
    } else {
      return true;
    }
  }
  ngOnDestroy() {
    if (this.frameworkDataSubscription) {
      this.frameworkDataSubscription.unsubscribe();
    }
  }
}

