import { Router, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CacheService } from 'ng2-cache-service';
import { ResourceService, ConfigService, BrowserCacheTtlService, ToasterService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsAndConditionsPopupComponent } from './terms-conditions-popup.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { tNcMockResponse } from './terms-conditions-popup.component.spec.data';
import { UserService, TenantService } from '@sunbird/core';
import { mockUserData } from '../../../core/services/user/user.mock.spec.data';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';

describe('TermsAndConditionsPopupComponent', () => {
  let component: TermsAndConditionsPopupComponent;
  let fixture: ComponentFixture<TermsAndConditionsPopupComponent>;

  const resourceServiceMockData = {
    messages: {
      stmsg: { m0129: 'Loading the Terms and Conditions.' },
      fmsg: { m0085: 'There was a technical error. Try again.'},
      emsg: { m0005: 'Something went wrong, please try in some time....'}
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'explore', pageid: 'download-offline-app', type: 'view'
        }
      }
    }
  };

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), SuiModule, CoreModule],
      declarations: [TermsAndConditionsPopupComponent],
      providers: [ConfigService, CacheService,
        BrowserCacheTtlService, DeviceDetectorService, ToasterService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceServiceMockData }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the user data', () => {
    component.tncUrl = '';
    const userService = TestBed.get(UserService);
    const tenantService = TestBed.get(TenantService);
    userService._userProfile = { 'organisations': ['01229679766115942443'],
    'tncLatestVersionUrl' : 'https://preprodall.blob.core.net/termsandcond/demo.html'
  };
    userService._userData$.next({ err: null, userProfile: mockUserData });
    tenantService._tenantData$.next({ err: null, tenantData: tNcMockResponse.tenantMockData });
    component.ngOnInit();
  });

  it('should get error toast message if user data gives error', () => {
    component.tncUrl = '';
    const userService = TestBed.get(UserService);
    const tenantService = TestBed.get(TenantService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    spyOn(toasterService, 'error').and.callThrough();
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    userService._userData$.next({ err: 'error', userProfile: mockUserData });
    tenantService._tenantData$.next({ err: null, tenantData: tNcMockResponse.tenantMockData });
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);

  });

  it('should set the tncLatestVersionUrl if it is coming as input', () => {
    component.tncUrl = 'https://preprodall.blob.core.net/termsandcond/demo.html';
    const sanitizedUrl = component.sanitizer.bypassSecurityTrustResourceUrl(component.tncUrl);
    component.ngOnInit();
    expect(component.tncLatestVersionUrl).toEqual(sanitizedUrl);
  });

  it('should call acceptTermsAndConditions api', () => {
    component.disableContinueBtn = true;
    const userService = TestBed.get(UserService);
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    userService._userData$.next({ err: null, userProfile: mockUserData });
    spyOn(userService, 'acceptTermsAndConditions').and.returnValue(observableOf({}));
    spyOn(component, 'onClose').and.callThrough();
    component.onSubmitTnc('');
    expect(component.onClose).toHaveBeenCalled();
  });

  it('should send user id as managed user is active for tnc accept', () => {
    component.disableContinueBtn = true;
    const userService = TestBed.get(UserService);
    const userData = mockUserData.success;
    userData.result.response['managedBy'] = 'mock iD';
    userService._userProfile = userData.result.response;
    userService.setUserId('mock iD');
    userService._userData$.next({err: null, userProfile: userData});
    spyOn(userService, 'acceptTermsAndConditions').and.returnValue(observableOf({}));
    spyOn(component, 'onClose').and.callThrough();
    component.onSubmitTnc('');
    expect(component.onClose).toHaveBeenCalled();
    expect(userService.acceptTermsAndConditions).toHaveBeenCalledWith(
      {request: {version: undefined, userId: 'mock iD'}});
  });

  it('should not call acceptTermsAndConditions api', () => {
    component.disableContinueBtn = true;
    const userService = TestBed.get(UserService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    userService._userProfile = { 'organisations': ['01229679766115942443'] };
    userService._userData$.next({ err: null, userProfile: mockUserData });
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(userService, 'acceptTermsAndConditions').and.callFake(() => observableThrowError({}));
    component.onSubmitTnc('');
    expect(component.disableContinueBtn).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0085);
  });
});
