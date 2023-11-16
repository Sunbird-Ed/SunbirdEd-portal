import * as _ from 'lodash-es';
import { AppUpdateService } from '../../../core/services/app-update/app-update.service';
import { ResourceService } from '../../services/resource/resource.service';
import { DesktopAppUpdateComponent } from './desktop-app-update.component'
import {serverRes} from './desktop-app-update.component.spec.data';
import { of } from 'rxjs';

describe("desktop app update component", () => {
  let component: DesktopAppUpdateComponent;
  const mockAppUpdateService: Partial<AppUpdateService> = {
  };
  const mockResourceService: Partial<ResourceService> = {
      frmelmnts: 10,
      messages: {
          profile: {
              smsg: {
                  'm0041': 'We are discarding the flag...',
              }
          },
          smsg: {
              certificateGettingDownloaded: 'Certificate is getting downloaded',
              m0046: 'Profile updated successfully'
          },
          emsg: {
              m007: 'Fetching data for you',
              m0012: 'Profile updated unsuccessfully'
          },
          desktop: {
              emsg: {
                  cannotAccessCertificate: 'Certificate Access denied'
              }
          }
      }
  };
  beforeAll(() => {
    component = new DesktopAppUpdateComponent(
      mockAppUpdateService as AppUpdateService,
      mockResourceService as ResourceService
    );
});

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});
it("should be created", () => {
  expect(component).toBeTruthy();
});
it("should create the componenet and call the oninit method", () => {
  mockAppUpdateService.checkForAppUpdate = jest.fn().mockReturnValue(of(serverRes.app_update)) as any;
  component.ngOnInit();
  expect(component).toBeTruthy();
});
it("should create the componenet and call the setTelemetry method", () => {
  component.setTelemetry();
  expect(JSON.stringify(component.telemetryInteractObject)).toBe(JSON.stringify(serverRes.telemetryInteractObject));
  expect(JSON.stringify(component.telemetryInteractEdata)).toBe(JSON.stringify(serverRes.telemetryInteractEdata));
});
it('should check for app update and set properties on success', () => {
  mockAppUpdateService.checkForAppUpdate = jest.fn().mockReturnValue(of(serverRes.app_update)) as any;
  jest.spyOn(component, 'checkForAppUpdate');
  component.checkForAppUpdate();
  expect(component.checkForAppUpdate).toHaveBeenCalled();
  expect(component.isUpdateAvailable).toBeTruthy();
  expect(component.downloadUrl).toBe('https://dev.sunbirded.org/desktop/latest/artifactUrl/dev.0.0_64bit.dmg');
  expect(component.newVersion).toBe('5.2.0');
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