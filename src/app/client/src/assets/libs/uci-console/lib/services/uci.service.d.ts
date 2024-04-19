import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';
import * as i0 from "@angular/core";
export declare class UciService extends BaseService {
    http: HttpClient;
    globalService: GlobalService;
    BASE_URL: any;
    FORM_BASE_URL: string;
    constructor(http: HttpClient, globalService: GlobalService);
    fetchConversation(params: any): Observable<any>;
    searchConversation(params: any): Observable<any>;
    pauseConversation(botId: any): Observable<any>;
    startConversation(botId: any): Observable<any>;
    deleteConversation(botId: any): Observable<any>;
    getBotUserDetails(id: any): Observable<any>;
    getCheckStartingMessage(param: any): Observable<any>;
    botCreate(data: any): Observable<any>;
    botUpdate(id: any, data: any): Observable<any>;
    fetchUserSegment(params: any): Observable<any>;
    searchUserSegment(params: any): Observable<any>;
    createUserSegment(data: any): Observable<any>;
    userSegmentQueryBuilder(data: any): Observable<any>;
    createLogic(data: any): Observable<any>;
    updateLogic(id: any, data: any): Observable<any>;
    deleteLogic(id: any): Observable<any>;
    uploadFile(obj: any): Observable<any>;
    readForm(data: any): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<UciService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UciService>;
}
//# sourceMappingURL=uci.service.d.ts.map