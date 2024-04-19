import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class GlobalService {
    constructor() {
        this.user = new BehaviorSubject(undefined);
        this.user$ = this.user.asObservable();
        this.baseUrl = new BehaviorSubject(undefined);
        this.baseUrl$ = this.baseUrl.asObservable();
    }
    setUser(user) {
        this.user.next(user);
    }
    getUser() {
        return this.user.value;
    }
    setBaseUrl(baseUrl) {
        this.baseUrl.next(baseUrl);
    }
    getBaseUrl() {
        return this.baseUrl.value;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: GlobalService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: GlobalService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: GlobalService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91Y2ktY29uc29sZS9zcmMvbGliL3NlcnZpY2VzL2dsb2JhbC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFLckMsTUFBTSxPQUFPLGFBQWE7SUFNdEI7UUFMUSxTQUFJLEdBQXlCLElBQUksZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELFVBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLFlBQU8sR0FBeUIsSUFBSSxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkQsYUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFHdkQsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFJO1FBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELE9BQU87UUFDSCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBTztRQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUM5QixDQUFDOytHQXZCUSxhQUFhO21IQUFiLGFBQWEsY0FGVixNQUFNOzs0RkFFVCxhQUFhO2tCQUh6QixVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgR2xvYmFsU2VydmljZSB7XG4gICAgcHJpdmF0ZSB1c2VyOiBCZWhhdmlvclN1YmplY3Q8YW55PiA9IG5ldyBCZWhhdmlvclN1YmplY3QodW5kZWZpbmVkKTtcbiAgICBwdWJsaWMgcmVhZG9ubHkgdXNlciQgPSB0aGlzLnVzZXIuYXNPYnNlcnZhYmxlKCk7XG4gICAgcHJpdmF0ZSBiYXNlVXJsOiBCZWhhdmlvclN1YmplY3Q8YW55PiA9IG5ldyBCZWhhdmlvclN1YmplY3QodW5kZWZpbmVkKTtcbiAgICBwdWJsaWMgcmVhZG9ubHkgYmFzZVVybCQgPSB0aGlzLmJhc2VVcmwuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBzZXRVc2VyKHVzZXIpIHtcbiAgICAgICAgdGhpcy51c2VyLm5leHQodXNlcik7XG4gICAgfVxuXG4gICAgZ2V0VXNlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlci52YWx1ZTtcbiAgICB9XG5cbiAgICBzZXRCYXNlVXJsKGJhc2VVcmwpIHtcbiAgICAgICAgdGhpcy5iYXNlVXJsLm5leHQoYmFzZVVybCk7XG4gICAgfVxuXG4gICAgZ2V0QmFzZVVybCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzZVVybC52YWx1ZTtcbiAgICB9XG59XG4iXX0=