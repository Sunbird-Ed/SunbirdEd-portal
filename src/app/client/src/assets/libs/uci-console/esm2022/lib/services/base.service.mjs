import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./global.service";
export class BaseService {
    constructor(http, globalService) {
        this.http = http;
        this.globalService = globalService;
    }
    getDefaultHeaders() {
        const headers = {};
        const user = this.globalService.getUser();
        if (user && user.id) {
            headers.ownerID = user.id;
        }
        if (user && user.rootOrgId) {
            headers.ownerOrgID = user.rootOrgId;
        }
        return headers;
    }
    getRequest(url, params = {}, headers = {}) {
        headers = {
            ...headers,
            ...this.getDefaultHeaders()
        };
        return this.http.get(url, { params, headers }).pipe(map((res) => {
            return res.result;
        }), catchError(err => {
            return this.handleError(err);
        }));
    }
    postRequest(url, data = {}, headers = {}) {
        headers = {
            ...headers,
            ...this.getDefaultHeaders()
        };
        return this.http.post(url, data, { headers }).pipe(map((res) => {
            return res.result;
        }), catchError(err => {
            return this.handleError(err);
        }));
    }
    handleError(error) {
        if (error instanceof ErrorEvent) {
            return throwError(error['error']['message']);
        }
        return throwError(error.error);
    }
    toFormData(formValue) {
        const formData = new FormData();
        console.error("[UCI Console]", JSON.stringify(formValue));
        for (const key of Object.keys(formValue)) {
            const value = formValue[key];
            formData.append(key, value);
        }
        return formData;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BaseService, deps: [{ token: i1.HttpClient }, { token: i2.GlobalService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BaseService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BaseService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.GlobalService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdWNpLWNvbnNvbGUvc3JjL2xpYi9zZXJ2aWNlcy9iYXNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUcvQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7QUFLaEMsTUFBTSxPQUFPLFdBQVc7SUFDcEIsWUFBbUIsSUFBZ0IsRUFBUyxhQUE0QjtRQUFyRCxTQUFJLEdBQUosSUFBSSxDQUFZO1FBQVMsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFDeEUsQ0FBQztJQUVPLGlCQUFpQjtRQUNyQixNQUFNLE9BQU8sR0FBUSxFQUFFLENBQUM7UUFDeEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMxQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ2pCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUM3QjtRQUNELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3ZDO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVNLFVBQVUsQ0FBQyxHQUFHLEVBQUUsU0FBYyxFQUFFLEVBQUUsVUFBZSxFQUFFO1FBQ3RELE9BQU8sR0FBRztZQUNOLEdBQUcsT0FBTztZQUNWLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1NBQzlCLENBQUM7UUFFRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FDN0MsR0FBRyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7WUFDYixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDdEIsQ0FBQyxDQUFDLEVBQ0YsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUNMLENBQUM7SUFDTixDQUFDO0lBRU0sV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLFVBQWUsRUFBRTtRQUNoRCxPQUFPLEdBQUc7WUFDTixHQUFHLE9BQU87WUFDVixHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtTQUM5QixDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVDLEdBQUcsQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFO1lBQ2IsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxFQUNGLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNiLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQztJQUdNLFdBQVcsQ0FBQyxLQUF3QjtRQUN2QyxJQUFJLEtBQUssWUFBWSxVQUFVLEVBQUU7WUFDN0IsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDaEQ7UUFFRCxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVNLFVBQVUsQ0FBSSxTQUFZO1FBQzdCLE1BQU0sUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBRXpELEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN0QyxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDL0I7UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDOytHQXBFUSxXQUFXO21IQUFYLFdBQVcsY0FGUixNQUFNOzs0RkFFVCxXQUFXO2tCQUh2QixVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SHR0cENsaWVudCwgSHR0cEVycm9yUmVzcG9uc2V9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R2xvYmFsU2VydmljZX0gZnJvbSAnLi9nbG9iYWwuc2VydmljZSc7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHt0aHJvd0Vycm9yfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBCYXNlU2VydmljZSB7XG4gICAgY29uc3RydWN0b3IocHVibGljIGh0dHA6IEh0dHBDbGllbnQsIHB1YmxpYyBnbG9iYWxTZXJ2aWNlOiBHbG9iYWxTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXREZWZhdWx0SGVhZGVycygpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyczogYW55ID0ge307XG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLmdsb2JhbFNlcnZpY2UuZ2V0VXNlcigpO1xuICAgICAgICBpZiAodXNlciAmJiB1c2VyLmlkKSB7XG4gICAgICAgICAgICBoZWFkZXJzLm93bmVySUQgPSB1c2VyLmlkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VyICYmIHVzZXIucm9vdE9yZ0lkKSB7XG4gICAgICAgICAgICBoZWFkZXJzLm93bmVyT3JnSUQgPSB1c2VyLnJvb3RPcmdJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoZWFkZXJzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRSZXF1ZXN0KHVybCwgcGFyYW1zOiBhbnkgPSB7fSwgaGVhZGVyczogYW55ID0ge30pIHtcbiAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICAgIC4uLmhlYWRlcnMsXG4gICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRIZWFkZXJzKClcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwsIHtwYXJhbXMsIGhlYWRlcnN9KS5waXBlKFxuICAgICAgICAgICAgbWFwKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMucmVzdWx0O1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIHBvc3RSZXF1ZXN0KHVybCwgZGF0YSA9IHt9LCBoZWFkZXJzOiBhbnkgPSB7fSkge1xuICAgICAgICBoZWFkZXJzID0ge1xuICAgICAgICAgICAgLi4uaGVhZGVycyxcbiAgICAgICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEhlYWRlcnMoKVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIGRhdGEsIHtoZWFkZXJzfSkucGlwZShcbiAgICAgICAgICAgIG1hcCgocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnJlc3VsdDtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yKGVycik7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuXG4gICAgcHVibGljIGhhbmRsZUVycm9yKGVycm9yOiBIdHRwRXJyb3JSZXNwb25zZSkge1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvckV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvclsnZXJyb3InXVsnbWVzc2FnZSddKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yLmVycm9yKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Gb3JtRGF0YTxUPihmb3JtVmFsdWU6IFQpIHtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltVQ0kgQ29uc29sZV1cIiwgSlNPTi5zdHJpbmdpZnkoZm9ybVZhbHVlKSlcblxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhmb3JtVmFsdWUpKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGZvcm1WYWx1ZVtrZXldO1xuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1EYXRhO1xuICAgIH1cbn1cbiJdfQ==