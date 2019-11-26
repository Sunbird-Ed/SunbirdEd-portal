import { Component, OnInit, EventEmitter, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash-es';
import {
    ResourceService, ToasterService, ConfigService, UtilService, ICaraouselData, INoResultMessage,
    BrowserCacheTtlService
} from '@sunbird/shared';
import { PageApiService, OrgDetailsService, UserService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { PublicPlayerService } from '@sunbird/public';

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

    public noResultMessage: INoResultMessage;

    slideConfig = this.configService.appConfig.CourseBatchPageSection.slideConfig;

    @HostListener('window:scroll', []) onScroll(): void {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
            && this.pageSections.length < this.carouselMasterData.length) {
            this.pageSections.push(this.carouselMasterData[this.pageSections.length]);
        }
    }
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pageApiService: PageApiService,
        private utilService: UtilService,
        private toasterService: ToasterService,
        private configService: ConfigService,
        private resourceService: ResourceService,
        private orgDetailsService: OrgDetailsService,
        private cacheService: CacheService,
        private browserCacheTtlService: BrowserCacheTtlService,
        private publicPlayerService: PublicPlayerService
    ) { }

    ngOnInit() {
        this.setNoResultMessage();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    getFilters(data) {
        this.dataDrivenFilters = data.filters;
        this.fetchContentOnParamChange();
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
                this.carouselMasterData = this.prepareCarouselData(_.get(data, 'sections'));
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

    private prepareCarouselData(sections = []) {
        const { constantData, metaData, dynamicFields, slickSize } = this.configService.appConfig.ExplorePage;
        const carouselData = _.reduce(sections, (collector, element) => {
            const contents = _.slice(_.get(element, 'contents'), 0, slickSize) || [];
            element.contents = this.utilService.getDataForCard(contents, constantData, dynamicFields, metaData);
            if (element.contents && element.contents.length) {
                element.contents.forEach((item) => {
                    item.cardImg = item.cardImg || item.courseLogoUrl || 'assets/images/book.png';
                });
                collector.push(element);
            }
            return collector;
        }, []);
        return carouselData;
    }

    private setNoResultMessage() {
        if (!(this.router.url.includes('/browse'))) {
            this.noResultMessage = {
                message: 'messages.stmsg.m0007',
                messageText: 'messages.stmsg.m0133'
            };
        } else {
            this.noResultMessage = {
                message: 'messages.stmsg.m0007',
                messageText: 'messages.stmsg.m0006'
            };
        }
    }

    onViewAllClick(event) {
        const section = _.cloneDeep(this.carouselMasterData[0]);
        const searchQuery = JSON.parse(section.searchQuery);
        const softConstraintsFilter = {
            board: [this.dataDrivenFilters.board],
            channel: this.hashTagId,
        };
        if (_.includes(this.router.url, 'browse')) {
            searchQuery.request.filters.defaultSortBy = JSON.stringify(searchQuery.request.sort_by);
            searchQuery.request.filters.softConstraintsFilter = JSON.stringify(softConstraintsFilter);
            searchQuery.request.filters.exists = searchQuery.request.exists;
        }
        this.cacheService.set('viewAllQuery', searchQuery.request.filters);
        this.cacheService.set('pageSection', section, { maxAge: this.browserCacheTtlService.browserCacheTtl });
        const queryParams = { ...searchQuery.request.filters, ...this.queryParams };
        const sectionUrl = this.router.url.split('?')[0] + '/view-all/' + section.name.replace(/\s/g, '-');
        this.router.navigate([sectionUrl, 1], { queryParams: queryParams });

    }

    public playContent(event) {
        if (_.includes(this.router.url, 'browse')) {
            this.publicPlayerService.playContentForOfflineBrowse(event);
        } else {
            this.publicPlayerService.playContent(event);
        }
    }


    // To Handle in-view logs
    afterChange(event) {
        console.log('AfterChange', event);
    }
}
