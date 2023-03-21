import { of } from 'rxjs';
import { PublicDataService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { ElectronDialogService } from '../electron-dialog/electron-dialog.service';
import { TelemetryActionsService } from './telemetry-actions.service';
import { telemetry } from './telemetry-actions.service.spec.data';

describe("TelemetryActionsService", () => {
    let telemetryActionsService: TelemetryActionsService;
    const mockConfigService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                OFFLINE: {
                    TELEMTRY_INFO: 'telemetry-sample',
                    IMPORT_TELEMETRY_LIST: 'teleList-sample',
                    EXPORT_TELEMETRY: 'export-sample',
                    TELEMETRY_IMPORT_RETRY: 'sample-retry',
                    TELEMTRY_CONFIG: 'sample-config'
                }
            }
        }
    };
    const mockPublicDataService: Partial<PublicDataService> = {
        get: jest.fn(),
        post: jest.fn()
    };
    const mockElectronDialogService: Partial<ElectronDialogService> = {
        showTelemetryExportDialog: jest.fn()
    };


    beforeAll(() => {
        telemetryActionsService = new TelemetryActionsService(
            mockConfigService as ConfigService,
            mockPublicDataService as PublicDataService,
            mockElectronDialogService as ElectronDialogService,

        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(telemetryActionsService).toBeTruthy();
    });

    describe('getTelemetryInfo', () => {
        it('should get telemetry Info', () => {
            //arrange
            jest.spyOn(telemetryActionsService['publicDataService'], 'get').mockReturnValue(of(telemetry.info));
            //act
            telemetryActionsService.getTelemetryInfo();
            //assert
            expect(telemetryActionsService.publicDataService.get).toHaveBeenCalled();
            telemetryActionsService['publicDataService'].get({
                url: telemetryActionsService.configService.urlConFig.URLS.OFFLINE.TELEMTRY_INFO,
            }).subscribe(data => {
                expect(data).toEqual(telemetry.info);
            });
        });
    });

    describe('getSyncTelemetryStatus', () => {
        it('should call getSyncTelemetryStatus', () => {
            //arrange
            jest.spyOn(telemetryActionsService['publicDataService'], 'get').mockReturnValue(of(telemetry.syncStatusInfo));
            //act
            telemetryActionsService.getSyncTelemetryStatus();
            //assert
            expect(telemetryActionsService.publicDataService.get).toHaveBeenCalled();
            telemetryActionsService['publicDataService'].get({
                url: telemetryActionsService.configService.urlConFig.URLS.OFFLINE.TELEMTRY_INFO + '?syncConfig=true',
            }).subscribe(data => {
                expect(data).toEqual(telemetry.syncStatusInfo);
            });
        });
    });

    describe('exportTelemetry', () => {
        it('should be call exportTelemetry', (done) => {
            //arrange
            mockElectronDialogService.showTelemetryExportDialog = jest.fn(() => of({ destFolder: '/file_to_export/' })) as any;
            mockPublicDataService.post = jest.fn(() => of(telemetry.exportSuccess)) as any;
            //act
            telemetryActionsService.exportTelemetry().subscribe(() => { done() })
            //assert
            expect(telemetryActionsService.publicDataService.post).toHaveBeenCalled();
            expect(mockElectronDialogService.showTelemetryExportDialog).toHaveBeenCalled();

        });
    });

    describe('reTryTelemetryImport', () => {
        it('should be call reTryTelemetryImport and success', (done) => {
            //arrange
            mockPublicDataService.post = jest.fn(() => of(telemetry.retrySuccess)) as any;
            //act
            telemetryActionsService.reTryTelemetryImport(telemetry.retryData).subscribe(() => done());
            //assert
            expect(telemetryActionsService.publicDataService.post).toHaveBeenCalled();
            telemetryActionsService['publicDataService'].post({
                url: telemetryActionsService.configService.urlConFig.URLS.OFFLINE.TELEMETRY_IMPORT_RETRY,
            }).subscribe(data => {
                expect(data).toEqual(telemetry.retrySuccess);
            });
        });
    });

    describe('syncTelemtry', () => {
        it('should be call syncTelemtry and success', (done) => {
            //arrange
            mockPublicDataService.post = jest.fn(() => of(telemetry.syncTelemetry.success)) as any;
            // jest.spyOn(telemetryActionsService['publicDataService'], 'post').mockReturnValue(of(telemetry.syncTelemetry.success));
            const data = {
                'request': {
                    'type': ['TELEMETRY']
                }
            };
            //act
            telemetryActionsService.syncTelemtry(data).subscribe(() => done());
            //assert
            expect(telemetryActionsService.publicDataService.post).toHaveBeenCalled();
            telemetryActionsService['publicDataService'].post({
                url: telemetryActionsService.configService.urlConFig.URLS.OFFLINE.TELEMTRY_CONFIG,
            }).subscribe(response => {
                expect(response).toEqual(telemetry.syncTelemetry.success);
            });
        });
    });

    describe('updateSyncStatus', () => {
        it('should be call updateSyncStatus', (done) => {
            //arrange
            mockPublicDataService.post = jest.fn(() => of(telemetry.updateSyncStatus)) as any;
            const requestBody = {
                'request': {
                    'enable': true
                }
            };
            //act
            telemetryActionsService.updateSyncStatus(requestBody).subscribe(() => done());
            //assert
            expect(telemetryActionsService.publicDataService.post).toHaveBeenCalled();
            telemetryActionsService['publicDataService'].post({
                url: telemetryActionsService.configService.urlConFig.URLS.OFFLINE.TELEMTRY_CONFIG,
            }).subscribe(data => {
                expect(data).toEqual(telemetry.updateSyncStatus);
            });
        });
    });

    describe('telemetryImportList', () => {
        it('should be call telemetryImportList', (done) => {
            //arrange
            mockPublicDataService.post = jest.fn(() => of(telemetry.importList)) as any;
            //act
            telemetryActionsService.telemetryImportList().subscribe(() => done());
            //assert
            expect(telemetryActionsService.publicDataService.post).toHaveBeenCalled();
        });
    });
});
