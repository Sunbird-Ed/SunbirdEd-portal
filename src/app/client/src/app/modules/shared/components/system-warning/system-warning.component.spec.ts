import * as _ from 'lodash-es';
import { of, throwError } from 'rxjs';
import { SystemInfoService } from '../../../public/module/offline/services/system-info/system-info.service';
import { ResourceService } from '../../services/resource/resource.service';
import { SystemWarningComponent } from './system-warning.component';

describe('System warning component', () => {
  let component: SystemWarningComponent;
  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
      lbl: {
        Select: 'Select'
      },
      cert: {
        lbl: {
          preview: 'preview',
          certAddSuccess: 'Certificate added successfully',
          certUpdateSuccess: 'Certificate updated successfully.',
          certAddError: 'Failed to add the certificate. Try again later.',
          certEditError: 'Failed to edit the certificate. Try again later.'
        }
      }
    },
    messages: {
      emsg: {
        m0005: 'Something went wrong, try again later'
      }
    }
  };
  const mockSystemInfoService: Partial<SystemInfoService> = {
    getSystemInfo: jest.fn()
  };
  
  beforeAll(() => {
    component = new SystemWarningComponent(
      mockResourceService as ResourceService,
      mockSystemInfoService as SystemInfoService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should create a System warning instance of ', () => {
    expect(component).toBeTruthy();
  });
  it('should create a System warning instance of with data ', () => {
    const data = {
      result:{
        availableMemory: 104857200,
        cpuLoad:95
      }
    }
    mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of(data)) as any;
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.showCpuLoadWarning).toBeTruthy();
    expect(component.showMinimumRAMWarning).toBeTruthy();
  });
  it('should create a System warning instance of with data with less value', () => {
    const data = {
      result:{
        availableMemory: 1
      }
    }
    mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of(data)) as any;
    component.ngOnInit();
    expect(component.showCpuLoadWarning).toBeFalsy();
    expect(component.showMinimumRAMWarning).toBeFalsy();
  });
  it('should create a System warning instance of with error', () => {
    const error = {
    }
    mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(throwError({ result: { response: { err: { message: 'Error' } } } })) as any;
    component.ngOnInit();
    expect(component.showCpuLoadWarning).toBeFalsy();
    expect(component.showMinimumRAMWarning).toBeFalsy();
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