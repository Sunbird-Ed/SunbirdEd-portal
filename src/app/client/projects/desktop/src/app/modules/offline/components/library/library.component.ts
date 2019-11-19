import { Component, OnInit, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { ResourceService, ICaraouselData } from '@sunbird/shared';

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

    public contentList = [];
    public subjects = ['english', 'mathematics', 'geology', 'biology', 'zoology', 'Botany', 'Environmental Science'];


    constructor(
        public resourceService: ResourceService,
    ) { }

    ngOnInit() {
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
