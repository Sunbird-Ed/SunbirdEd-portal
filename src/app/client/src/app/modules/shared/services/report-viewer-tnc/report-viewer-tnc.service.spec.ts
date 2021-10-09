import { ReportViewerTncService } from './report-viewer-tnc.service';
import { TncService, UserService } from '@sunbird/core';
import { Observable, of } from 'rxjs';

describe('ReportViewerTncService', () => {
    let reportViewerTncService: ReportViewerTncService;
    const mockTncService: Partial<TncService> = {
        getReportViewerTnc(): Observable<any> {
            return of({
                result: {
                    response: {
                        value: {
                            latestVersion: 'sample-version',
                            url: 'sample-url'
                        }
                    }
                }
            });
        }
    };
    const mockUserService: Partial<UserService> = {
        userData$: of({
            user: {
                userProfile: {
                    allTncAccepted: {
                        reportViewerTnc: true
                    }
                }
            }
        }) as any
    };

    beforeAll(() => {
        reportViewerTncService = new ReportViewerTncService(
            mockTncService as TncService,
            mockUserService as UserService
        );
    });

    it('should be create a instance for ReportViewerTncService', () => {
        expect(reportViewerTncService).toBeTruthy();
    });

    describe('getReportViewerTncPolicy', () => {
        it('should return tnc result', async() => {
            spyOn(mockTncService, 'getReportViewerTnc').and.returnValue(of({
                result: {
                    response: {
                        value: {
                            latestVersion: 'sample-version',
                            url: 'sample-url'
                        }
                    }
                }
            }));
            reportViewerTncService.getReportViewerTncPolicy();
            expect(mockTncService.getReportViewerTnc).toHaveBeenCalled();
            expect(mockUserService.userData$).toBeTruthy();
        });
    });
});
