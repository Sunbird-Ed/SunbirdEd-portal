import { ConfigService } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
import { of } from 'rxjs';
import * as _ from 'lodash-es';
import { UsageService } from '../usage/usage.service';
import { TelemetryService } from '@sunbird/telemetry';
import { CourseProgressService } from './course-progress.service';
import { mockRes } from './course-progress.service.spec.data';

describe("CourseProgressService", () => {
    let courseProgressService: CourseProgressService;
    const mockLearnerService: Partial<LearnerService> = {};
    const mockConfigService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                BATCH: {
                    'GET_BATCHS': "course/v1/batch/list",
                },
                DASHBOARD: {
                    'COURSE_PROGRESS_V2': "dashboard/v2/progress/course"
                },
                COURSE: {
                    "GET_REPORTS_METADATA": "course-reports/metadata"

                }
            }
        }
    };
    const mockUsageService: Partial<UsageService> = {};
    const mockTelemetryService: Partial<TelemetryService> = {
        log: jest.fn()
    };

    beforeAll(() => {
        courseProgressService = new CourseProgressService(
            mockLearnerService as LearnerService,
            mockConfigService as ConfigService,
            mockUsageService as UsageService,
            mockTelemetryService as TelemetryService,

        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(courseProgressService).toBeTruthy();
    });

    describe('getBatches', () => {
        it('should get the batches', () => {
            //assert
            mockLearnerService.post = jest.fn().mockReturnValue(of(mockRes.getMyBatchesList)) as any;
            const params = {
                data: {
                    'request': {
                        'filters': {
                            'courseId': 'do_112470675618004992181',
                            'status': ['1', '2', '3'], 'createdBy': '123'
                        }, 'sort_by': { 'createdDate': 'desc' }
                    }
                }
            };
            //act
            courseProgressService.getBatches(params).subscribe(
                apiResponse => {
                    //assert
                    expect(apiResponse.responseCode).toBe('OK');
                    expect(apiResponse.result.response.count).toBe(2);
                }
            );
        });
    });

    describe('getDashboardData', () => {
        it('should call get Dashboard API', () => {
            //arrange
            mockLearnerService.get = jest.fn().mockReturnValue(of(mockRes.courseProgressData.getBatchDetails)) as any;
            const params = {
                data: {
                    'limit': 200,
                    'offset': 0
                },
                sortBy: 'name',
                sortOrder: '1',
                username: 'test'
            };
            //act
            courseProgressService.getDashboardData(params).subscribe(
                apiResponse => {
                    //assert
                    expect(apiResponse).toBe('SUCCESS');
                    expect(apiResponse.result.count).toBe(9);
                    expect(apiResponse.result.completedCount).toBe(2);
                }
            );
        });
    });

    describe('downloadDashboardData', () => {
        it('should call Download API', () => {
            //arrange
            mockLearnerService.get = jest.fn().mockReturnValue(of(mockRes.downloadDashboardReport.getSuccessData));
            const params = {
                data: {
                    'batchIdentifier': '01241050605165772817'
                }
            };
            //act
            courseProgressService.downloadDashboardData(params).subscribe(
                apiResponse => {
                    //assert
                    expect(apiResponse.responseCode).toBe('OK');
                    expect(apiResponse.result.requestId).toBe('01241050605165772817');
                }
            );
        });
    });

    describe('parseDasboardResponse', () => {
        it('should call parseDasboardResponse method', () => {
            //arrange
            const data = {
                'series': {
                    'course.progress.course_progress_per_user.count': {
                        'name': 'List of users enrolled for the course',
                        'split': 'content.sum(time_spent)',
                        'buckets': [
                            {
                                'enrolledOn': '2018-04-20 17:14:32:655+0000',
                                'lastAccessTime': null,
                                'org': null,
                                'progress': 0,
                                'batchEndsOn': '2018-05-12',
                                'userName': 'usernov17',
                                'user': 'ac918519-f8b8-4150-bd90-56ead42454d0'
                            }
                        ]
                    }
                }
            };
            //act
            courseProgressService.parseDasboardResponse(data);
            //assert
            expect(courseProgressService.parseDasboardResponse(data)).toBeDefined();
        });
    });

    describe('getReportsMetaData', () => {
        it('should call get report metadata API', () => {
            //arrange
            mockUsageService.getData = jest.fn().mockReturnValue(of(mockRes.reportsLastUpdatedDateMock));
            const params = {
                data: {
                    'course-progress-reports': `course-progress-reports/report-01241050605165772817.csv`,
                    'assessment-reports': `assessment-reports/report-01241050605165772817.csv`
                },
                telemetryData: {
                    context: {
                        env: 'workspace'
                    },
                    edata: {
                        type: 'list',
                        pageid: 'workspace-content-unlisted',
                        subtype: 'scroll',
                        uri: '',
                        visits: []
                    }
                }
            };
            //act
            mockTelemetryService.log = jest.fn().mockReturnValue(of(params));
            courseProgressService.getReportsMetaData(params).subscribe(
                apiResponse => {
                    //assert
                    expect(apiResponse.responseCode).toBe('OK');
                    expect(mockTelemetryService.log).toHaveBeenCalled();
                }
            );
        });
    });
});
