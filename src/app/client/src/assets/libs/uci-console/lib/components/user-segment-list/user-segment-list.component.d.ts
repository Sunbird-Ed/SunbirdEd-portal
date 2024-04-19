import { EventEmitter, OnInit } from '@angular/core';
import { UciService } from '../../services/uci.service';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export declare class UserSegmentListComponent implements OnInit {
    private uciService;
    private route;
    cancel: EventEmitter<boolean>;
    add: EventEmitter<any>;
    selectedUserSegments: any[];
    userSegments: any[];
    selectedUserSegmentMap: {};
    pager: any;
    pageNumber: number;
    column: string;
    reverse: boolean;
    queryParams: any;
    search: any;
    constructor(uciService: UciService, route: Router);
    ngOnInit(): void;
    getUserSegment(): void;
    parseUserSegments(data: any): void;
    navigateToPage(page: number): undefined | void;
    getSearch(): void;
    onCancel(): void;
    onCheck(event: any, userSegment: any): void;
    onAdd(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserSegmentListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UserSegmentListComponent, "lib-user-segment-list", never, { "selectedUserSegments": { "alias": "selectedUserSegments"; "required": false; }; }, { "cancel": "cancel"; "add": "add"; }, never, never, false, never>;
}
//# sourceMappingURL=user-segment-list.component.d.ts.map