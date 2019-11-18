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
