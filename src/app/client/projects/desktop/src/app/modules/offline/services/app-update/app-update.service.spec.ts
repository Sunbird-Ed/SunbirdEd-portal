import { of as observableOf, throwError } from 'rxjs';
import { serverRes } from './app-update.service.spec.data';
import { TestBed } from '@angular/core/testing';
import { AppUpdateService } from './app-update.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';


describe('AppUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ConfigService, PublicDataService]
  }));

  it('should be created', () => {
    const service: AppUpdateService = TestBed.get(AppUpdateService);
    expect(service).toBeTruthy();
  });

  it('app-update should send the response', () => {
    const service: AppUpdateService = TestBed.get(AppUpdateService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(observableOf(serverRes.app_update));
    service.checkForAppUpdate().subscribe(response => {
      expect(response).toBe(serverRes.app_update);
    });
    expect(publicDataService.get).toHaveBeenCalled();
  });

  it('app-update should throw error', () => {
    const service: AppUpdateService = TestBed.get(AppUpdateService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(throwError(serverRes.error));
    service.checkForAppUpdate().subscribe(data => {}, err => {
      expect(err).toBe(serverRes.error);
    });
    expect(publicDataService.get).toHaveBeenCalled();
  });

  it('should get app info data', () => {
    const service: AppUpdateService = TestBed.get(AppUpdateService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(observableOf(serverRes.appInfoSuccess));
    service.getAppInfo().subscribe(data => {
      expect(data).toEqual(serverRes.appInfoSuccess);
    });
    expect(publicDataService.get).toHaveBeenCalledWith({url: 'app/v1/info'});
  });

  it('should get app info failure case', () => {
    const service: AppUpdateService = TestBed.get(AppUpdateService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(throwError(serverRes.appInfoFailureCase));
    service.getAppInfo().subscribe(data => {}, err => {
      expect(err).toEqual(serverRes.appInfoFailureCase);
    });
    expect(publicDataService.get).toHaveBeenCalledWith({url: 'app/v1/info'});
  });


});
