import { ResourceService, ToasterService } from '@sunbird/shared';
import { ElectronDialogService } from '../../../offline/services';
import { TelemetryActionsService } from './../../../offline/services';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';
import { of, throwError } from 'rxjs';
import { TelemetryImportComponent } from './telemetry-import.component';
import { telemetryData } from './telemetry-import.component.spec.data';

describe("TelemetryImportComponent", () => {
    let telemetryImportComponent: TelemetryImportComponent;
    const mockResourceService: Partial<ResourceService> = {
        messages: telemetryData.resourceBundle.messages

    };
    const mockTelemetryActionsService: Partial<TelemetryActionsService> = {
        reTryTelemetryImport: jest.fn(),
        telemetryImportList: jest.fn()
    };
    const mockTelemetryService: Partial<TelemetryService> = {
        interact: jest.fn()
    };
    const mockToasterService: Partial<ToasterService> = {
        error: jest.fn()
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            data: {
                telemetry: { env: 'course', pageid: 'validate-certificate', type: 'view' }
            }
        } as any
    };
    const mockElectronDialogService: Partial<ElectronDialogService> = {
        showTelemetryImportDialog: jest.fn()
    };

    beforeAll(() => {
        telemetryImportComponent = new TelemetryImportComponent(
            mockResourceService as ResourceService,
            mockTelemetryActionsService as TelemetryActionsService,
            mockTelemetryService as TelemetryService,
            mockToasterService as ToasterService,
            mockActivatedRoute as ActivatedRoute,
            mockElectronDialogService as ElectronDialogService

        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should be created", () => {
        expect(telemetryImportComponent).toBeTruthy();
    });

    describe('setImportTelemetry', () => {
        it('should set the imported telemetry', () => {
            telemetryImportComponent.setImportTelemetry();

        });
    });

    describe('openImportTelemetryDialog', () => {
        it('should call openImportTelemetryDialog', () => {
            //arrange
            jest.spyOn(mockElectronDialogService, 'showTelemetryImportDialog').mockImplementation();
            jest.spyOn(telemetryImportComponent, 'setImportTelemetry').mockImplementation();
            //act
            telemetryImportComponent.openImportTelemetryDialog();
            //assert
            expect(telemetryImportComponent.setImportTelemetry).toHaveBeenCalledWith();
            expect(mockElectronDialogService.showTelemetryImportDialog).toHaveBeenCalled();
        });
    });

    describe('getTotalSizeImportedFiles', () => {
        it('should call getTotalSizeImportedFiles', () => {
            //arrange
            telemetryImportComponent.importFilesList = telemetryData.importList.result.response.items;
            telemetryImportComponent.importedFilesSize = 0;
            //act
            telemetryImportComponent.getTotalSizeImportedFiles();
            //assert
            expect(telemetryImportComponent.importedFilesSize).toEqual(8260);
        });
    });

    describe('setRetryImportTelemetry', () => {
        it('should set retry import telemetry', () => {
            //act
            telemetryImportComponent.setRetryImportTelemetry(telemetryData.filedetails);
        });
    });

    describe('getList', () => {
        it('should get the list', () => {
            //arrange
            mockTelemetryActionsService.telemetryImportList = jest.fn();
            jest.spyOn(telemetryImportComponent, 'getTotalSizeImportedFiles').mockImplementation();
            telemetryImportComponent.importFilesList = telemetryData.importList.result.response.items;
            //act
            telemetryImportComponent.getList();
            //assert
            expect(telemetryImportComponent.importFilesList).toBeDefined();
        });
    });

    describe('reTryImport', () => {
        it('should call reTryTelemetryImport and success case', () => {
            //arrange
            jest.spyOn(telemetryImportComponent, 'setRetryImportTelemetry').mockImplementation();
            jest.spyOn(telemetryImportComponent.apiCallSubject, 'next').mockImplementation();
            jest.spyOn(mockTelemetryActionsService, 'reTryTelemetryImport').mockReturnValue(of(telemetryData.retrySuccess));
            //act
            telemetryImportComponent.reTryImport(telemetryData.filedetails);
            //assert
            expect(telemetryImportComponent.apiCallSubject.next).toHaveBeenCalled();
            expect(telemetryImportComponent.setRetryImportTelemetry).toHaveBeenCalledWith(telemetryData.filedetails);
        });
        it('should call reTryTelemetryImport and error case', () => {
            //arrange
            jest.spyOn(telemetryImportComponent, 'setRetryImportTelemetry').mockImplementation();
            jest.spyOn(telemetryImportComponent.apiCallSubject, 'next').mockImplementation();
            jest.spyOn(telemetryImportComponent.toasterService, 'error').mockImplementation();
            jest.spyOn(mockTelemetryActionsService, 'reTryTelemetryImport').mockReturnValue(throwError(telemetryData.retryError));
            //act
            telemetryImportComponent.reTryImport(telemetryData.filedetails);
            //assert
            expect(telemetryImportComponent.toasterService.error).toHaveBeenCalledWith(telemetryData.resourceBundle.messages.etmsg.desktop.telemetryImportError);
            expect(telemetryImportComponent.apiCallSubject.next).toHaveBeenCalled();
            expect(telemetryImportComponent.setRetryImportTelemetry).toHaveBeenCalledWith(telemetryData.filedetails);
        });
    });

    describe('ngOnInit', () => {
        it('should call getImportedFilesList', () => {
            //arrange
            jest.spyOn(telemetryImportComponent.apiCallSubject, 'next').mockImplementation();
            jest.spyOn(mockTelemetryActionsService, 'telemetryImportList').mockReturnValue(of(telemetryData.importList));
            //act
            telemetryImportComponent.ngOnInit();
            //assert
            expect(telemetryImportComponent.apiCallSubject.next).toHaveBeenCalled();
        });
    });

    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            //arrange
            telemetryImportComponent.unsubscribe$ = {
                next: jest.fn(),
                complete: jest.fn()
            } as any;
            //act
            telemetryImportComponent.ngOnDestroy();
            //assert
            expect(telemetryImportComponent.unsubscribe$.next).toHaveBeenCalled();
            expect(telemetryImportComponent.unsubscribe$.complete).toHaveBeenCalled();
        });
    });

});
