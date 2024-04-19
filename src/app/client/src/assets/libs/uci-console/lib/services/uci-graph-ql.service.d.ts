import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { GlobalService } from './global.service';
import * as i0 from "@angular/core";
export declare class UciGraphQlService extends BaseService {
    http: HttpClient;
    globalService: GlobalService;
    BASE_URL: any;
    constructor(http: HttpClient, globalService: GlobalService);
    getState(): import("rxjs").Observable<Object>;
    getDistrict(param: any): import("rxjs").Observable<Object>;
    getBlock(param: any): import("rxjs").Observable<Object>;
    getSchoolDetails(param: any): import("rxjs").Observable<Object>;
    getClusters(param: any): import("rxjs").Observable<Object>;
    getRole(): import("rxjs").Observable<Object>;
    getBoards(): import("rxjs").Observable<Object>;
    private baseRequest;
    static ɵfac: i0.ɵɵFactoryDeclaration<UciGraphQlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UciGraphQlService>;
}
//# sourceMappingURL=uci-graph-ql.service.d.ts.map