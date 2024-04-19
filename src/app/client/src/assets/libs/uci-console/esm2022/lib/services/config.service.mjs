import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "./uci.service";
export class ConfigService {
    constructor(activatedRoute, UciService) {
        this.activatedRoute = activatedRoute;
        this.UciService = UciService;
    }
    ngOnInit() {
    }
    setConfig(activatedRoute) {
        activatedRoute.data.subscribe((config) => {
            this._config = config.data;
        });
    }
    setConfigFromParams(activatedRoute) {
        activatedRoute.queryParams.subscribe((params) => {
            const obj = {
                userName: _.get(params, 'userName'),
                categories: JSON.parse(_.get(params, 'categories'))
            };
            this._config = obj;
        });
    }
    getConfig() {
        return this._config;
    }
    getCategories() {
        this.getParams = this.getConfig();
        return _.get(this.getParams, 'categories');
    }
    hasContext() {
        this.hasContextData = this.getCategories() ?
            (this.getCategories().result ? this.getCategories().result.length : null)
            : null;
        return this.hasContextData;
    }
    getContext() {
        this.getContextData = this.getCategories() ?
            (this.getCategories().result ? this.getCategories().result : null)
            : null;
        return this.getContextData;
    }
    getRouterSlug() {
        return this._config.routerSlug ? this._config.routerSlug : '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ConfigService, deps: [{ token: i1.ActivatedRoute }, { token: i2.UciService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ConfigService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ConfigService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.ActivatedRoute }, { type: i2.UciService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91Y2ktY29uc29sZS9zcmMvbGliL3NlcnZpY2VzL2NvbmZpZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxVQUFVLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFHbkQsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUE7Ozs7QUFNM0IsTUFBTSxPQUFPLGFBQWE7SUFXeEIsWUFDUyxjQUE4QixFQUM3QixVQUFzQjtRQUR2QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDN0IsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUM1QixDQUFDO0lBRUwsUUFBUTtJQUVSLENBQUM7SUFFRCxTQUFTLENBQUMsY0FBYztRQUN0QixjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxjQUFjO1FBQ2hDLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDOUMsTUFBTSxHQUFHLEdBQXNCO2dCQUM3QixRQUFRLEVBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDO2dCQUNwQyxVQUFVLEVBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQzthQUNyRCxDQUFDO1lBQ0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sU0FBUztRQUNkLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRU0sYUFBYTtRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtRQUNqQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0lBRU0sVUFBVTtRQUNmLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDMUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3pFLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDUixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUE7SUFDNUIsQ0FBQztJQUVNLFVBQVU7UUFDZixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2xFLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDUixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUE7SUFDNUIsQ0FBQztJQUVNLGFBQWE7UUFDbEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNoRSxDQUFDOytHQTdEVSxhQUFhO21IQUFiLGFBQWEsY0FGWixNQUFNOzs0RkFFUCxhQUFhO2tCQUh6QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVjaVNlcnZpY2UgfSBmcm9tICcuL3VjaS5zZXJ2aWNlJztcbmltcG9ydCB7IEluamVjdGFibGUsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCB7IElkaXNjdXNzaW9uQ29uZmlnIH0gZnJvbSAnLi4vbW9kZWxzL3VjaS1jb25maWcubW9kZWwnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBDb25maWdTZXJ2aWNlIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwYXJhbXNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBfY29uZmlnOiBJZGlzY3Vzc2lvbkNvbmZpZztcbiAgcHVibGljIGNoZWNrQ29udGV4dDogYm9vbGVhbjtcbiAgcHVibGljIHF1ZXJ5UGFyYW1zO1xuICBnZXRDb250ZXh0RGF0YTogYW55O1xuICBoYXNDb250ZXh0RGF0YTogYW55O1xuICBnZXRQYXJhbXM6IElkaXNjdXNzaW9uQ29uZmlnO1xuXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBwcml2YXRlIFVjaVNlcnZpY2U6IFVjaVNlcnZpY2UsXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgfVxuXG4gIHNldENvbmZpZyhhY3RpdmF0ZWRSb3V0ZSkge1xuICAgIGFjdGl2YXRlZFJvdXRlLmRhdGEuc3Vic2NyaWJlKChjb25maWcpID0+IHtcbiAgICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZy5kYXRhO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0Q29uZmlnRnJvbVBhcmFtcyhhY3RpdmF0ZWRSb3V0ZSkge1xuICAgIGFjdGl2YXRlZFJvdXRlLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZSgocGFyYW1zKSA9PiB7XG4gICAgICBjb25zdCBvYmo6IElkaXNjdXNzaW9uQ29uZmlnID0ge1xuICAgICAgICB1c2VyTmFtZSA6IF8uZ2V0KHBhcmFtcywgJ3VzZXJOYW1lJyksXG4gICAgICAgIGNhdGVnb3JpZXMgOiBKU09OLnBhcnNlKF8uZ2V0KHBhcmFtcywgJ2NhdGVnb3JpZXMnKSlcbiAgICAgIH07XG4gICAgICB0aGlzLl9jb25maWcgPSBvYmo7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29uZmlnKCkge1xuICAgIHJldHVybiB0aGlzLl9jb25maWc7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q2F0ZWdvcmllcygpIHtcbiAgICB0aGlzLmdldFBhcmFtcyA9IHRoaXMuZ2V0Q29uZmlnKClcbiAgICByZXR1cm4gXy5nZXQodGhpcy5nZXRQYXJhbXMsICdjYXRlZ29yaWVzJylcbiAgfVxuXG4gIHB1YmxpYyBoYXNDb250ZXh0KCkge1xuICAgIHRoaXMuaGFzQ29udGV4dERhdGEgPSB0aGlzLmdldENhdGVnb3JpZXMoKSA/XG4gICAgICAodGhpcy5nZXRDYXRlZ29yaWVzKCkucmVzdWx0ID8gdGhpcy5nZXRDYXRlZ29yaWVzKCkucmVzdWx0Lmxlbmd0aCA6IG51bGwpXG4gICAgICA6IG51bGxcbiAgICByZXR1cm4gdGhpcy5oYXNDb250ZXh0RGF0YVxuICB9XG5cbiAgcHVibGljIGdldENvbnRleHQoKSB7XG4gICAgdGhpcy5nZXRDb250ZXh0RGF0YSA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpID9cbiAgICAgICh0aGlzLmdldENhdGVnb3JpZXMoKS5yZXN1bHQgPyB0aGlzLmdldENhdGVnb3JpZXMoKS5yZXN1bHQgOiBudWxsKVxuICAgICAgOiBudWxsXG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29udGV4dERhdGFcbiAgfVxuXG4gIHB1YmxpYyBnZXRSb3V0ZXJTbHVnKCkge1xuICAgIHJldHVybiB0aGlzLl9jb25maWcucm91dGVyU2x1ZyA/IHRoaXMuX2NvbmZpZy5yb3V0ZXJTbHVnIDogJyc7XG4gIH1cbn1cbiJdfQ==