import { Component, OnInit, EventEmitter, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import * as _ from 'lodash-es';
import {
    ResourceService, ToasterService, ConfigService, UtilService, ICaraouselData, INoResultMessage,
} from '@sunbird/shared';
import { SearchService } from '@sunbird/core';
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

    public sections: Array<any> = [];
    public initFilters = false;
    public userDetails: any = {};
    public selectedFilters: any;

    public dataDrivenFilterEvent = new EventEmitter();
    public unsubscribe$ = new Subject<void>();

    public noResultMessage: INoResultMessage;
    public recentlyAddedContents = [];

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
        private utilService: UtilService,
        public toasterService: ToasterService,
        private configService: ConfigService,
        private resourceService: ResourceService,
        private publicPlayerService: PublicPlayerService,
        public searchService: SearchService
    ) { }

    ngOnInit() {
        this.getSelectedFilters();
        this.setNoResultMessage();
    }

    getSelectedFilters() {
        this.selectedFilters = this.publicPlayerService.libraryFilters;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    onFilterChange(event) {
        this.showLoader = true;
        this.dataDrivenFilters = _.cloneDeep(event.filters);
        this.resetSections();
        this.fetchContents();
        this.publicPlayerService.libraryFilters = event.filters;
        this.hashTagId = event.channelId;
    }

    resetSections() {
        this.carouselMasterData = [];
        this.pageSections = [];
    }

    constructSearchRequest(addFilters) {
        let filters = _.pickBy(this.dataDrivenFilters, (value: Array<string> | string) => value && value.length);
        filters = _.omit(filters, ['key', 'sort_by', 'sortType', 'appliedFilters']);
        const softConstraintData: any = {
            filters: {
                channel: this.hashTagId
            },
            softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
            mode: 'soft'
        };
        if (this.dataDrivenFilters.board) {
            softConstraintData.board = this.dataDrivenFilters.board;
        }
        const facets = ['board', 'medium', 'gradeLevel', 'subject'];
        const manipulatedData = this.utilService.manipulateSoftConstraint(_.get(this.dataDrivenFilters, 'appliedFilters'),
            softConstraintData);
        const option = {
            filters: {},
            mode: _.get(manipulatedData, 'mode'),
            facets: facets,
            params: this.configService.appConfig.ExplorePage.contentApiQueryParams,
        };
        if (addFilters) {
            option.filters = _.get(this.dataDrivenFilters, 'appliedFilters') ? filters : manipulatedData.filters;
        }
        option.filters['contentType'] = filters.contentType || ['Collection', 'TextBook', 'LessonPlan', 'Resource'];
        if (manipulatedData.filters) {
            option['softConstraints'] = _.get(manipulatedData, 'softConstraints');
        }
        return option;
    }

    fetchContents() {
        const isBrowse = Boolean(this.router.url.includes('browse'));

        // First call - Search content with selected filters and API should call always.
        // Second call - Search content without selected filters and API should not call in browse page
        combineLatest(this.searchContent(true, false), this.searchContent(false, isBrowse)).subscribe(
            ([response1, response2]) => {
                if (response1) {
                    this.showLoader = false;
                    const filteredContents = _.omit(_.groupBy(response1['result'].content, 'subject'), ['undefined']);
                    this.sections = [];

                    if (response2) {
                        this.sections.push({
                            contents: _.orderBy(_.get(response2, 'result.content'), ['desktopAppMetadata.updatedOn'], ['desc']),
                            name: 'Recently Added'
                        });
                    }

                    for (const section in filteredContents) {
                        if (section) {
                            this.sections.push({
                                name: section,
                                contents: filteredContents[section]
                            });
                        }
                    }
                    this.carouselMasterData = this.prepareCarouselData(this.sections);
                    if (!this.carouselMasterData.length) {
                        return; // no page section
                    }
                    if (this.carouselMasterData.length >= 2) {
                        this.pageSections = [this.carouselMasterData[0], this.carouselMasterData[1]];
                    } else if (this.carouselMasterData.length >= 1) {
                        this.pageSections = [this.carouselMasterData[0]];
                    }
                } else {
                    this.showLoader = false;
                    this.carouselMasterData = [];
                    this.pageSections = [];
                    this.toasterService.error(this.resourceService.messages.fmsg.m0004);
                }
            }
        );
    }

    private prepareCarouselData(sections = []) {
        const { constantData, metaData, dynamicFields } = this.configService.appConfig.ExplorePage;
        const carouselData = _.reduce(sections, (collector, element) => {
            const contents = _.get(element, 'contents') || [];
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

    searchContent(addFilter: boolean, shouldCallAPI) {
        if (shouldCallAPI) {
            return of(undefined);
        }
        const option = this.constructSearchRequest(addFilter);
        return this.searchService.contentSearch(option).pipe(
            tap(data => {
            }), catchError(error => {
                return of(undefined);
            }));
    }

    onViewAllClick(event) {
        const queryParams = {
            channel: this.hashTagId
        };

        this.router.navigate(['view-all'], {
            queryParams: queryParams
        });
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
        // console.log('AfterChange', event);
    }
}
