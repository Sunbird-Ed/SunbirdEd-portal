import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { UserService, TncService } from "../../../core";
import { ResourceService, NavigationHelperService, LayoutService, ToasterService } from "../../../shared";
import { UsageService, CourseProgressService } from "../../services";
import { UsageReportsComponent } from "./usage-reports.component";

describe('UsageReportsComponent', () => {
    let usageReportsComponent: UsageReportsComponent;
    const mockUsageService: Partial<UsageService> = {
        getData: jest.fn().mockReturnValue(of({responseCode: 'OK'}) )as any,
    };

    const mockDomSanitizer: Partial<DomSanitizer> = {};
    const mockUserService: Partial<UserService> = {
        slug: jest.fn().mockReturnValue("tn") as any,
        userData$: of({userProfile: {
            userId: '',
        } as any}) as any,  
    };
    const mockToasterService: Partial<ToasterService> = {};
    const mockResourceService: Partial<ResourceService> = {};
    const mockActivatedRoute: Partial<ActivatedRoute> = {};
    const mockRouter: Partial<Router> = {};
    const mockNavigationHelperService: Partial<NavigationHelperService> = {
        goBack: jest.fn()
    };
    const mockLayoutService: Partial<LayoutService> = {
        initlayoutConfig: jest.fn(),
        switchableLayout: jest.fn(() => of([{data: 'demo'}]))
    };
    const mockCourseProgressService: Partial<CourseProgressService> = {
        getReportsMetaData:jest.fn().mockReturnValue(of({responseCode :'OK',result:{path:{fileSize: 1024,lastModified:'demo'}}})),
    };
    const mockTncService: Partial<TncService> = {
        getReportViewerTnc :jest.fn().mockReturnValue(of({result: {response: {value:{latestVersion:1111}}}}) )as any,
    };

    beforeAll(() => {
        usageReportsComponent = new UsageReportsComponent(
            mockUsageService as UsageService,
            mockDomSanitizer as DomSanitizer,
            mockUserService as UserService,
            mockToasterService as ToasterService,
            mockResourceService as ResourceService,
            mockActivatedRoute as ActivatedRoute,
            mockRouter as Router,
            mockNavigationHelperService as NavigationHelperService,
            mockLayoutService as LayoutService,
            mockCourseProgressService as CourseProgressService,
            mockTncService as TncService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of usage report component', () => {
        expect(usageReportsComponent).toBeTruthy();
    });

    describe('ngOnInit', ()=> {
        it('should be return usage reports for web and Ios', ()=> {
            // arrange
            jest.spyOn(document, 'getElementById').mockImplementation(() => {
                return {value: ['val-01', '12', '-', '.'], checked: false} as any;
            });
            mockUsageService.getData = jest.fn().mockReturnValue(of({responseCode :'OK',result:[{charts: 'demo',table:'demo',files: 'demo'}]}))as any;
            //act
            usageReportsComponent.ngOnInit();
            // assert
            expect(mockUserService.userData$).toBeTruthy();
            expect(usageReportsComponent.noResult).toBeFalsy();

        });
        it('should call when reports location value is empty', ()=> {
            // arrange
            jest.spyOn(document, 'getElementById').mockImplementation(() => {
                return undefined as any;
            });
            mockUsageService.getData = jest.fn().mockReturnValue(of({responseCode :'OK',result:[{charts: 'demo',table:'demo',files: 'demo'}]}))as any;
            // act
            usageReportsComponent.ngOnInit();
            // assert
            expect(mockUserService.userData$).toBeTruthy();
            expect(usageReportsComponent.noResult).toBeFalsy();
        });

        it('should call when response is empty', ()=> {
            // arrange
            jest.spyOn(document, 'getElementById').mockImplementation(() => {
                return {value: ['val-01', '12', '-', '.'], checked: false} as any;
            });
            mockUsageService.getData = jest.fn().mockReturnValue(of({responseCode :'OK',result:[{charts: 'demo',table:'',files: ''}]}))as any;
            // act
            usageReportsComponent.ngOnInit();
            // assert
            expect(mockUserService.userData$).toBeTruthy();
            expect(usageReportsComponent.noResult).toBeFalsy();
        });

        it('should show alert message from params when result is failed', ()=> {
            // arrange
            mockUsageService.getData = jest.fn(() => throwError(of(false))) as any;
            usageReportsComponent.noResultMessage = {
                'messageText': 'demo'
            };
            //act
            usageReportsComponent.ngOnInit();
            // assert
            expect(usageReportsComponent.noResult).toBeTruthy(); 

        });
    });

    it('should show error message from params when result is failed', () => {
        // arrange
        mockUsageService.getData = jest.fn(() => throwError(of(false))) as any;
        // act
        usageReportsComponent.renderReport([{charts:'',file: ''}]);
        // assert
        expect(mockUsageService.getData).toHaveBeenCalled();
    });

    it('should set the download url', ()=> {
        // act
        usageReportsComponent.setDownloadUrl('demo');
        //assert
        expect(usageReportsComponent.setDownloadUrl).toBeDefined();
    });

    it('should transform the html data', ()=> {
        //arrange
        mockDomSanitizer.bypassSecurityTrustHtml = jest.fn().mockReturnValue('demo');
        // act
        const res = usageReportsComponent.transformHTML('demo');
        // assert
        expect(res).toBeDefined();
    });

    describe('downloadCSV', () => {
        it('should download the csv file', ()=> {
            // arrange
            let filePath = '';
            jest.spyOn(usageReportsComponent,'downloadCSV');
            window.open = jest.fn();
            mockUsageService.getData = jest.fn().mockReturnValue(of({responseCode: 'OK',result:{signedUrl:'demo'}}) )as any;
            //act
            usageReportsComponent.downloadCSV(filePath);
            // assert
            expect(usageReportsComponent.downloadCSV).toBeCalled();
        });
        it('should call when no data available for download', ()=> {
            // arrange
            let filePath = '';
            jest.spyOn(usageReportsComponent,'downloadCSV');
            mockUsageService.getData = jest.fn().mockReturnValue(of({}) )as any;
            // act
            usageReportsComponent.downloadCSV(filePath);
            // assert
            expect(usageReportsComponent.downloadCSV).toBeCalled();
        });
        it('should show alert message from params when result is failed', ()=> {
            // arrange
            let filePath = '';
            jest.spyOn(usageReportsComponent,'downloadCSV');
            mockUsageService.getData = jest.fn(() => throwError(of(false))) as any;
            // act
            usageReportsComponent.downloadCSV(filePath);
            // assert
            expect(usageReportsComponent.downloadCSV).toBeCalled();
        });

    });

    it('should show a popup for first time user', ()=> {
        // arrange
        usageReportsComponent.userProfile = {
            allTncAccepted : {
                    reportViewerTnc: ''
            }  
        };
        // act
        usageReportsComponent.showReportViewerTncForFirstUser();
        // assert
        expect(usageReportsComponent.showTncPopup).toBeTruthy();
    });

    it('should call content layout based on config data', ()=> {
        // arrange
        jest.spyOn(usageReportsComponent,'initLayout');
        // act
        usageReportsComponent.initLayout();
        //assert
        expect(usageReportsComponent.initLayout).toBeCalled();
    });

    describe('goBack', ()=> {
        it('return back to the navigation helper page',()=> {
            // arrange
            mockNavigationHelperService.goBack = jest.fn();
            //act
            usageReportsComponent.goBack();
            // assert
            expect(mockNavigationHelperService.goBack).toHaveBeenCalled();

        });

    });

});
