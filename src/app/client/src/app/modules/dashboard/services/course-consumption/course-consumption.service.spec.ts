import { ConfigService } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
import { DashboardUtilsService } from './../dashboard-utils/dashboard-utils.service';
import { CourseConsumptionService } from './course-consumption.service';
import { of as observableOf, throwError as observableThrowError, of, throwError } from 'rxjs';
import { mockRes } from './course-consumption.service.spec.data';
import { HttpErrorResponse } from '@angular/common/http';

xdescribe("PageApiService", () => {
    let courseConsumptionService: CourseConsumptionService;
    const mockLearnerService: Partial<LearnerService> = {
        get: jest.fn()
    };
    const mockDashboardUtilsService: Partial<DashboardUtilsService> = {};
    const mockConfigService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                DASHBOARD: {
                    COURSE_CONSUMPTION: 'asset/v1/upload/SOME_IDENTIFIER',
                    ORG_CREATION: "ORG_CREATION",
                    ORG_CONSUMPTION: "ORG_CONSUMPTION"
                }
            }
        },
    };

    beforeAll(() => {
        courseConsumptionService = new CourseConsumptionService(
            mockLearnerService as LearnerService,
            mockDashboardUtilsService as DashboardUtilsService,
            mockConfigService as ConfigService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(courseConsumptionService).toBeTruthy();
    });

    xdescribe('parseApiResponse', () => {
        //arrange
        it("should parse org creation api response", () => {
            courseConsumptionService.blockData = [];
            const mockResponse: any = mockRes.successData;
            mockDashboardUtilsService.secondToMinConversion = jest.fn().mockReturnValue(mockResponse) as any;
            //act
            courseConsumptionService.parseApiResponse(mockResponse) as any;
            //assert
            expect(mockDashboardUtilsService).toBeTruthy();
        });
    });

    xdescribe('getDashboardData', () => {
        it("should make api call to get org creation data", () => {
            //arrange
            const params = {
                data: { identifier: "do_2123250076616048641482", timePeriod: "7d" },
                dataset: "ORG_CREATION",
            };
            const mockResponse = mockRes.parsedSuccessData;
            jest.spyOn(mockLearnerService, "get").mockReturnValue(of(mockResponse) as any)
            courseConsumptionService.parseApiResponse = jest.fn().mockReturnValue(mockResponse) as any;
            //act
            courseConsumptionService.getDashboardData(params).subscribe({
                next: (data) => { },
            });
            //assert
            expect(courseConsumptionService).toBeTruthy();
            expect(courseConsumptionService.parseApiResponse).toBeCalledWith(mockResponse)
        });

        it("should handle error", async () => {
            //arrange
            const errorResponse = new HttpErrorResponse({
                error: "404",
            });
            const params = {
                data: { identifier: "do_2123250076616048641482", timePeriod: "7d" },
                dataset: "ORG_CREATION",
            };
            const mockResponse = mockRes.parsedSuccessData;
            jest
                .spyOn(mockLearnerService, "get")
                .mockReturnValue(throwError(() => errorResponse));
            //act
            courseConsumptionService.getDashboardData(params).subscribe({
                next: (data) => console.log(data),
                error: (error) => { },
            });
            //assert
            expect(courseConsumptionService.parseApiResponse).toBeCalled;
        });
    });
});