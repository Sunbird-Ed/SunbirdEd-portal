
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { combineLatest,Subject,of,merge,throwError,forkJoin } from 'rxjs';
import { PageApiService,OrgDetailsService,FormService,UserService,CoursesService,FrameworkService,PlayerService,SearchService } from '@sunbird/core';
import { Component,OnInit,OnDestroy,EventEmitter,HostListener,AfterViewInit } from '@angular/core';
import { ResourceService,ToasterService,INoResultMessage,ConfigService,UtilService,ICaraouselData,BrowserCacheTtlService,ServerResponse,NavigationHelperService,LayoutService,COLUMN_TYPE } from '@sunbird/shared';
import { Router,ActivatedRoute } from '@angular/router';
import { _ } from 'lodash-es';
import { IImpressionEventInput,TelemetryService } from '@sunbird/telemetry';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { PublicPlayerService } from '@sunbird/public';
import { takeUntil,map,mergeMap,filter,catchError,tap,pluck,switchMap,delay } from 'rxjs/operators';
import { OfflineCardService } from '@sunbird/shared';
import { ContentManagerService } from '../../../public/module/offline/services/content-manager/content-manager.service';
import { CoursePageComponent } from './course-page.component';
import { Response } from './course-page.component.spec.data';
describe('CoursePageComponent', () => {
    let component: CoursePageComponent;

    const pageApiService :Partial<PageApiService> ={};
	const toasterService :Partial<ToasterService> ={};
	const resourceService :Partial<ResourceService> ={};
	const configService :Partial<ConfigService> ={};
	const activatedRoute :Partial<ActivatedRoute> ={
		snapshot: {
			data: {
			  telemetry: {
				env: 'explore', pageid: 'download-offline-app', type: 'view', uuid: '9545879'
			  }
			},
			queryParams: {
			  client_id: 'portal', redirectUri: '/learn',
			  state: 'state-id', response_type: 'code', version: '3'
			}
		  } as any,
	};
	const router :Partial<Router> ={};
	const utilService :Partial<UtilService> ={
		addHoverData:jest.fn()
	};
	const orgDetailsService :Partial<OrgDetailsService> ={};
	const publicPlayerService :Partial<PublicPlayerService> ={};
	const cacheService :Partial<CacheService> ={};
	const browserCacheTtlService :Partial<BrowserCacheTtlService> ={};
	const userService :Partial<UserService> ={};
	const formService :Partial<FormService> ={};
	const navigationhelperService :Partial<NavigationHelperService> ={
		getPageLoadTime:jest.fn().mockReturnValue(10)
	};
	const layoutService :Partial<LayoutService> ={};
	const coursesService :Partial<CoursesService> ={};
	const frameworkService :Partial<FrameworkService> ={};
	const playerService :Partial<PlayerService> ={};
	const searchService :Partial<SearchService> ={};
	const offlineCardService :Partial<OfflineCardService> ={};
	const contentManagerService :Partial<ContentManagerService> ={};
	const telemetryService :Partial<TelemetryService> ={};

    beforeAll(() => {
        component = new CoursePageComponent(
            pageApiService as PageApiService,
			toasterService as ToasterService,
			resourceService as ResourceService,
			configService as ConfigService,
			activatedRoute as ActivatedRoute,
			router as Router,
			utilService as UtilService,
			orgDetailsService as OrgDetailsService,
			publicPlayerService as PublicPlayerService,
			cacheService as CacheService,
			browserCacheTtlService as BrowserCacheTtlService,
			userService as UserService,
			formService as FormService,
			navigationhelperService as NavigationHelperService,
			layoutService as LayoutService,
			coursesService as CoursesService,
			frameworkService as FrameworkService,
			playerService as PlayerService,
			searchService as SearchService,
			offlineCardService as OfflineCardService,
			contentManagerService as ContentManagerService,
			telemetryService as TelemetryService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
	it('should call the method onScroll to be called', () => {
		jest.spyOn(component,'addHoverData');
		component.pageSections = Response.pageSections as any
		component.carouselMasterData = Response.pageSectionsNew as any
		component.onScroll();
        expect(component.addHoverData).toBeCalled();
    });





	describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            component.unsubscribe$ = {
                next: jest.fn(),
                complete: jest.fn()
            } as any;
            component.ngOnDestroy();
            expect(component.unsubscribe$.next).toHaveBeenCalled();
            expect(component.unsubscribe$.complete).toHaveBeenCalled();
        });
    });
});