import { ActivatedRoute, Router } from "@angular/router";
import { CoursesService, GeneraliseLabelService, UserService } from "../../../../core"
import { ConfigService, NavigationHelperService, ResourceService, ToasterService } from "../../../../shared"
import { TelemetryService } from "@sunbird/telemetry";
import { CourseBatchService } from "../../../services";
import { UnEnrollBatchComponent } from "./unenroll-batch.component";
import { of, throwError } from "rxjs";

describe('UnEnrollBatchComponent', () => {
    let unEnrollBatchComponent: UnEnrollBatchComponent;
    const mockRouter: Partial<Router> = {
        navigate: jest.fn(),
        events: of({}) as any
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        params: of({ batchId: "123" }),
        queryParams: of({ textbook: 'demo' }),

    };
    const mockCourseBatchService: Partial<CourseBatchService> = {};
    const mockResourceService: Partial<ResourceService> = {
        messages: {
            fmsg: {
                m0054: 'We are creating note...',

            }
        },

    };
    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn()
    };
    const mockUserService: Partial<UserService> = {};
    const mockConfigService: Partial<ConfigService> = {};
    const mockCoursesService: Partial<CoursesService> = {};
    const mockTelemetryService: Partial<TelemetryService> = {};
    const mockNavigationHelperService: Partial<NavigationHelperService> = {};
    const mockGeneraliseLabelService: Partial<GeneraliseLabelService> = {
        messages: {
            fmsg: {
                m0082: "We are fetching limited published content...",

            }
        },
    };

    beforeAll(() => {
        unEnrollBatchComponent = new UnEnrollBatchComponent(
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

    it('should be create a instance of unroll batch component', () => {
        expect(unEnrollBatchComponent).toBeTruthy();
    });

    describe('ngOnInit', () => {
            // arrange
        it('should be return unenroll batch details for web and Ios', () => {
            mockCourseBatchService.getEnrollToBatchDetails = jest.fn().mockReturnValue(of(true)) as any;
            // act
            unEnrollBatchComponent.ngOnInit();
            
            // assert
            expect(mockToasterService.error).toBeCalledWith(mockGeneraliseLabelService.messages.fmsg.m0082);

        });

        it('error block for ngOnInit', ()=> {
            // arrange
            mockCourseBatchService.getEnrollToBatchDetails = jest.fn(() => throwError(of(false))) as any;
            // act
            unEnrollBatchComponent.ngOnInit();
            //assert
            expect(mockToasterService.error).toBeCalledWith(mockResourceService.messages.fmsg.m0054);
        });

    });

    it('should navigate to page', () => {     
        // act 
        unEnrollBatchComponent.redirect();
        // assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(['./'], { relativeTo: undefined });
    });
    
    it('should unsubscribe subject before unload', () => {
        //arrange
        unEnrollBatchComponent.unsubscribe = {
            next: jest.fn(),
            complete: jest.fn()
        } as any;
        // act 
        unEnrollBatchComponent.ngOnDestroy();
        //assert
        expect(unEnrollBatchComponent.unsubscribe.next).toHaveBeenCalled();
        expect(unEnrollBatchComponent.unsubscribe.complete).toHaveBeenCalled();

    });

    it('should fetch participant details', ()=> {

        //arrange
        unEnrollBatchComponent.batchDetails = {
            participants: 'demo'
        }
        const request = {
            filters: {
              identifier: unEnrollBatchComponent.batchDetails.participants
            }
        }
        mockCourseBatchService.getUserList = jest.fn().mockReturnValue(of(true)) as any;
        unEnrollBatchComponent.batchDetails.participants  = mockCourseBatchService.getUserList;
        // act
        unEnrollBatchComponent.fetchParticipantsDetails();
        // assert
        expect(unEnrollBatchComponent.showEnrollDetails).toBeTruthy();
    });

    it('should unenroll from the course', () => {
        // arrange
        const request = {
            request: {
              courseId: unEnrollBatchComponent.batchDetails.courseId,
              userId: unEnrollBatchComponent.userService.userid,
              batchId: unEnrollBatchComponent.batchDetails.identifier
            }
          };
        mockCourseBatchService.unenrollFromCourse = jest.fn(()=> of(true)) as any;
        //act
        unEnrollBatchComponent.unenrollFromCourse();
        // assert
        expect(mockCourseBatchService.unenrollFromCourse).toHaveBeenCalled();

    });   
}); 