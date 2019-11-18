import { Component, OnInit, EventEmitter } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { Router, ActivatedRoute } from '@angular/router';
import { PageApiService, OrgDetailsService, UserService } from '@sunbird/core';
import {
    ResourceService, ToasterService, INoResultMessage, ConfigService, UtilService, ICaraouselData,
    BrowserCacheTtlService, NavigationHelperService
} from '@sunbird/shared';
import { takeUntil, map, mergeMap, first, filter, tap } from 'rxjs/operators';

import {
    OfflineFileUploaderService
} from './../../../../../../../../projects/desktop/src/app/modules/offline/services';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

    public showLoader = true;
    public queryParams: any;
    public hashTagId: string;
    public dataDrivenFilters: any = {};
    public slug: string;
    organisationId: string;
    public carouselMasterData: Array<ICaraouselData> = [];
    public pageSections: Array<ICaraouselData> = [];
    public initFilters = false;

    public dataDrivenFilterEvent = new EventEmitter();
    public unsubscribe$ = new Subject<void>();

    /* Hardcoded data */
    contentList = [];
    public subjects = ['english', 'mathematics', 'geology', 'biology', 'zoology', 'Botany', 'Environmental Science'];
    public mediums = [
        'english',
        'mathematics',
        'geology',
        'biology',
        'zoology',
        'Botany',
        'Environmental Science'
    ];

    classes = [
        'Class 1',
        'Class 2',
        'Class 3',
        'Class 4',
        'Class 5',
        'Class 6',
        'Class 7'
    ];

    /* Hardcoded data */

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pageApiService: PageApiService,
        private utilService: UtilService,
        private toasterService: ToasterService,
        private configService: ConfigService,
        private orgDetailsService: OrgDetailsService,
        public resourceService: ResourceService,
        public offlineFileUploaderService: OfflineFileUploaderService,
    ) { }

    ngOnInit() {
        this.orgDetailsService.getOrgDetails(this.activatedRoute.snapshot.params.slug).pipe(
            mergeMap((orgDetails: any) => {
                this.slug = orgDetails.slug;
                this.hashTagId = orgDetails.hashTagId;
                this.initFilters = true;
                this.organisationId = orgDetails.id;
                return this.dataDrivenFilterEvent;
            }), first()
        ).subscribe((filters: any) => {
            this.dataDrivenFilters = filters;
            this.fetchContentOnParamChange();
            // this.setNoResultMessage();
        },
            error => {
                console.error('Error', error);
                this.router.navigate(['']);
            }
        );

        setTimeout(() => {
            this.dataDrivenFilterEvent.emit([]);
        }, 1000);
        this.offlineFileUploaderService.isUpload.subscribe(() => {
            this.fetchPageData();
        });
    }

    private fetchContentOnParamChange() {
        combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(
            takeUntil(this.unsubscribe$))
            .subscribe((result) => {
                this.showLoader = true;
                this.queryParams = { ...result[1] };
                this.carouselMasterData = [];
                this.pageSections = [];
                this.fetchPageData();
            });
    }

    private fetchPageData() {
        const filters = _.pickBy(this.queryParams, (value: Array<string> | string, key) => {
            if (_.includes(['sort_by', 'sortType', 'appliedFilters'], key)) {
                return false;
            }
            return value.length;
        });
        const softConstraintData = {
            filters: {
                channel: this.hashTagId,
                board: [this.dataDrivenFilters.board]
            },
            softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
            mode: 'soft'
        };
        const manipulatedData = this.utilService.manipulateSoftConstraint(_.get(this.queryParams, 'appliedFilters'),
            softConstraintData);
        const option = {
            organisationId: this.organisationId,
            source: 'web',
            name: 'Explore',
            filters: _.get(this.queryParams, 'appliedFilters') ? filters : _.get(manipulatedData, 'filters'),
            mode: _.get(manipulatedData, 'mode'),
            exists: [],
            params: this.configService.appConfig.ExplorePage.contentApiQueryParams
        };
        if (_.get(manipulatedData, 'filters')) {
            option['softConstraints'] = _.get(manipulatedData, 'softConstraints');
        }
        this.pageApiService.getPageData(option)
            .subscribe(data => {
                this.showLoader = false;
                // this.carouselMasterData = this.prepareCarouselData(_.get(data, 'sections'));
                if (!this.carouselMasterData.length) {
                    return; // no page section
                }
                if (this.carouselMasterData.length >= 2) {
                    this.pageSections = [this.carouselMasterData[0], this.carouselMasterData[1]];
                } else if (this.carouselMasterData.length >= 1) {
                    this.pageSections = [this.carouselMasterData[0]];
                }
            }, err => {
                this.showLoader = false;
                this.carouselMasterData = [];
                this.pageSections = [];
                this.toasterService.error(this.resourceService.messages.fmsg.m0004);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onViewAllClick(event) {
        console.log('Event', event);
    }

    showAllList(event) {
        console.log('Event', event);
    }

    openContent(event) {
        console.log('Event', event);
    }
}
