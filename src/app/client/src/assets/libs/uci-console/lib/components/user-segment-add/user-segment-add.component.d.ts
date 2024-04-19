import { EventEmitter, OnInit } from '@angular/core';
import { UciService } from '../../services/uci.service';
import { UciGraphQlService } from '../../services/uci-graph-ql.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class UserSegmentAddComponent implements OnInit {
    private uciService;
    private fb;
    private uciGraphQlService;
    cancel: EventEmitter<boolean>;
    add: EventEmitter<any>;
    formFieldProperties: Array<any>;
    userSegment: any;
    isLoaderShow: boolean;
    districts: any[];
    blocks: any[];
    schools: any[];
    clusters: any[];
    roles: any[];
    boards: any[];
    grade: number[];
    subjects: any[];
    userSegmentForm: UntypedFormGroup;
    state: string;
    constructor(uciService: UciService, fb: UntypedFormBuilder, uciGraphQlService: UciGraphQlService);
    ngOnInit(): void;
    onCancel(): void;
    onAdd(): void;
    afterAdd(data: any): void;
    getUciState(): void;
    getUciDistrict(): void;
    getUciBlock(): void;
    getUciCluster(): void;
    getUciSchoolDetails(): void;
    getUciRole(): void;
    getUciBoard(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserSegmentAddComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UserSegmentAddComponent, "lib-user-segment-add", never, {}, { "cancel": "cancel"; "add": "add"; }, never, never, false, never>;
}
//# sourceMappingURL=user-segment-add.component.d.ts.map