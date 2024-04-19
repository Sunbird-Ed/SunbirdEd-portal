import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalService } from './global.service';
import * as i0 from "@angular/core";
export declare class BaseService {
    http: HttpClient;
    globalService: GlobalService;
    constructor(http: HttpClient, globalService: GlobalService);
    private getDefaultHeaders;
    getRequest(url: any, params?: any, headers?: any): import("rxjs").Observable<any>;
    postRequest(url: any, data?: {}, headers?: any): import("rxjs").Observable<any>;
    handleError(error: HttpErrorResponse): import("rxjs").Observable<never>;
    toFormData<T>(formValue: T): FormData;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BaseService>;
}
//# sourceMappingURL=base.service.d.ts.map