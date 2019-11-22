import { Component, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { OrgDetailsService, FrameworkService } from '@sunbird/core';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';
import { mergeMap, first } from 'rxjs/operators';
import * as _ from 'lodash-es';

import {
    ConfigService, ResourceService, Framework, BrowserCacheTtlService, UtilService
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-library-filters',
    templateUrl: './library-filters.component.html',
    styleUrls: ['./library-filters.component.scss']
})
export class LibraryFiltersComponent implements OnInit, OnChanges {
    frameworkName: string;
    hashTagId: string;
    selectedBoard: string;

    boards: string[] = [];
    mediums: string[] = [];
    classes: string[] = [];

    mediumLayout = LibraryFiltersLayout.SQUARE;
    classLayout = LibraryFiltersLayout.ROUND;

    frameworkCategories: any;
    filterQueryParam: any = {};

    @Output() libraryFilters: EventEmitter<any> = new EventEmitter();
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public resourceService: ResourceService,
        public frameworkService: FrameworkService,
        private orgDetailsService: OrgDetailsService
    ) { }

    ngOnInit() {
        this.orgDetailsService.getOrgDetails().pipe(
            mergeMap((orgDetails: any) => {
                this.hashTagId = orgDetails.hashTagId;
                this.frameworkService.initialize(undefined, this.hashTagId);
                return this.frameworkService.frameworkData$;
            }), first()).subscribe((data) => {
                if (data && data.frameworkdata && data.frameworkdata.defaultFramework && data.frameworkdata.defaultFramework.categories) {
                    this.frameworkCategories = data.frameworkdata.defaultFramework.categories;
                    this.setFilters();
                }
            });
    }

    ngOnChanges(event) {
        console.log('event', event);
    }

    setFilters() {
        this.frameworkCategories.forEach(element => {
            switch (element.code) {
                case 'board':
                    this.boards = element.terms.map(state => state.name);
                    break;
                case 'medium':
                    this.mediums = element.terms.map(medium => medium.name);
                    break;
                case 'gradeLevel':
                    this.classes = element.terms.map(gradeLevel => gradeLevel.name);
                    break;
            }
        });

        this.libraryFilters.emit([]);
    }

    getSelectedFilters(event, type) {
        this.filterQueryParam.board = ['CBSE'];

        if (type === 'medium') {
            this.filterQueryParam.medium = [event.data.text];
        } else if (type === 'class') {
            this.filterQueryParam.gradeLevel = [event.data.text];
        }

        this.filterQueryParam['appliedFilters'] = true;
        this.router.navigate([], { relativeTo: this.activatedRoute.parent, queryParams: this.filterQueryParam });
        console.log('Event', event);
        console.log('filterQueryParam', this.filterQueryParam);
    }

    applyFilters() {

    }
}
