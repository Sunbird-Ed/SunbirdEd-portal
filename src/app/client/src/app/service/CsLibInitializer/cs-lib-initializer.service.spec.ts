import { TestBed } from '@angular/core/testing';
import { CsLibInitializerService } from './cs-lib-initializer.service';
import { configureTestSuite } from '@sunbird/test-util';
import { CoreModule, UserService } from '@sunbird/core';
import { CsModule } from '@project-sunbird/client-services';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CsLibInitializerService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    providers: [CsLibInitializerService],
    imports: [CoreModule, SharedModule.forRoot(), HttpClientTestingModule]
  }));

  it('should create CsLibInitializerService', () => {
    const service: CsLibInitializerService = TestBed.inject(CsLibInitializerService);
    expect(service).toBeTruthy();
  });

  it('should initialize CsModule', () => {
    const service: CsLibInitializerService = TestBed.inject(CsLibInitializerService);
    const userService:any = TestBed.inject(UserService);
    userService['_userData$'].next({ err: null, userProfile: {} as any });
    spyOn(document, 'getElementById').and.returnValue({value: '123'});
    CsModule.instance['_isInitialised'] = false;
    spyOn(CsModule.instance, 'init').and.callThrough();
    userService._appId = '123';
    service.initializeCs();
    expect(CsModule.instance.init).toHaveBeenCalled();
    expect(CsModule.instance.isInitialised).toBeTruthy();
  });
});
