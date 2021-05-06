import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemWarningComponent } from './system-warning.component';
import { ResourceService } from '../../services/resource/resource.service';
import { SystemInfoService } from '../../../public/module/offline/services/system-info/system-info.service';
import { of, throwError } from 'rxjs';

describe('SystemWarningComponent', () => {
  let component: SystemWarningComponent;
  let fixture: ComponentFixture<SystemWarningComponent>;

  class MockSystemInfoService {
    public info = { result: { availableMemory: 0, cpuLoad: 0 } };
    public getSystemInfo = () => of(this.info);
  }
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0085': 'There is some technical error',
      },
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemWarningComponent],
      imports: [],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        { provide: SystemInfoService, useClass: MockSystemInfoService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn<any>(component, 'getSystemInfo');
    component.ngOnInit();
    expect(component['getSystemInfo']).toHaveBeenCalled();
  });

  it('should not show the warning for either CPU or RAM', () => {
    const systemInfoService = TestBed.get(SystemInfoService);
    systemInfoService.info = { result: { availableMemory: 5600000, cpuLoad: 92 } };
    component['getSystemInfo']();
    expect(component.showCpuLoadWarning).toBe(true);
    expect(component.showMinimumRAMWarning).toBe(true);
  });

  it('should not show the warning for either CPU or RAM, when API return error', () => {
    const systemInfoService = TestBed.get(SystemInfoService);
    spyOn(systemInfoService, 'getSystemInfo').and.returnValue(throwError({}));
    systemInfoService.info = { result: { availableMemory: 5600000, cpuLoad: 50 } };
    component['getSystemInfo']();
    expect(systemInfoService.getSystemInfo).toHaveBeenCalled();
    expect(component.showCpuLoadWarning).toBe(false);
    expect(component.showMinimumRAMWarning).toBe(false);
  });

  it('should unsubscribe', () => {
    spyOn(component['unsubscribe$'], 'next');
    spyOn(component['unsubscribe$'], 'complete');
    component.ngOnDestroy();
    expect(component['unsubscribe$'].next).toHaveBeenCalled();
    expect(component['unsubscribe$'].complete).toHaveBeenCalled();
  });
});
