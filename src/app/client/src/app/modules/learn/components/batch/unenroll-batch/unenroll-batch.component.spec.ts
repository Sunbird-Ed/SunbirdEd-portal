import { ActivatedRoute, Router } from "@angular/router";
import { CoursesService, GeneraliseLabelService, UserService } from "../../../../core"
import { ConfigService, NavigationHelperService, ResourceService, ToasterService } from "../../../../shared"
import { TelemetryService } from "@sunbird/telemetry";
import { CourseBatchService } from "../../../services";
import { UnEnrollBatchComponent } from "./unenroll-batch.component";
import { of, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import * as _ from 'lodash-es';
import { EventEmitter } from '@angular/core';
import { fakeOpenBatchDetails } from './unenroll-batch.component.spec.data';

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
    const mockCourseBatchService: Partial<CourseBatchService> = {
    };
    const mockResourceService: Partial<ResourceService> = {
        messages: {
            fmsg: {
                m0054: 'We are creating note...',
            },
            smsg: {
                m0045: 'User unenroled from the batch successfully'
            },
            emsg: {
                m0009:'Cannot un-enrol now. Try again later'
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
        revokeConsent: new EventEmitter<void>()
    };
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
    it('should fetch participant details when batch is open with participants', () => {
        mockCourseBatchService.getUserList = jest.fn().mockReturnValue(of(fakeOpenBatchDetails)) as any;
        unEnrollBatchComponent.showEnrollDetails = false;
        unEnrollBatchComponent.batchDetails = _.clone(fakeOpenBatchDetails);
        unEnrollBatchComponent.fetchParticipantsDetails();
        expect(unEnrollBatchComponent.showEnrollDetails).toBe(true);
    });
    it('should fetch participant details when batch is open with participants and error', () => {
        const errorResponse: HttpErrorResponse = { status: 401 } as HttpErrorResponse;
        mockCourseBatchService.getUserList = jest.fn().mockReturnValue(throwError(errorResponse)) as any;
        unEnrollBatchComponent.batchDetails = _.clone(fakeOpenBatchDetails);
        unEnrollBatchComponent.fetchParticipantsDetails();
        expect(unEnrollBatchComponent.showEnrollDetails).toBe(true);
    });
    it('should unenroll from the course', () => {
        jest.spyOn(mockCoursesService.revokeConsent, 'emit');
        mockCourseBatchService.unenrollFromCourse = jest.fn().mockReturnValue(of(fakeOpenBatchDetails)) as any;
        unEnrollBatchComponent.unenrollFromCourse();
        expect(mockToasterService.success).toBeCalledWith(mockResourceService.messages.smsg.m0045);
        expect(mockCourseBatchService.unenrollFromCourse).toHaveBeenCalled();
        expect(mockCoursesService.revokeConsent.emit).toBeCalled();
    });
    it('should unenroll from the course', () => {
        const errorResponse: HttpErrorResponse = { status: 401 } as HttpErrorResponse;
        mockCourseBatchService.unenrollFromCourse = jest.fn().mockReturnValue(throwError(errorResponse)) as any;
        unEnrollBatchComponent.unenrollFromCourse();
        expect(unEnrollBatchComponent.disableSubmitBtn).toBe(false);
        expect(mockToasterService.error).toBeCalledWith(mockResourceService.messages.emsg.m0009);
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

        it('error block for ngOnInit', () => {
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
    it('should fetch participant details when batch is open', () => {
        unEnrollBatchComponent.showEnrollDetails = false;
        jest.spyOn(unEnrollBatchComponent, 'fetchParticipantsDetails');
        unEnrollBatchComponent.ngOnInit();
        unEnrollBatchComponent.fetchParticipantsDetails();
        expect(unEnrollBatchComponent.fetchParticipantsDetails).toHaveBeenCalled();
        expect(unEnrollBatchComponent.showEnrollDetails).toBe(true);
    });
    it('should fetch participant details when batch is open', () => {
        unEnrollBatchComponent.showEnrollDetails = false;
        unEnrollBatchComponent.fetchParticipantsDetails();
        expect(unEnrollBatchComponent.showEnrollDetails).toBe(true);
    });

}); 