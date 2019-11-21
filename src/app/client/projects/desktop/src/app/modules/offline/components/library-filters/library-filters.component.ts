import { Component, OnInit } from '@angular/core';
import { OrgDetailsService, FrameworkService } from '@sunbird/core';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';
import { mergeMap, first } from 'rxjs/operators';
import * as _ from 'lodash-es';

import {
    ConfigService, ResourceService, Framework, BrowserCacheTtlService, UtilService
} from '@sunbird/shared';

@Component({
    selector: 'app-library-filters',
    templateUrl: './library-filters.component.html',
    styleUrls: ['./library-filters.component.scss']
})
export class LibraryFiltersComponent implements OnInit {
    frameworkName: string;
    hashTagId: string;


    boards: string[] = [];
    mediums: string[] = [];
    classes: string[] = [];

    mediumLayout = LibraryFiltersLayout.SQUARE;
    classLayout = LibraryFiltersLayout.ROUND;

    frameworkCategories: any;

    constructor(
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
    }

    getSelectedFilters(event, type) {
        console.log('Event', event);
    }
}
