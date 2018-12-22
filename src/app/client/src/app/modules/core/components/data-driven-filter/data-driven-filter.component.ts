import { of, throwError } from 'rxjs';
import { first, mergeMap, map, tap , catchError, filter} from 'rxjs/operators';
import {
  ConfigService, ResourceService, Framework, BrowserCacheTtlService
} from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FrameworkService, FormService, PermissionService, UserService, OrgDetailsService  } from './../../services';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
import { IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-data-driven-filter',
  templateUrl: './data-driven-filter.component.html',
  styleUrls: ['./data-driven-filter.component.css']
})
export class DataDrivenFilterComponent implements OnInit, OnChanges {
  @Input() filterEnv: string;
  @Input() accordionDefaultOpen: boolean;
  @Input() isShowFilterLabel: boolean;
  @Input() hashTagId: string;
  @Input() ignoreQuery = [];
  @Input() showSearchedParam = true;
  @Input() enrichFilters: object;
  @Input() viewAllMode = false;
  @Input() pageId: string;
  @Input() frameworkName: string;
  @Input() formAction: string;
  @Output() dataDrivenFilter = new EventEmitter();

  public showFilters = false;

  public formFieldProperties: Array<any>;

  public filtersDetails: Array<any>;

  public categoryMasterList: Array<any>;

  public framework: string;
  public channelInputLabel: any;

  public formInputData: any;

  public refresh = true;

  public isShowFilterPlaceholder = true;

  public filterIntractEdata: IInteractEventEdata;

  public submitIntractEdata: IInteractEventEdata;

  constructor(public configService: ConfigService, public resourceService: ResourceService, public router: Router,
    private activatedRoute: ActivatedRoute, private cacheService: CacheService, private cdr: ChangeDetectorRef,
    public frameworkService: FrameworkService, public formService: FormService,
    public userService: UserService, public permissionService: PermissionService,
    private browserCacheTtlService: BrowserCacheTtlService, private orgDetailsService: OrgDetailsService ) {
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
    this.frameworkService.initialize(this.frameworkName, this.hashTagId);
    this.getFormatedFilterDetails().subscribe((formFieldProperties) => {
      this.formFieldProperties = formFieldProperties;
      this.filtersDetails = _.cloneDeep(formFieldProperties);
      this.dataDrivenFilter.emit(formFieldProperties);
      this.subscribeToQueryParams();
    }, (err) => {
      this.dataDrivenFilter.emit([]);
    });
    this.setFilterInteractData();
  }
  getFormatedFilterDetails() {
    const formAction = this.formAction ? this.formAction : 'search';
    const cachedFormData = this.cacheService.get(this.filterEnv + formAction);
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
              const loggedInUserRoles = _.get(this.userService, 'userProfile.userRoles');
            const frameworkTerms = _.get(_.find(this.categoryMasterList, { code : formFieldCategory.code}), 'terms');
            formFieldCategory.range = _.union(formFieldCategory.range, frameworkTerms);
            if (this.filterEnv === 'upforreview' && formFieldCategory.code === 'contentType' &&
            (_.includes(loggedInUserRoles, 'CONTENT_REVIEWER') && _.includes(loggedInUserRoles, 'BOOK_REVIEWER') &&
            !_.find(formFieldCategory.range, { name: 'TextBook' }))) {
                  formFieldCategory.range.push({ name: 'TextBook' });
            }
            }
            return true;
          });
          formFieldProperties = _.sortBy(_.uniqBy(formFieldProperties, 'code'), 'index');
          return formFieldProperties;
        }),
        tap((formFieldProperties) => {
          this.cacheService.set(this.filterEnv + formAction, formFieldProperties,
            {maxAge: this.browserCacheTtlService.browserCacheTtl});
        }));
    }
  }
  private fetchFrameWorkDetails() {
    return this.frameworkService.frameworkData$.pipe(filter((frameworkDetails) => { // wait to get the framework name if passed as input
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
       if (params.channel) {
        this.modelChange(this.formInputData.channel);
         this.channelInputLabel = this.orgDetailsService.getOrg();
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

  public resetFilters() {
    this.formInputData = _.pick(this.formInputData, this.ignoreQuery);
    if (this.viewAllMode) {
      const data = this.cacheService.get('viewAllQuery');
      _.forIn(data, (value, key ) => this.formInputData[key] = value);
    }
    this.router.navigate([], { relativeTo: this.activatedRoute.parent, queryParams: this.formInputData });
    this.hardRefreshFilter();
  }

  public applyFilters() {
    const queryParams: any = {};
    _.forIn(this.formInputData, (eachInputs: Array<any | object>, key) => {
        const formatedValue = typeof eachInputs === 'string' ? eachInputs :
        _.compact(_.map(eachInputs, value => typeof value === 'string' ? value : _.get(value, 'identifier')));
        if (formatedValue.length) {
          queryParams[key] = formatedValue;
        }
    });
    this.router.navigate([], { relativeTo: this.activatedRoute.parent, queryParams: queryParams });
  }

  public removeFilterSelection(field, item) {
    const itemIndex = this.formInputData[field].indexOf(item);
    if (itemIndex !== -1) {
      this.formInputData[field].splice(itemIndex, 1);
      if (field === 'channel') {
        this.channelInputLabel.splice(itemIndex, 1);
      }
      this.formInputData = _.pickBy(this.formInputData);
      this.hardRefreshFilter();
    }
  }
  ngOnChanges() {
    if (this.formFieldProperties && this.enrichFilters) {
      this.enrichFiltersOnInputChange();
    }
  }
  private enrichFiltersOnInputChange() {
    this.filtersDetails = _.map(this.formFieldProperties, (eachFields) => {
      eachFields.range = _.filter(this.enrichFilters[eachFields.code],
        (field) => _.get(field, 'name') && field.name !== '');
      return eachFields;
    });
    this.hardRefreshFilter();
  }
  public handleTopicChange(topicsSelected) {
    this.formInputData['topic'] = topicsSelected;
    this.cdr.detectChanges();
  }

  private modelChange(data) {
    this.channelInputLabel = [];
    const orgDetails = _.find(this.formFieldProperties, ['code', 'channel']);
    if (orgDetails) {
      _.forEach(data, (value, key) => {
        this.channelInputLabel.push(_.find(orgDetails['range'], {identifier: value}));
        this.orgDetailsService.setOrg(this.channelInputLabel);
       });
    }
  }
  private setFilterInteractData() {
    this.submitIntractEdata = {
      id: 'submit',
      type: 'click',
      pageid: this.pageId,
      extra: { filter: this.formInputData }
    };
    this.filterIntractEdata = {
      id: 'filter',
      type: 'click',
      pageid: this.pageId
    };
  }
  private hardRefreshFilter() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
  getOrgSearch() {
    return this.orgDetailsService.searchOrg().pipe(map(data => ( data.content )),
    catchError(err => {
      return [];
    }));
  }
}
