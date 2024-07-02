import { of, throwError, Subscription, Subject } from 'rxjs';
import { first, mergeMap, map, catchError, filter } from 'rxjs/operators';
import {
  ConfigService, ResourceService, Framework, BrowserCacheTtlService, UtilService, LayoutService} from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnDestroy, ViewRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FrameworkService, FormService, PermissionService, UserService, OrgDetailsService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-data-driven-filter',
  templateUrl: './data-driven-filter.component.html',
  styleUrls: ['./data-driven-filter.component.scss']
})
export class DataDrivenFilterComponent implements OnInit, OnChanges, OnDestroy {
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
  @Input() layoutConfiguration;
  @Input() isOpen;
  public showFilters = false;

  public formFieldProperties: Array<any>;

  public filtersDetails: Array<any>;

  public categoryMasterList: Array<any>;

  public framework: string;
  public channelInputLabel: any;

  public formInputData: any;
  public unsubscribe = new Subject<void>();
  public refresh = true;

  public isShowFilterPlaceholder = true;

  public filterInteractEdata: IInteractEventEdata;

  public applyFilterInteractEdata: IInteractEventEdata;

  public resetFilterInteractEdata: IInteractEventEdata;
  telemetryCdata: Array<{}>;
  private selectedLanguage: string;
  resourceDataSubscription: Subscription;
  // add langauge default value en

  constructor(public configService: ConfigService, public resourceService: ResourceService, public router: Router,
    private activatedRoute: ActivatedRoute, private cacheService: CacheService, private cdr: ChangeDetectorRef,
    public frameworkService: FrameworkService, public formService: FormService,
    public userService: UserService, public permissionService: PermissionService, private utilService: UtilService,
    private browserCacheTtlService: BrowserCacheTtlService, private orgDetailsService: OrgDetailsService,
    public layoutService: LayoutService) {
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {
        // screen size
        if (window.innerWidth <= 992 ) {
          this.isOpen = false;
        }
    this.resourceDataSubscription = this.resourceService.languageSelected$
      .subscribe(item => {
        this.selectedLanguage = item.value;
        if (this.formFieldProperties && this.formFieldProperties.length > 0) {
          _.forEach(this.formFieldProperties, (data, index) => {
            this.formFieldProperties[index] = this.utilService.translateLabel(data, this.selectedLanguage);
            this.formFieldProperties[index].range = this.utilService.translateValues(data.range, this.selectedLanguage);
          });
          this.filtersDetails = _.cloneDeep(this.formFieldProperties);
          this.formInputData = this.utilService.convertSelectedOption(this.formInputData,
            this.formFieldProperties, 'en', this.selectedLanguage);
        }
      }
      );
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
    return this.fetchFrameWorkDetails().pipe(
      mergeMap((frameworkDetails: any) => {
        this.categoryMasterList = frameworkDetails.categoryMasterList;
        this.framework = frameworkDetails.code;
        return this.getFormDetails();
      }),
      mergeMap((formData: any) => {
        if (_.find(formData, { code: 'channel' })) {
          return this.getOrgSearch().pipe(map((channelData: any) => {
            const data = _.filter(channelData, 'hashTagId');
            return { formData: formData, channelData: data };
          }));
        } else {
          return of({ formData: formData });
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
              return {
                category: 'channel',
                identifier: value.hashTagId,
                name: value.orgName,
              };
            });
          } else {
            const loggedInUserRoles = _.get(this.userService, 'userProfile.userRoles');
            const frameworkTerms = _.get(_.find(this.categoryMasterList, { code: formFieldCategory.code }), 'terms');
            formFieldCategory.range = _.union(formFieldCategory.range, frameworkTerms);
            if (this.filterEnv === 'upforreview' && formFieldCategory.code === 'contentType' &&
              (_.includes(loggedInUserRoles, 'CONTENT_REVIEWER') && _.includes(loggedInUserRoles, 'BOOK_REVIEWER') &&
                !_.find(formFieldCategory.range, { name: 'TextBook' }))) {
              formFieldCategory.range.push({ name: 'TextBook' });
            }
          }
          if (this.selectedLanguage !== 'en') {
            formFieldCategory = this.utilService.translateLabel(formFieldCategory, this.selectedLanguage);
            formFieldCategory.range = this.utilService.translateValues(formFieldCategory.range, this.selectedLanguage);

          }
          return true;
        });
        formFieldProperties = _.sortBy(_.uniqBy(formFieldProperties, 'code'), 'index');
        return formFieldProperties;
      }));
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
            return of({ categoryMasterList: frameworkData.categories, framework: frameworkData.code });
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
      this.formInputData = this.utilService.convertSelectedOption(this.formInputData,
        this.formFieldProperties, 'en', this.selectedLanguage);

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
      _.forIn(data, (value, key) => this.formInputData[key] = value);
    }
    let redirectUrl; // if pageNumber exist then go to first page every time when filter changes, else go exact path
    if (this.activatedRoute.snapshot.params.pageNumber) { // when using dataDriven filter should this should be verified
      redirectUrl = this.router.url.split('?')[0].replace(/[^\/]+$/, '1');
    } else {
      redirectUrl = this.router.url.split('?')[0];
    }
    redirectUrl = decodeURI(redirectUrl);
    this.router.navigate([redirectUrl], { relativeTo: this.activatedRoute.parent, queryParams: this.formInputData });
    this.hardRefreshFilter();
    this.setFilterInteractData();
  }

  public applyFilters() {
    this.formInputData = this.utilService.convertSelectedOption(this.formInputData, this.formFieldProperties, this.selectedLanguage, 'en');
    const queryParams: any = {};
    _.forIn(this.formInputData, (eachInputs: Array<any | object>, key) => {
      const formatedValue = typeof eachInputs === 'string' ? eachInputs :
        _.compact(_.map(eachInputs, value => typeof value === 'string' ? value : _.get(value, 'identifier')));
      if (formatedValue.length) {
        queryParams[key] = formatedValue;
      }
    });
    let redirectUrl; // if pageNumber exist then go to first page every time when filter changes, else go exact path
    if (this.activatedRoute.snapshot.params.pageNumber) { // when using dataDriven filter should this should be verified
      redirectUrl = this.router.url.split('?')[0].replace(/[^\/]+$/, '1');
    } else {
      redirectUrl = this.router.url.split('?')[0];
    }
    redirectUrl = decodeURI(redirectUrl);
    if (!_.isEmpty(queryParams)) {
      queryParams['appliedFilters'] = true;
      this.router.navigate([redirectUrl], { queryParams: queryParams });
    }
    this.setFilterInteractData();
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
    if (this.activatedRoute.snapshot.queryParams.appliedFilters === 'false') {
      this.filtersDetails = this.formFieldProperties; // show all filters as implicit filters are applied
      return;
    }
    this.filtersDetails = _.map(this.formFieldProperties, (eachFields) => {
      const enrichField = _.cloneDeep(eachFields);
      if (!_.includes(['channel', 'contentType', 'topic'], enrichField.code)) {
        enrichField.range = _.filter(this.enrichFilters[enrichField.code],
          (field) => {
            return _.find(eachFields.range, { name: _.get(field, 'name')});
          });
      }
      return enrichField;
    });
    this.hardRefreshFilter();
  }
  public handleTopicChange(topicsSelected) {
    this.formInputData['topic'] = [];
    _.forEach(topicsSelected, (value, index) => {
      this.formInputData['topic'].push(value.name);
    });
    this.cdr.detectChanges();
  }

  private modelChange(data) {
    this.channelInputLabel = [];
    const orgDetails = _.find(this.formFieldProperties, ['code', 'channel']);
    if (orgDetails) {
      _.forEach(data, (value, key) => {
        this.channelInputLabel.push(_.find(orgDetails['range'], { identifier: value }));
        this.orgDetailsService.setOrg(this.channelInputLabel);
      });
    }
  }
  private setFilterInteractData() {
    setTimeout(() => { // wait for model to change
      const filters = _.pickBy(this.formInputData, (val, key) =>
        (!_.isEmpty(val) || typeof val === 'number')
          && _.map(this.formFieldProperties, field => field.code).includes(key));
      this.applyFilterInteractEdata = {
        id: 'apply-filter',
        type: 'click',
        pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
        extra: {filters: filters}
      };
      this.resetFilterInteractEdata = {
        id: 'reset-filter',
        type: 'click',
        pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
        extra: {filters: filters}
      };
      this.filterInteractEdata = {
        id: 'filter-accordion',
        type: 'click',
        pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid')
      };
    }, 5);
    const pageSection = this.cacheService.get('pageSection');
    if (_.get(pageSection, 'id' )) {
      this.telemetryCdata = [{ 'type': 'page-section', 'id': pageSection.id }];
    }
  }
  private hardRefreshFilter() {
    this.refresh = false;
    if (!(this.cdr as ViewRef).destroyed ) {
          this.cdr.detectChanges();
    }
    this.refresh = true;
  }
  getOrgSearch() {
    return this.orgDetailsService.searchOrg().pipe(map(data => (data.content)),
      catchError(err => {
        return [];
      }));
  }
  ngOnDestroy() {
    if (this.resourceDataSubscription) {
      this.resourceDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
