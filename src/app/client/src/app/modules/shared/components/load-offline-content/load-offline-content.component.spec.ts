import { ElectronService } from '../../../core/services/electron/electron.service';
import { ResourceService, ConnectionService, ConfigService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { _ } from 'lodash-es';
import { of, throwError } from 'rxjs';
import { LoadOfflineContentComponent } from './load-offline-content.component';

describe('LoadOfflineContentComponent', () => {
    let component: LoadOfflineContentComponent;

    const router: Partial<Router> = {
        events: of({ id: 1, url: 'sample-url' }) as any,
        navigate: jest.fn()
    };
    const connectionService: Partial<ConnectionService> = {
        monitor: jest.fn(() => of(true))
    };
    const resourceService: Partial<ResourceService> = {};
    const activatedRoute: Partial<ActivatedRoute> = {
        snapshot : {
            data: {
              telemetry: { env: 'library', pageid: 'library', type: 'view', subtype: 'paginate' }
            }
          } as any
    };
    const configService: Partial<ConfigService> = {
          urlConFig: {
            URLS: {
                ELECTRON_DIALOG: {
                    'CONTENT_IMPORT': 'content/import',
                    'CONTENT_EXPORT': 'content/export',
                    'TELEMETRY_EXPORT': 'telemetry/export',
                    'TELEMETRY_IMPORT': 'telemetry/import'
                  },
            }
          }
    };
    const electronService: Partial<ElectronService> = {
       // get: jest.fn().mockReturnValue(of({})) as any
    };

    beforeAll(() => {
        component = new LoadOfflineContentComponent(
            router as Router,
            connectionService as ConnectionService,
            resourceService as ResourceService,
            activatedRoute as ActivatedRoute,
            configService as ConfigService,
            electronService as ElectronService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should call the oninit method', () => {
        connectionService.monitor = jest.fn(() => of(true));
        component.ngOnInit();
        setTimeout(() => {
            expect(connectionService.monitor).toHaveBeenCalled();
            expect(component.selectedValue).toEqual('browse')
        }, 10);
    });
    it('should call closeModal() with false value', () => {
        component.isConnected = false;
        component.closeModal();
        expect(component.selectedValue).toEqual('import')
        expect(component.showLoadContentModal).toBeFalsy();
    });
    it('should call the oninit method with connection as false', () => {
        connectionService.monitor = jest.fn(() => of(false));
        component.ngOnInit();
        setTimeout(() => {
            expect(connectionService.monitor).toHaveBeenCalled();
            expect(component.selectedValue).toEqual('import')
        }, 10);
    });
    it('should call the oninit method with hideLoadButton as true', () => {
        component.hideLoadButton = true;
        connectionService.monitor = jest.fn(() => of(true));
        component.ngOnInit();
        setTimeout(() => {
            expect(component.handleImportContentDialog).toHaveBeenCalled();
        }, 10);
    });
    it('should call the openImportContentDialog method ', () => {
        connectionService.monitor = jest.fn(() => of(false));
        electronService.get = jest.fn().mockReturnValue(of({})) as any;
        component.modal={
            deny:jest.fn()
          };
        component.ngOnInit();
        jest.spyOn(component, 'openImportContentDialog');
        component.navigate();
        expect(component.openImportContentDialog).toHaveBeenCalled();
    });
    it('should call closeModal()', () => {
        component.isConnected = true;
        jest.spyOn(component, 'closeModal');
        component.closeModal();
        expect(component.closeModal).toHaveBeenCalled();
        expect(component.selectedValue).toEqual('browse')
        expect(component.showLoadContentModal).toBeFalsy();
    });
    it('should call the openImportContentDialog method ', () => {
        connectionService.monitor = jest.fn(() => of(true));
        electronService.get = jest.fn().mockReturnValue(of({})) as any;
        component.modal={
            deny:jest.fn()
          };
        component.ngOnInit();
        component.navigate();
        expect(router.navigate).toBeCalled();
    });
    it('should set Telemetry data', () => {
        component.selectedValue = 'import';
        component.setTelemetryData();
        expect(component.cancelTelemetryInteractEdata).toBeDefined();
        expect(component.continueTelemetryInteractEdata).toBeDefined();
      });
   
      it('should call addFontWeight on changeofevent ', () => {
        component.showLoadContentModal = true;
        jest.spyOn(component, 'addFontWeight');
        jest.spyOn(component, 'setTelemetryData');
        jest.spyOn(document, 'getElementById').mockImplementation(() => {
            return {checked: false} as any;
          });
        component.onChange('import');
        expect(document.getElementById('online')['checked']).toBeFalsy();
        expect(component.selectedValue).toEqual('import');
        expect(component.addFontWeight).toHaveBeenCalled();
        expect(component.setTelemetryData).toHaveBeenCalled();
      });
      it('should call addFontWeight on changeofevent without import event', () => {
        component.showLoadContentModal = true;
        jest.spyOn(component, 'addFontWeight');
        jest.spyOn(component, 'setTelemetryData');
        jest.spyOn(document, 'getElementById').mockImplementation(() => {
            return {checked: true} as any;
          });
        component.onChange('browse');
        expect(document.getElementById('offline')['checked']).toBeTruthy();
        expect(component.selectedValue).toEqual('browse');
        expect(component.addFontWeight).toHaveBeenCalled();
        expect(component.setTelemetryData).toHaveBeenCalled();
      });
      it('should call showContentImportDialog on error', () => {
        component.showLoadContentModal = true;
        jest.spyOn(electronService, 'get').mockImplementation(()=>of(throwError({error: {params: {errmsg: "ERROR"}}})) as any)
        component.openImportContentDialog();
      });
    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            component.unsubscribe$ = {
                next: jest.fn(),
                complete: jest.fn()
            } as any;
            component.ngOnDestroy();
            expect(component.unsubscribe$.next).toHaveBeenCalled();
            expect(component.unsubscribe$.complete).toHaveBeenCalled();
        });
    });
    
});