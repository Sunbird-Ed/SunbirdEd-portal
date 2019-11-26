import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { mergeMap, first } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';

import { OrgDetailsService, FrameworkService, ChannelService } from '@sunbird/core';
import { ResourceService, ToasterService } from '@sunbird/shared';

@Component({
    selector: 'app-library-filters',
    templateUrl: './library-filters.component.html',
    styleUrls: ['./library-filters.component.scss']
})
export class LibraryFiltersComponent implements OnInit {
    frameworkName: string;
    hashTagId: string;

    selectedBoard: any;
    selectedMedium: string;
    selectedClass: string;

    boards: Array<any> = [];
    mediums: Array<any> = [];
    classes: Array<any> = [];

    mediumLayout: LibraryFiltersLayout = LibraryFiltersLayout.SQUARE;
    classLayout: LibraryFiltersLayout = LibraryFiltersLayout.ROUND;

    frameworkCategories: any;
    filterQueryParam: any = {};

    @Input() data;
    @Output() libraryFilters: EventEmitter<any> = new EventEmitter();

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public resourceService: ResourceService,
        public frameworkService: FrameworkService,
        private orgDetailsService: OrgDetailsService,
        private channelService: ChannelService,
        private toasterService: ToasterService
    ) {
    }

    ngOnInit() {

        this.orgDetailsService.getOrgDetails().subscribe(orgdata => {
            this.readChannel();
        }, err => {
            this.toasterService.error(this.resourceService.messages.emsg.m0005);
        });
    }

    readChannel() {
        this.channelService.getFrameWork(_.get(this.orgDetailsService, 'orgDetails.hashTagId')).subscribe(data => {
            this.boards = _.get(data, 'result.channel.frameworks');

            this.getUserPreference();
        }, err => {
            // this.toasterService.error(this.resourceService.messages.emsg.m0005);
        });
    }

    getUserPreference() {
        this.selectedBoard = this.boards[0];
        this.onBoardChange(this.boards[0]);
    }

    setFilters() {
        this.frameworkCategories.forEach(element => {
            switch (element.code) {
                case 'medium':
                    this.mediums = element.terms.map(medium => medium.name);
                    break;
                case 'gradeLevel':
                    this.classes = element.terms.map(gradeLevel => gradeLevel.name);
                    break;
            }
        });

        const data = {
            filters: {
                board: this.selectedBoard.identifier
            }
        };

        this.libraryFilters.emit(data);
    }

    onBoardChange(option) {
        this.mediums = [];
        this.classes = [];
        this.selectedClass = '';
        this.selectedMedium = '';
        this.frameworkService.getFrameworkCategories(_.get(option, 'identifier')).subscribe((data) => {
            if (data && _.get(data, 'result.framework.categories')) {
                this.frameworkCategories = _.get(data, 'result.framework.categories');
                this.setFilters();
            }
        });
    }

    applyFilters(event, type) {
        this.getSelectedBMCData();

        if (type === 'medium') {
            this.filterQueryParam.medium = [event.data.text];
            this.filterQueryParam.class = '';
            this.selectedMedium = '';
        } else if (type === 'class') {
            this.filterQueryParam.gradeLevel = [event.data.text];
        }

        this.filterQueryParam['appliedFilters'] = true;
        this.router.navigate([], { relativeTo: this.activatedRoute.parent, queryParams: this.filterQueryParam });
    }

    getSelectedBMCData() {
        this.filterQueryParam.board = this.selectedBoard.identifier;

        if (this.selectedMedium && this.selectedMedium.length) {
            this.filterQueryParam.medium = this.selectedMedium;
        }

        if (this.selectedClass && this.selectedClass.length) {
            this.filterQueryParam.class = this.selectedClass;
        }
    }
}

