import { ConfigService, ResourceService, Framework, ToasterService, ServerResponse, } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FrameworkService, FormService, ConceptPickerService } from './../../services';
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
  @Input() accordionDefaultOpen: boolean;
  @Input() isShowFilterLabel: boolean;
  @Input() showConceptPicker: boolean;
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

  selectedConcepts: Array<object>;
  showFilter = false;
  refresh = true;
  isShowFilterPlaceholder = true;
  contentTypes: any;
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
    public conceptPickerService: ConceptPickerService

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
    this.contentTypes = this.configService.dropDownConfig.FILTER.RESOURCES.contentTypes;
  }

  getQueryParams() {
    this.conceptPickerService.conceptData$.subscribe(conceptData => {
      if (conceptData && !conceptData.err) {
        this.selectedConcepts = conceptData.data;
        this.activatedRoute.queryParams.subscribe((params) => {
          this.queryParams = { ...params };
          _.forIn(params, (value, key) => {
            if (typeof value === 'string' && key !== 'key') {
              this.queryParams[key] = [value];
            }
          });
          this.formInputData = _.pickBy(this.queryParams);
          if (this.formInputData && this.formInputData.concept) {
            this.formInputData.concept = this.conceptPickerService.processConcepts(this.formInputData.concept, this.selectedConcepts);
          }
          this.showFilter = true;
        });
      }
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
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  /**
 * to get selected concepts from concept picker.
 */
  concepts(events) {
    this.formInputData['concept'] = events;
  }
  /**
 * To check filterType.
 */
  isObject(val) { return typeof val === 'object'; }

  applyFilters() {
    this.queryParams = _.pickBy(this.formInputData, value => value.length > 0);
    let queryParams = {};
    _.forIn(this.queryParams, (value, key) => {
      if (key === 'concept') {
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
