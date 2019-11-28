import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { LibraryFiltersLayout } from '@project-sunbird/common-consumption';

import { OrgDetailsService, FrameworkService, ChannelService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
import { OnboardingService } from '../../services';

@Component({
    selector: 'app-library-filters',
    templateUrl: './library-filters.component.html',
    styleUrls: ['./library-filters.component.scss']
})
export class LibraryFiltersComponent implements OnInit {

    selectedBoard: any;
    selectedMediumIndex: number[] = [];
    selectedClassIndex: number[] = [];

    boards: Array<any> = [];
    mediums: Array<any> = [];
    classes: Array<any> = [];

    mediumLayout: LibraryFiltersLayout = LibraryFiltersLayout.SQUARE;
    classLayout: LibraryFiltersLayout = LibraryFiltersLayout.ROUND;

    frameworkCategories: any;
    userDetails: any;

    @Input() selectedFilters;
    @Output() filterChange: EventEmitter<any> = new EventEmitter();

    constructor(
        public resourceService: ResourceService,
        public frameworkService: FrameworkService,
        private orgDetailsService: OrgDetailsService,
        private channelService: ChannelService,
        private onboardingService: OnboardingService
    ) { }

    ngOnInit() {
        this.userDetails = this.onboardingService.userData;
        this.setBMC();
    }

    setBMC() {
        this.channelService.getFrameWork(_.get(this.orgDetailsService, 'orgDetails.hashTagId')).subscribe(orgDetails => {
            this.boards = _.get(orgDetails, 'result.channel.frameworks');

            if (this.boards) {

                if (this.selectedFilters && this.selectedFilters.board) {
                    this.selectedBoard = this.boards.find((board) => board.name === this.selectedFilters.board);
                } else {
                    this.selectedBoard = this.boards.find((board) => board.name === this.userDetails.framework.board);
                }
            }

            if (this.selectedBoard) {
                this.frameworkService.getFrameworkCategories(_.get(this.selectedBoard, 'identifier')).subscribe((res) => {
                    if (res && _.get(res, 'result.framework.categories')) {
                        this.frameworkCategories = _.get(res, 'result.framework.categories');
                        if (this.selectedFilters.board) {
                            this.setFilters(false);
                        } else {
                            this.setFilters(true);
                        }
                    }
                });
            }
        });
    }

    setFilters(showDefault?) {
        this.resetFilters();
        const framework = this.userDetails.framework;
        const filters: any = {
            board: this.selectedBoard.name
        };
        this.frameworkCategories.forEach(element => {
            switch (element.code) {
                case 'medium':
                    this.mediums = element.terms.map(medium => medium.name);

                    let mediumIndex;
                    if (this.selectedFilters.medium) {
                        mediumIndex = this.mediums.findIndex((medium) => medium === this.selectedFilters.medium);
                    } else if (showDefault) {
                        mediumIndex = this.mediums.findIndex(medium => framework.medium.includes(medium));
                    }

                    if (_.isNumber(mediumIndex)) {
                        this.selectedMediumIndex.push(mediumIndex);
                        filters.medium = this.mediums[this.selectedMediumIndex[0]];
                    }
                    break;
                case 'gradeLevel':
                    this.classes = element.terms.map(gradeLevel => gradeLevel.name);
                    let classIndex;

                    if (this.selectedFilters.gradeLevel) {
                        classIndex = this.classes.findIndex((classElement) =>
                            classElement === this.selectedFilters.gradeLevel);
                    } else if (showDefault) {
                        classIndex = this.classes.findIndex(value => framework.gradeLevel.includes(value));
                    }

                    if (_.isNumber(classIndex)) {
                        this.selectedClassIndex.push(classIndex);
                        filters.gradeLevel = this.classes[this.selectedClassIndex[0]];
                    }
                    break;
            }
        });

        this.filterChange.emit(filters);
    }

    onBoardChange(option) {
        this.resetFilters();
        this.frameworkService.getFrameworkCategories(_.get(option, 'identifier')).subscribe((data) => {
            if (data && _.get(data, 'result.framework.categories')) {
                this.frameworkCategories = _.get(data, 'result.framework.categories');
                this.setFilters(false);
            }
        });
    }

    resetFilters() {
        this.mediums = [];
        this.classes = [];
        this.selectedClassIndex = [];
        this.selectedMediumIndex = [];

    }

    applyFilters(event, type) {
        this.getSelectedBMCData();

        if (type === 'medium') {
            this.selectedMediumIndex = [event.data.index];
            this.selectedClassIndex = [];
        } else if (type === 'class') {
            this.selectedClassIndex = [event.data.index];
        }

        this.filterChange.emit(this.getSelectedBMCData());
    }

    getSelectedBMCData() {
        const filters: any = {};
        filters.board = this.selectedBoard.name;

        if (this.selectedMediumIndex.length) {
            filters.appliedFilters = true;
            filters.medium = this.mediums[this.selectedMediumIndex[0]];
        }

        if (this.selectedClassIndex.length) {
            filters.appliedFilters = true;
            filters.gradeLevel = this.classes[this.selectedClassIndex[0]];
        }

        return filters;
    }
}

