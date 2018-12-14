import { Subscription, Observable } from 'rxjs';
import { of, throwError } from 'rxjs';
import { ConfigService, ResourceService, Framework, ToasterService, ServerResponse, BrowserCacheTtlService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ApplicationRef, ChangeDetectorRef, OnDestroy, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FrameworkService, FormService, PermissionService, OrgDetailsService } from './../../services';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { first, mergeMap, map, tap , catchError, filter} from 'rxjs/operators';
@Component({
  selector: 'app-prominent-filter',
  templateUrl: './prominent-filter.component.html',
  styleUrls: ['./prominent-filter.component.css']
})
export class ProminentFilterComponent implements OnInit, OnDestroy {
  @Input() filterEnv: string;
  @Input() accordionDefaultOpen: boolean;
  @Input() isShowFilterLabel: boolean;
  @Input() hashTagId = '';
  @Input() ignoreQuery = [];
  @Input() showSearchedParam = true;
  @Input() pageId: string;
  @Output() filters = new EventEmitter();
  @Input() frameworkName: string;
  @Input() formAction: string;
  @Output() prominentFilter = new EventEmitter();
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

  public queryParams: any;
  public showFilters = false;
  /**
 * formInputData is to take input data's from form
 */
  public formInputData: any;

  userRoles = [];

  public permissionService: PermissionService;

  refresh = true;
  isShowFilterPlaceholder = true;
  contentTypes: any;
  frameworkDataSubscription: Subscription;
  isFiltered = true;
  submitIntractEdata: IInteractEventEdata;
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
    permissionService: PermissionService,
    private browserCacheTtlService: BrowserCacheTtlService,
    private orgDetailsService: OrgDetailsService

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
    this.frameworkService.initialize(this.frameworkName, this.hashTagId);
    this.getFormatedFilterDetails().subscribe((formFieldProperties) => {
      this.formFieldProperties = formFieldProperties;
      this.prominentFilter.emit(formFieldProperties);
      this.subscribeToQueryParams();
    }, (err) => {
      this.prominentFilter.emit([]);
    });
  }

  getFormatedFilterDetails() {
    const formAction = this.formAction ? this.formAction : 'search';
    const cachedFormData = this._cacheService.get(this.filterEnv + formAction);
    if (cachedFormData) {
      return of(cachedFormData);
    } else {
      return this.fetchFrameWorkDetails().pipe(
        mergeMap((frameworkDetails: any) => {
          this.categoryMasterList = frameworkDetails.categoryMasterList;
          this.framework = frameworkDetails.code;
          return this.getFormDetails();
        }),
        mergeMap((formData: any) => {
          if (_.find(formData, {code: 'channel'})) {
            return this.getOrgSearch().pipe(map((channelData: any) => {
              const data = _.filter(channelData, 'hashTagId');
              return {formData: formData, channelData: data};
            }));
          } else {
            return of({formData: formData});
          }
        }),
        map((formData: any) => {
          let formFieldProperties = _.filter(formData.formData, (formFieldCategory) => {
            if (!_.isEmpty(formFieldCategory.allowedRoles)
              && !this.permissionService.checkRolesPermissions(formFieldCategory.allowedRoles)) {
                return false;
            }
            if (formFieldCategory.code === 'channel') {
              formFieldCategory.range = _.map(formData.channelData, (value) => {
                return {category: 'channel',
                identifier: value.hashTagId,
                name: value.orgName,
              };
              });
            } else {
            const frameworkTerms = _.get(_.find(this.categoryMasterList, { code : formFieldCategory.code}), 'terms');
            formFieldCategory.range = _.union(formFieldCategory.range, frameworkTerms);
            }
            return true;
          });
          formFieldProperties = _.sortBy(_.uniqBy(formFieldProperties, 'code'), 'index');
          return formFieldProperties;
        }),
        tap((formFieldProperties) => {
          this._cacheService.set(this.filterEnv + formAction, formFieldProperties,
            {maxAge: this.browserCacheTtlService.browserCacheTtl});
        }));
    }
  }
  private fetchFrameWorkDetails() {
    return this.frameworkService.frameworkData$.pipe(filter((frameworkDetails) => {
      if (!frameworkDetails.err) {
        const framework = this.frameworkName ? this.frameworkName : 'defaultFramework';
        const frameworkData = _.get(frameworkDetails.frameworkdata, framework);
        if (frameworkData) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }), first(),
      mergeMap((frameworkDetails: Framework) => {
        if (!frameworkDetails.err) {
          const framework = this.frameworkName ? this.frameworkName : 'defaultFramework';
          const frameworkData = _.get(frameworkDetails.frameworkdata, framework);
          if (frameworkData) {
            return of({categoryMasterList: frameworkData.categories, framework: frameworkData.code});
          } else {
            return throwError('no result for ' + this.frameworkName); // framework error need to handle this
          }
        } else {
          return throwError(frameworkDetails.err); // framework error
        }
      }));
  }
  private subscribeToQueryParams() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.formInputData = {};
      _.forIn(params, (value, key) => this.formInputData[key] = typeof value === 'string' && key !== 'key' ? [value] : value);
      if (this.formInputData.channel && this.formFieldProperties) { // To manuplulate channel data from identifier to name
        const channel = [];
         _.forEach(this.formInputData.channel, (value, key) => {
          const orgDetails = _.find(this.formFieldProperties, {code: 'channel'});
          const range = _.find(orgDetails['range'], {'identifier': value});
          channel.push(range['name']);
         });
         this.formInputData['channel'] =  channel;
      }
      this.showFilters = true;
      this.hardRefreshFilter();
    });
  }
  private getFormDetails() {
    const formServiceInputParams = {
      formType: 'content',
      formAction: this.formAction ? this.formAction : 'search',
      contentType: this.filterEnv,
      framework: this.framework
    };
    return this.formService.getFormConfig(formServiceInputParams, this.hashTagId);
  }

  resetFilters() {
    if (!_.isEmpty(this.ignoreQuery)) {
      this.formInputData = _.pick(this.formInputData, this.ignoreQuery);
    } else {
      this.formInputData = {};
    }
    this.router.navigate([], { relativeTo: this.activatedRoute.parent, queryParams: this.formInputData });
    this.hardRefreshFilter();
  }
  selectedValue(event, code) {
    this.formInputData[code] = event;
  }

  /**
 * To check filterType.
 */
  isObject(val) { return typeof val === 'object'; }

  applyFilters() {
    if (_.isEqual(this.formInputData, this.queryParams)) {
      this.isFiltered = true;
    } else {
      this.isFiltered = false;
      const queryParams: any = {};
    _.forIn(this.formInputData, (eachInputs: Array<any | object>, key) => {
        const formatedValue = typeof eachInputs === 'string' ? eachInputs :
        _.compact(_.map(eachInputs, value => typeof value === 'string' ? value : _.get(value, 'identifier')));
        if (formatedValue.length) {
          queryParams[key] = formatedValue;
        }
        if (key === 'channel') {
          queryParams[key] = this.populateChannelData(formatedValue);
        }
    });
    this.router.navigate([], { relativeTo: this.activatedRoute.parent, queryParams: queryParams });
    }
  }

  private populateChannelData(data) {
    const channel = [];
         _.forEach(data, (value, key) => {
          const orgDetails = _.find(this.formFieldProperties, {code: 'channel'});
          const range = _.find(orgDetails['range'], {name: value});
          channel.push(range['identifier']);
         });
         return channel;
  }

  public handleTopicChange(topicsSelected) {
    this.formInputData['topic'] = [];
    _.forEach(topicsSelected, (value, index) => {
      this.formInputData['topic'].push(value.name);
    });
    this.cdr.detectChanges();
  }

  private hardRefreshFilter() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
  private getOrgSearch() {
    return this.orgDetailsService.searchOrg().pipe(map(data => ( data.content )),
    catchError(err => {
      return [];
    }));
  }
  ngOnDestroy() {
    if (this.frameworkDataSubscription) {
      this.frameworkDataSubscription.unsubscribe();
    }
  }
}

