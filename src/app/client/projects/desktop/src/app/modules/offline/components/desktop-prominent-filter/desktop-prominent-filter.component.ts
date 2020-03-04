import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, of, throwError, Observable, Subject } from 'rxjs';
import { first, mergeMap, map, catchError, filter, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';

import { IInteractEventEdata } from '@sunbird/telemetry';
import {
    ConfigService, ResourceService, Framework, ToasterService, UtilService,
} from '@sunbird/shared';
import { FrameworkService, FormService, PermissionService, OrgDetailsService } from '@sunbird/core';
@Component({
    selector: 'app-desktop-prominent-filter',
    templateUrl: './desktop-prominent-filter.component.html',
    styleUrls: ['./desktop-prominent-filter.component.scss']
})
export class DesktopProminentFilterComponent implements OnInit, OnDestroy {

    @Input() filterEnv: string;
    @Input() hashTagId = '';
    @Input() ignoreQuery = [];
    @Input() pageId: string;
    @Input() frameworkName: string;

    @Output() prominentFilter = new EventEmitter();
    @Output() filterChange: EventEmitter<any> = new EventEmitter();

    public filterType: string;
    public formFieldProperties: any;
    public filtersDetails: any;
    public categoryMasterList: any;
    public framework: string;
    public isCachedDataExists: boolean;
    public formType = 'content';
    public queryParams: any;
    public formInputData: any;
    public unsubscribe$ = new Subject<void>();
    refresh = true;
    isFiltered = true;

    public resetFilterInteractEdata: IInteractEventEdata;
    public applyFilterInteractEdata: IInteractEventEdata;
    public selectedLanguage: string;

    constructor(
        public resourceService: ResourceService,
        public router: Router,
        private activatedRoute: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        public frameworkService: FrameworkService,
        public formService: FormService,
        public toasterService: ToasterService,
        public permissionService: PermissionService,
        private utilService: UtilService,
        private orgDetailsService: OrgDetailsService,
        public configService: ConfigService
    ) {
        this.formInputData = {};
        this.router.onSameUrlNavigation = 'reload';
    }

    ngOnInit() {
        this.resourceService.languageSelected$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(item => {
                this.selectedLanguage = item.value;
                if (this.formFieldProperties && this.formFieldProperties.length) {
                    _.forEach(this.formFieldProperties, (data, index) => {
                        this.formFieldProperties[index] = this.utilService.translateLabel(data, this.selectedLanguage);
                        this.formFieldProperties[index].range = this.utilService.translateValues(data.range, this.selectedLanguage);
                    });
                    this.filtersDetails = _.cloneDeep(this.formFieldProperties);
                    this.formInputData = this.utilService.convertSelectedOption(this.formInputData,
                        this.formFieldProperties, 'en', this.selectedLanguage);
                }
            });
        this.frameworkService.initialize(this.frameworkName, this.hashTagId);
        this.getFormatedFilterDetails()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((formFieldProperties) => {
                this.formFieldProperties = formFieldProperties;
                this.prominentFilter.emit(formFieldProperties);
            }, (err) => {
                this.prominentFilter.emit([]);
            });
        this.setFilterInteractData();
    }

    private setFilterInteractData() {
        setTimeout(() => { // wait for model to change
            const filters = _.pickBy(this.formInputData, (val, key) =>
                (!_.isEmpty(val) || typeof val === 'number')
                && _.map(this.formFieldProperties, field => field.code).includes(key));
            this.applyFilterInteractEdata = {
                id: 'apply-filter',
                type: 'click',
                pageid: this.pageId,
                extra: { filters: filters }
            };
            this.resetFilterInteractEdata = {
                id: 'reset-filter',
                type: 'click',
                pageid: this.pageId,
                extra: { filters: filters }
            };
        }, 5);
    }

    getFormatedFilterDetails(): Observable<any> {
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
                    if (formFieldCategory.code === 'channel') {
                        formFieldCategory.range = _.map(formData.channelData, (value) => {
                            return {
                                category: 'channel',
                                identifier: value.hashTagId,
                                name: value.orgName,
                            };
                        });
                    } else {
                        const frameworkTerms = _.get(_.find(this.categoryMasterList, { code: formFieldCategory.code }), 'terms');
                        formFieldCategory.range = _.union(formFieldCategory.range, frameworkTerms);
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
        return this.frameworkService.frameworkData$.pipe(filter((frameworkDetails: any) => {
            if (!frameworkDetails.err) {
                const framework = this.frameworkName ? this.frameworkName : 'defaultFramework';
                return Boolean(_.get(frameworkDetails.frameworkdata, framework));
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

    private getFormDetails() {
        const formServiceInputParams = {
            formType: 'content',
            formAction: 'search',
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
        this.filterChange.emit([]);
        this.hardRefreshFilter();
        this.setFilterInteractData();
    }

    selectedValue(event, code) {
        this.formInputData[code] = event;
    }

    applyFilters() {
        this.formInputData = this.utilService.convertSelectedOption(
            this.formInputData, this.formFieldProperties, this.selectedLanguage, 'en');
        if (_.isEqual(this.formInputData, this.queryParams)) {
            this.isFiltered = true;
        } else {
            this.isFiltered = false;
            const data: any = {};
            const filters: any = {};
            _.forIn(this.formInputData, (eachInputs: Array<any | object>, key) => {
                const formatedValue = typeof eachInputs === 'string' ? eachInputs :
                    _.compact(_.map(eachInputs, value => typeof value === 'string' ? value : _.get(value, 'identifier')));
                if (formatedValue.length) {
                    filters[key] = formatedValue;
                }
                if (key === 'channel') {
                    filters[key] = this.populateChannelData(formatedValue);
                }
            });
            if (!_.isEmpty(filters)) {
                data.filters = filters;
                data.filters.appliedFilters = true;
                this.filterChange.emit(data);
            }
        }
        this.setFilterInteractData();
    }

    private populateChannelData(data) {
        const channel = [];
        _.forEach(data, (value, key) => {
            const orgDetails = _.find(this.formFieldProperties, { code: 'channel' });
            const range = _.find(orgDetails['range'], { name: value });
            channel.push(range['identifier']);
        });
        return channel;
    }

    private hardRefreshFilter() {
        this.refresh = false;
        this.cdr.detectChanges();
        this.refresh = true;
    }

    private getOrgSearch() {
        return this.orgDetailsService.searchOrg().pipe(map((data: any) => (data.content)),
            catchError(err => {
                return [];
            }));
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}

