import { systemInfoData } from './system-info.service.spec.data';
import { of } from 'rxjs';
import { CoreModule, PublicDataService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TestBed } from '@angular/core/testing';

import { SystemInfoService } from './system-info.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SystemInfoService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule]
  }));

  it('should be created', () => {
    const service: SystemInfoService = TestBed.get(SystemInfoService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(of (systemInfoData));
    expect(service).toBeTruthy();
    const sysInfo = service.getSystemInfo();
    sysInfo.subscribe(data => {
      expect(data).toEqual(systemInfoData);
    });

  });
});
