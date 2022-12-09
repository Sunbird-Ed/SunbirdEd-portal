import { Router, ActivatedRoute } from "@angular/router";
import { ToasterService } from "../../../../shared";
import { UserService, CoursesService, GeneraliseLabelService } from "../../../../core"
import { ResourceService, NavigationHelperService, ConfigService } from "../../../../shared"
import { TelemetryService } from '@sunbird/telemetry';
import { CourseBatchService } from "../../../services";
import { EnrollBatchComponent } from "./enroll-batch.component"
import { of, throwError } from "rxjs";

describe('EnrollBatchComponent', () => {
    let enrollBatchComponent: EnrollBatchComponent;
    const mockRouter: Partial<Router> = {
        navigate: jest.fn(),
        url: 'sample-url' as any,
        events: of({}) as any

    };

    const mockActivatedRoute: Partial<ActivatedRoute> = {
        queryParams: of({ autoEnroll: 'demo' }),
        params: of({ batchId: "123" }),
    };

    const mockCourseBatchService: Partial<CourseBatchService> = {};
    const mockResourceService: Partial<ResourceService> = {
        messages: {
            smsg: {
                m0036: "Course Enrolled for this batch successfully..."
            },
            emsg: {
                m0001: 'Could not fetch data, try again later'
            },
            fmsg: {
                m0054: 'We are creating note...',
            }
        },

    };

    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn(),
        success: jest.fn()
    };

    const mockUserService: Partial<UserService> = {};
    const mockConfigService: Partial<ConfigService> = {};
    const mockCoursesService: Partial<CoursesService> = {
        getEnrolledCourses: jest.fn(() => of({}))
    };

    const mockTelemetryService: Partial<TelemetryService> = {
        log: jest.fn(),
        audit: jest.fn()
    };

    const mockNavigationHelperService: Partial<NavigationHelperService> = {};
    const mockGeneraliseLabelService: Partial<GeneraliseLabelService> = {
        messages: {
            fmsg: {
                m0082: "We are fetching limited published content...",
            }
        },
    };

    beforeAll(() => {
        enrollBatchComponent = new EnrollBatchComponent(
            mockRouter as Router,
            mockActivatedRoute as ActivatedRoute,
            mockCourseBatchService as CourseBatchService,
            mockResourceService as ResourceService,
            mockToasterService as ToasterService,
            mockUserService as UserService,
            mockConfigService as ConfigService,
            mockCoursesService as CoursesService,
            mockTelemetryService as TelemetryService,
            mockNavigationHelperService as NavigationHelperService,
            mockGeneraliseLabelService as GeneraliseLabelService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of batch component', () => {
        expect(enrollBatchComponent).toBeTruthy();
    });

    describe('ngOnInit', () => {
        // arrange
        it('should be return enroll batch details for web and Ios', () => {
            mockCourseBatchService.getEnrollToBatchDetails = jest.fn().mockReturnValue(of(true)) as any;
            jest.spyOn(enrollBatchComponent, 'setTelemetryData').mockImplementation();
            enrollBatchComponent.batchDetails = {
                enrollmentType: 'demo'
            }
            // act
            enrollBatchComponent.ngOnInit();
            // assert
            expect(mockToasterService.error).toBeCalledWith(mockGeneraliseLabelService.messages.fmsg.m0082);
        });

        it('error', () => {
            // arrange
            mockCourseBatchService.getEnrollToBatchDetails = jest.fn(() => throwError(of(false))) as any;
            // act
            enrollBatchComponent.ngOnInit();
            // assert
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.fmsg.m0054);
        });
    });

    it('should call ngOnDestroy', () => {
        //arrange
        enrollBatchComponent.enrollBatch = of().subscribe();
        // act
        enrollBatchComponent.enrollBatch = {
            deny: jest.fn()
        };
        jest.spyOn(enrollBatchComponent.enrollBatch, 'deny');
        enrollBatchComponent.ngOnDestroy();
        // assert
        expect(enrollBatchComponent.enrollBatch.deny).toBeCalled();
        expect(enrollBatchComponent.enrollBatch).toBeDefined();
    });

    it('should navigate to page', () => {
        // arrange
        enrollBatchComponent.tocId = "true"
        let queryParams = {
            textbook: "true"
        };
        // act 
        enrollBatchComponent.redirect();
        // assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(['./'], { queryParams: queryParams, relativeTo: undefined });
    });

    it('should not navigate to page', () => {
        // arrange
        enrollBatchComponent.tocId = ""
        let queryParams = {}
        // act
        enrollBatchComponent.redirect();
        //  assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(['./'], { queryParams: queryParams, relativeTo: undefined });
    });

    it('should return telemetry log events', () => {
        //act
        enrollBatchComponent.telemetryLogEvents(true);
        // assert
        expect(mockTelemetryService.log).toHaveBeenCalled();
    });

    it('should return false telemetry log events', () => {
        //act
        enrollBatchComponent.telemetryLogEvents(false);
        // assert
        expect(mockTelemetryService.log).toHaveBeenCalled();
    });

    describe('enrollToCourse', () => {
        it('should enrolled the course', () => {
            //arrange
            jest.spyOn(enrollBatchComponent, 'setTelemetryData').mockImplementation();
            jest.spyOn(enrollBatchComponent, 'logAuditEvent').mockImplementation();
            enrollBatchComponent.batchDetails = {
                courseId: 'demo'
            }
            mockCourseBatchService.enrollToCourse = jest.fn().mockReturnValue(of(true)) as any;
            enrollBatchComponent.fetchEnrolledCourseData = jest.fn();
            enrollBatchComponent.telemetryLogEvents = jest.fn();
            jest.spyOn(enrollBatchComponent.enrollBatch, 'deny');
            enrollBatchComponent.disableSubmitBtn = true;
            //act
            enrollBatchComponent.enrollToCourse();
            //assert 
            expect(mockToasterService.success).toHaveBeenCalledWith(mockResourceService.messages.smsg.m0036);
            expect(enrollBatchComponent.fetchEnrolledCourseData).toHaveBeenCalled();
        });

        it('error', () => {
            // arrange
            mockCourseBatchService.enrollToCourse = jest.fn(() => throwError(of(false))) as any;
            enrollBatchComponent.telemetryLogEvents = jest.fn();
            // act 
            enrollBatchComponent.enrollToCourse();
            // assert
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0001);
        });
    });

    it('should return log of audit event', () => {
        enrollBatchComponent.logAuditEvent();
        expect(enrollBatchComponent.logAuditEvent).toHaveBeenCalled();
    });
});

