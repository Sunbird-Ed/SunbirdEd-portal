import { CoursePageComponent } from '././course-page.component';
import { BehaviorSubject, throwError, of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ToasterService, SharedModule, UtilService, LayoutService } from '@sunbird/shared';
import { PageApiService, OrgDetailsService, CoreModule, FormService, UserService, CoursesService, SearchService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PublicPlayerService } from '@sunbird/public';
import { SuiModule } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './course-page.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { configureTestSuite } from '@sunbird/test-util';

describe('CoursePageComponent', () => {
    let component: CoursePageComponent;
    let fixture: ComponentFixture<CoursePageComponent>;
    let toasterService, formService, pageApiService, orgDetailsService, cacheService, utilService, coursesService, searchService;
    const mockPageSection: Array<any> = Response.successData.result.response.sections;
    let sendOrgDetails = true;
    let sendPageApi = true;
    let sendFormApi = true;
    let sendMenuConfig = true;
    let activatedRouteStub;
    class RouterStub {
        navigate = jasmine.createSpy('navigate');
        url = jasmine.createSpy('url');
    }
    const resourceBundle = {
        'messages': {
            'fmsg': {
                m0002: 'Could not fetch other courses, try again later...'
            },
            'emsg': {},
            'stmsg': {}
        },
        'frmelmnts': {
            'lbl': {
                mytrainings: 'My Trainings',
                boards: 'boards',
                selectBoard: 'selectBoard',
                medium: 'medium',
                selectMedium: 'selectMedium',
                class: 'class',
                selectClass: 'selectClass',
                subject: 'subject',
                selectSubject: 'selectSubject',
                publisher: 'publisher',
                selectPublisher: 'selectPublisher',
                contentType: 'contentType',
                selectContentType: 'selectContentType',
                orgname: 'orgname'
            }
        },
        'languageSelected$': of({})
    };
    class FakeActivatedRoute {
        queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
        params = of({});
        get queryParams() { return this.queryParamsMock.asObservable(); }
        snapshot = {
            queryParams: {
                selectedTab: 'course'
            },
            params: { slug: 'ap' },
            data: {
                telemetry: { env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate' }
            }
        };
        public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
    }
    configureTestSuite();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
            declarations: [CoursePageComponent],
            providers: [PublicPlayerService, { provide: ResourceService, useValue: resourceBundle },
                { provide: Router, useClass: RouterStub },
                { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CoursePageComponent);
        component = fixture.componentInstance;
        toasterService = TestBed.get(ToasterService);
        formService = TestBed.get(FormService);
        pageApiService = TestBed.get(PageApiService);
        orgDetailsService = TestBed.get(OrgDetailsService);
        utilService = TestBed.get(UtilService);
        cacheService = TestBed.get(CacheService);
        coursesService = TestBed.get(CoursesService);
        searchService = TestBed.get(SearchService);
        activatedRouteStub = TestBed.get(ActivatedRoute);
        sendOrgDetails = true;
        sendPageApi = true;
        sendFormApi = true;
        sendMenuConfig = true;
        activatedRouteStub.snapshot.queryParams = {};
        const responseToForm = [
            { 'index': 0, 'contentType': 'course', 'title': 'ACTIVITY_COURSE_TITLE', 'desc': 'ACTIVITY_COURSE_DESC', 'activityType': 'Content', 'isEnabled': true, 'filters': { 'contentType': ['course'] } },
            { 'index': 1, 'contentType': 'textbook', 'title': 'ACTIVITY_TEXTBOOK_TITLE', 'desc': 'ACTIVITY_TEXTBOOK_DESC', 'activityType': 'Content', 'isEnabled': false, 'filters': { 'contentType': ['TextBook'] } }
        ];
        spyOn(orgDetailsService, 'getOrgDetails').and.callFake((options) => {
            if (sendOrgDetails) {
                return of({ hashTagId: '123' });
            }
            return throwError({});
        });
        spyOn(pageApiService, 'getPageData').and.callFake((options) => {
            if (sendPageApi) {
                return of({ sections: mockPageSection });
            }
            return throwError({});
        });
        spyOn(formService, 'getFormConfig').and.callFake((options) => {
            if (sendFormApi) {
                return of([{ framework: 'TPD' }]);
            } else {
                return of(responseToForm);
            }
            // return throwError({});
        });
        spyOn(cacheService, 'get').and.callFake((options) => {
            return undefined;
        });
    });
    it('should emit filter data when getFilters is called with data', () => {
        component.facets = Response.facets;
        spyOn(component.dataDrivenFilterEvent, 'emit');
        component.getFilters([{ code: 'board', range: [{ index: 0, name: 'NCRT' }, { index: 1, name: 'CBSC' }] }]);
        expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({ board: 'NCRT' });
    });
    it('should set selected tab filters', () => {
        spyOn(component.dataDrivenFilterEvent, 'emit');
        component.facets = Response.facets;
        component.getFilters({
            'status': 'FETCHED', 'filters': {
                'selectedTab': 'course', 'channel': [
                    'Chhattisgarh']
            }
        });
        expect(component.selectedFilters).toEqual({
            'selectedTab': 'course',
            'channel': [
                'Chhattisgarh'
            ]
        });
        expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalled();
    });
    it('should emit filter data when getFilters is called with no data', () => {
        spyOn(component.dataDrivenFilterEvent, 'emit');
        component.getFilters({ filters: [] });
        expect(component.dataDrivenFilterEvent.emit).toHaveBeenCalledWith({});
    });
    it('should fetch hashTagId from API and filter details from data driven filter component', done => {
        component['getOrgDetails']().subscribe(res => {
            expect(orgDetailsService.getOrgDetails).toHaveBeenCalled();
            expect(component.hashTagId).toBe('123');
            done();
        });

    });
    it('should navigate to landing page if fetching org details fails and data driven filter do not returned data', done => {
        spyOn(component, 'isUserLoggedIn').and.returnValue(false);
        spyOn<any>(component, 'getOrgDetails').and.returnValue(of({}));
        spyOn<any>(component, 'getFrameWork').and.returnValue(of({}));
        spyOn<any>(component, 'getFormData').and.returnValue(throwError({}));
        spyOn<any>(component, 'getQueryParams').and.returnValue(of({}));
        spyOn<any>(component, 'initLayout').and.returnValue(of({}));
        spyOn<any>(component, 'fetchEnrolledCoursesSection').and.returnValue(of({}));
        spyOn<any>(component, 'getLanguageChange').and.returnValue(of({}));
        component['mergeObservables']()
            .subscribe(res => {
                expect(component.carouselMasterData).toEqual([]);
                expect(component.pageSections).toEqual([]);
                done();
            });
    });
    xit('should fetch content after getting hashTagId and filter data and set carouselData if api returns data', () => {
        spyOn(orgDetailsService, 'searchOrgDetails').and.callFake((options) => {
            return of(Response.orgSearch);
        });
        component.ngOnInit();
        // component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
        expect(component.hashTagId).toEqual('123');
        expect(component.frameWorkName).toEqual('TPD');
        // expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
        expect(component.showLoader).toBeFalsy();
        expect(component.carouselMasterData.length).toEqual(1);
    });
    xit('should not navigate to landing page if fetching frameWork from form service fails and data driven filter returns data', () => {
        sendFormApi = false;
        spyOn(orgDetailsService, 'searchOrgDetails').and.callFake((options) => {
            return of(Response.orgSearch);
        });
        component.ngOnInit();
        // component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
        expect(component.hashTagId).toEqual('123');
        expect(component.frameWorkName).toEqual(undefined);
        // expect(component.dataDrivenFilters).toEqual({});
        expect(component.showLoader).toBeFalsy();
        expect(component.carouselMasterData.length).toEqual(1);
    });
    xit('should fetch content after getting hashTagId and filter data and throw error if page api fails', () => {
        sendPageApi = false;
        spyOn(toasterService, 'error').and.callFake(() => { });
        component.ngOnInit();
        // component.getFilters([{ code: 'board', range: [{index: 0, name: 'NCRT'}, {index: 1, name: 'CBSC'}]}]);
        expect(component.hashTagId).toEqual('123');
        expect(component.frameWorkName).toEqual('TPD');
        // expect(component.dataDrivenFilters).toEqual({ board: 'NCRT'});
        expect(component.showLoader).toBeFalsy();
        expect(component.carouselMasterData.length).toEqual(0);
        expect(toasterService.error).toHaveBeenCalled();
    });
    it('should unsubscribe from all observable subscriptions', () => {
        component.ngOnInit();
        spyOn(component.unsubscribe$, 'complete');
        component.ngOnDestroy();
        expect(component.unsubscribe$.complete).toHaveBeenCalled();
    });
    it('should redo layout on render', done => {
        component.layoutConfiguration = null;
        spyOn<any>(component, 'redoLayout').and.callThrough();
        const layoutService = TestBed.get(LayoutService);
        spyOn(layoutService, 'switchableLayout').and.returnValue(of({ layout: {} }));
        component['initLayout']().subscribe(res => {
            expect(component.layoutConfiguration).toEqual({});
            expect(component['redoLayout']).toHaveBeenCalled();
            done();
        });

    });
    it('should getFormData', done => {
        component['getFormData']().subscribe(res => {
            expect(formService.getFormConfig).toHaveBeenCalled();
            expect(formService.getFormConfig).toHaveBeenCalledWith({ formType: 'contentcategory', formAction: 'menubar', contentType: 'global' });
            expect(component.formData).toBeDefined();
            done();
        });
    });

    it('should redirect to viewall page with queryparams', () => {
        const router = TestBed.get(Router);
        const searchQuery = '{"request":{"query":"","filters":{"status":"1"},"limit":10,"sort_by":{"createdDate":"desc"}}}';
        spyOn(component, 'viewAll').and.callThrough();
        spyOn(cacheService, 'set').and.stub();
        router.url = '/explore-course?selectedTab=course';
        component.viewAll({ searchQuery: searchQuery, name: 'Featured-courses' });
        expect(router.navigate).toHaveBeenCalledWith(['/explore-course/view-all/Featured-courses', 1],
            { queryParams: { 'status': '1', 'defaultSortBy': '{"createdDate":"desc"}', 'exists': undefined } });
        expect(cacheService.set).toHaveBeenCalled();
    });

    it('should call play content method', () => {
        const publicPlayerService = TestBed.get(PublicPlayerService);
        spyOn(publicPlayerService, 'playContent').and.callThrough();
        const event = {
            data: {
                metaData: {
                    identifier: 'do_21307528604532736012398'
                }
            }
        };
        component.playContent(event);
        expect(publicPlayerService.playContent).toHaveBeenCalled();
    });

    it('should generate visit telemetry impression event', () => {
        const event = {
            data: {
                metaData: {
                    identifier: 'do_21307528604532736012398',
                    contentType: 'Course'
                },
                section: 'Featured courses'
            }
        };
        component.prepareVisits(event);
        expect(component.telemetryImpression).toBeDefined();
    });


    xit('should add audience type in fetch page data request body', () => {
        spyOn(localStorage, 'getItem').and.returnValue('teacher');
        component.queryParams = { sort_by: 'name', sortType: 'desc' };
        // component['fetchPageData']();
        const option = {
            source: 'web', name: 'Course', organisationId: '*',
            filters: { sort_by: 'name', sortType: 'desc', audience: ['Teacher'] },
            fields: ['name', 'appIcon', 'medium', 'subject', 'resourceType', 'contentType', 'organisation', 'topic', 'mimeType', 'trackable'],
            params: { orgdetails: 'orgName,email' },
            facets: ['channel', 'gradeLevel', 'subject', 'medium']
        };
        expect(pageApiService.getPageData).toHaveBeenCalledWith(option);
    });

    it('should change the title for My-training on language change', done => {
        component.enrolledSection = {
            name: 'sample'
        };
        component['getLanguageChange']().subscribe(res => {
            expect(component.enrolledSection.name).toBeDefined();
            expect();
            done();
        });
    });
    it('should get processed facets data', () => {
        const facetsData = component.updateFacetsData(Response.facetsList);
        expect(facetsData).toEqual(Response.updatedFacetsList);
    });
    it('should redirect to view-all page for logged in user', () => {
        spyOn(component, 'isUserLoggedIn').and.returnValue(true);
        const userService = TestBed.get(UserService);
        const router = TestBed.get(Router);
        router.url = '/learn';
        const eventData = Response.viewAllEventData;
        userService._userProfile = Response.userData;
        const searchQueryParams = {
            'contentType': [
                'Course'
            ],
            'objectType': [
                'Content'
            ],
            'status': [
                'Live'
            ],
            'defaultSortBy': '{\"lastPublishedOn\":\"desc\"}',
            'exists': undefined
        };
        component.queryParams = {};
        const queryParams = { ...component.queryParams, ...searchQueryParams };
        spyOn(cacheService, 'set').and.stub();
        component.viewAll(eventData);
        expect(router.navigate).toHaveBeenCalledWith(['/learn/view-all/My-courses', 1], { queryParams: queryParams });
        expect(cacheService.set).toHaveBeenCalledWith('viewAllQuery', searchQueryParams, { maxAge: 600 });
    });

    it('should fetch enrolled courses for logged in users', done => {
        spyOn(utilService, 'processContent').and.callThrough();
        component['fetchEnrolledCoursesSection']().subscribe(res => {
            expect(utilService.processContent).toHaveBeenCalled();
            expect(component.enrolledSection).toBeDefined();
            done();
        });
        coursesService['_enrolledCourseData$'].next({ enrolledCourses: Response.enrolledCourses, err: null });
    });

    it('should prepare Carousel Data for non loggedIn user', () => {
        spyOn(component, 'isUserLoggedIn').and.returnValue(false);
        const input = [{ 'contents': [{}] }];
        const processContentSpy = spyOn(utilService, 'processContent');
        const getDataForCardSpy = spyOn(utilService, 'getDataForCard');
        component['prepareCarouselData'](input);
        expect(processContentSpy).not.toHaveBeenCalled();
        expect(getDataForCardSpy).toHaveBeenCalled();
    });

    it('should prepare Carousel Data for loggedIn user', () => {
        const input = [{ 'contents': [{}] }];
        spyOn(component, 'isUserLoggedIn').and.returnValue(true);
        const processContentSpy = spyOn(utilService, 'processContent');
        const getDataForCardSpy = spyOn(utilService, 'getDataForCard');
        component['prepareCarouselData'](input);
        expect(processContentSpy).toHaveBeenCalled();
        expect(getDataForCardSpy).not.toHaveBeenCalled();
    });

    it('should process org data', () => {
        const input = [{ name: 'test' }];
        const result = component['processOrgData'](input);
        expect(result.length).toBe(1);
        expect(result).toEqual([input[0].name]);
    });

    it('should prepare option for loggedIn user', done => {
        component.formData = [
            { 'index': 0, 'contentType': 'course', 'title': 'ACTIVITY_COURSE_TITLE', 'desc': 'ACTIVITY_COURSE_DESC', 'activityType': 'Content', 'isEnabled': true, 'filters': { 'contentType': ['course'] } },
        ];
        const getCustodianOrgDetailsSpy = spyOn(orgDetailsService, 'getCustodianOrgDetails').and.returnValue(of({}));
        const getCourseSectionDetailsSpy = spyOn(coursesService, 'getCourseSectionDetails').and.returnValue(of({}));
        spyOn(component, 'isUserLoggedIn').and.returnValue(false);
        component['buildOption']().subscribe(res => {
            expect(res).toBeDefined();
            expect(getCustodianOrgDetailsSpy).not.toHaveBeenCalled();
            expect(getCourseSectionDetailsSpy).not.toHaveBeenCalled();
            expect(res).toEqual(Response.buildOptionRespForNonLoggedInUser);
            done();
        });
    });

    it('should prepare option for non loggedIn user', done => {
        component.formData = [
            { 'index': 0, 'contentType': 'course', 'title': 'ACTIVITY_COURSE_TITLE', 'desc': 'ACTIVITY_COURSE_DESC', 'activityType': 'Content', 'isEnabled': true, 'filters': { 'contentType': ['course'] } },
        ];
        spyOn(component, 'isUserLoggedIn').and.returnValue(true);
        const getCustodianOrgDetailsSpy = spyOn(orgDetailsService, 'getCustodianOrgDetails').and.returnValue(of({}));
        const getCourseSectionDetailsSpy = spyOn(coursesService, 'getCourseSectionDetails').and.returnValue(of({}));
        component['buildOption']().subscribe(res => {
            expect(getCustodianOrgDetailsSpy).toHaveBeenCalled();
            expect(getCourseSectionDetailsSpy).toHaveBeenCalled();
            done();
        });
    });

    it('should fetch page Data', done => {
        spyOn(component, 'isUserLoggedIn').and.returnValue(false);
        spyOn<any>(component, 'searchOrgDetails').and.callThrough();
        spyOn<any>(orgDetailsService, 'searchOrgDetails').and.returnValue(of(Response.orgSearch));
        spyOn(component, 'isPageAssemble').and.returnValue(true);
        component['fetchPageData'](Response.buildOptionRespForNonLoggedInUser)
            .subscribe(res => {
                expect(pageApiService.getPageData).toHaveBeenCalled();
                expect(orgDetailsService.searchOrgDetails).toHaveBeenCalled();
                expect(component.facets).toBeDefined();
                expect(component.initFilters).toBeTruthy();
                expect(component.carouselMasterData).toBeDefined();
                done();
            });
    });

    it('should fetch page Data based on search API', done => {
        spyOn(component, 'isUserLoggedIn').and.returnValue(false);
        spyOn<any>(component, 'searchOrgDetails').and.callThrough();
        spyOn<any>(component, 'processOrgData').and.callFake(function() {return {}})
        spyOn<any>(orgDetailsService, 'searchOrgDetails').and.returnValue(of(Response.orgSearch));
        spyOn<any>(searchService, 'contentSearch').and.returnValue(of(Response.contentSearchResponse));
        spyOn<any>(utilService, 'processCourseFacetData').and.returnValue(of(Response.courseSectionsFacet));
        spyOn(component, 'isPageAssemble').and.returnValue(false);
        component['fetchCourses'](Response.buildOptionRespForFetchCourse)
            .subscribe(res => {
                expect(searchService.contentSearch).toHaveBeenCalled();
                expect(orgDetailsService.searchOrgDetails).toHaveBeenCalled();
                expect(utilService.processCourseFacetData).toHaveBeenCalledWith(Response.courseSectionsResponse, ['channel', 'gradeLevel', 'subject', 'medium']);
                expect(component.facets).toBeDefined();
                expect(component.initFilters).toBeTruthy();
                expect(component.carouselMasterData).toBeDefined();
                done();
            });
    });
});
