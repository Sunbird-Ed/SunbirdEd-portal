import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreModule, TncService, UserService, GeneraliseLabelService } from '@sunbird/core';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { SuiModule } from 'ng2-semantic-ui';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { MockData } from './global-consent-pii.component.spec.data';
// import {  } from '../../../core/services/generalisedLable/generaliseLable.service';

import { GlobalConsentPiiComponent } from './global-consent-pii.component';

describe('GlobalConsentPiiComponent', () => {
  let component: GlobalConsentPiiComponent;
  let fixture: ComponentFixture<GlobalConsentPiiComponent>;
  let activatedRoute;
  configureTestSuite();
  const resourceBundle = {
    frmelmnts: {
      btn: {
        close: 'Close'
      },
      cert: {
        lbl: {
          batchCreateSuccess: 'Batch created successfully.',
          batchUpdateSuccess: 'Batch updated successfully.',
          addCert: 'Add certificate'
        }
      }
    },
    messages: {
      emsg: { 'm0005': 'Something went wrong, try again later' },
      fmsg: { 'm0004': 'Could not fetch data, try again later', dataSettingNotSubmitted: 'Your data settings are not submitted!' },
      smsg: { dataSettingSubmitted: 'Your data settings are submitted successfully' },
    }
  };

  const MockCSService = {
    updateConsent() { return of({}); },
    getConsent() { return of({}); }
  };

  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({});
    get queryParams() { return this.queryParamsMock.asObservable(); }
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
  }

  const routerStub = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [GlobalConsentPiiComponent],
      imports: [SuiModule, SharedModule.forRoot(), CoreModule, HttpClientTestingModule],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        ToasterService,
        UserService,
        { provide: 'CS_USER_SERVICE', useValue: MockCSService },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useValue: routerStub },
        GeneraliseLabelService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalConsentPiiComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.get(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user Information', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = MockData.userProfile;
    component.collection = MockData.collection;
    spyOn(component, 'getUserConsent');
    spyOn(component, 'getUserInformation').and.callThrough();
    component.ngOnInit();
    expect(component.getUserInformation).toHaveBeenCalled();
    expect(component.getUserConsent).toHaveBeenCalled();
    expect(component.userInformation['name']).toEqual(`${MockData.userProfile.firstName} ${MockData.userProfile.lastName}`);
  });

  it('should fetch tnc configuration', () => {
    const tncService = TestBed.get(TncService);
    spyOn(tncService, 'getTncConfig').and.returnValue(of(MockData.tncConfig));
    component.fetchTncData();
    expect(component.termsAndConditionLink).toEqual('http://test.com/tnc.html');
  });

  it('should not fetch tnc configuration and throw error', () => {
    const tncService = TestBed.get(TncService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(tncService, 'getTncConfig').and.returnValue(throwError(MockData.tncConfig));
    component.fetchTncData();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
  });

  it('should fetch tnc configuration and throw error as cannot parse data', () => {
    const tncService = TestBed.get(TncService);
    spyOn(tncService, 'getTncConfig').and.returnValue(of(MockData.tncConfigIncorrectData));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    component.fetchTncData();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
  });

  it('should call toggleEditSetting', () => {
    component.editSetting = false;
    component.toggleEditSetting();
    expect(component.editSetting).toBe(true);
  });

  it('should call showAndHidePopup', () => {
    component.showAndHidePopup(true);
    expect(component.showTncPopup).toBe(true);
  });

  it('should call saveConsent and as NO', () => {
    component.consentPii = 'No';
    spyOn(component, 'updateUserConsent');
    spyOn(component, 'toggleEditSetting');
    component.saveConsent();
    expect(component.updateUserConsent).toHaveBeenCalled();
    expect(component.toggleEditSetting).toHaveBeenCalled();
  });

  it('should call saveConsent and as YES', () => {
    component.consentPii = 'Yes';
    spyOn(component, 'updateUserConsent');
    spyOn(component, 'toggleEditSetting');
    component.saveConsent();
    expect(component.showConsentPopup).toBe(true);
    expect(component.toggleEditSetting).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    spyOn(component.unsubscribe, 'complete');
    spyOn(component.unsubscribe, 'next');
    component.profileDetailsModal = {
      deny: jasmine.createSpy('deny')
    };
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
    expect(component.unsubscribe.next).toHaveBeenCalled();
    expect(component.profileDetailsModal.deny).toHaveBeenCalled();
  });

  it('should get getUserConsent', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = MockData.userProfile;
    component.collection = MockData.collection;
    const csUserService = TestBed.get('CS_USER_SERVICE');
    spyOn(csUserService, 'getConsent').and.returnValue(of(MockData.getConsentResponse));
    component.getUserConsent();
    expect(csUserService.getConsent).toHaveBeenCalled();
    expect(component.isDataShareOn).toBe(false);
    expect(component.consentPii).toEqual('Yes');
  });

  it('should not get getUserConsent', () => {
    const userService = TestBed.get(UserService);
    const toastService = TestBed.get(ToasterService);
    userService._userProfile = MockData.userProfile;
    component.collection = MockData.collection;
    const csUserService = TestBed.get('CS_USER_SERVICE');
    spyOn(csUserService, 'getConsent').and.returnValue(throwError({}));
    spyOn(toastService, 'error');
    component.getUserConsent();
    expect(csUserService.getConsent).toHaveBeenCalled();
    expect(toastService.error).toHaveBeenCalledWith('Could not fetch data, try again later');
  });

  it('should not get getUserConsent and with error 404', () => {
    const userService = TestBed.get(UserService);
    const toastService = TestBed.get(ToasterService);
    userService._userProfile = MockData.userProfile;
    component.collection = MockData.collection;
    const csUserService = TestBed.get('CS_USER_SERVICE');
    spyOn(csUserService, 'getConsent').and.returnValue(throwError({ code: 'HTTP_CLIENT_ERROR', response: { responseCode: 404 } }));
    spyOn(toastService, 'error');
    component.getUserConsent();
    expect(csUserService.getConsent).toHaveBeenCalled();
    expect(component.showConsentPopup).toBe(true);
  });
  it('should update User Consent', () => {
    const userService = TestBed.get(UserService);
    const toastService = TestBed.get(ToasterService);
    userService._userProfile = MockData.userProfile;
    component.collection = MockData.collection;
    const csUserService = TestBed.get('CS_USER_SERVICE');
    spyOn(csUserService, 'updateConsent').and.returnValue(of(MockData.updateConsentResponse));
    spyOn(toastService, 'success');
    spyOn(component, 'getUserConsent');
    component.updateUserConsent(true);
    expect(csUserService.updateConsent).toHaveBeenCalled();
    expect(toastService.success).toHaveBeenCalledWith('Your data settings are submitted successfully');
    expect(component.getUserConsent).toHaveBeenCalled();
    expect(component.showConsentPopup).toBe(false);
  });

  it('should not update User Consent', () => {
    const userService = TestBed.get(UserService);
    const toastService = TestBed.get(ToasterService);
    userService._userProfile = MockData.userProfile;
    component.collection = MockData.collection;
    const csUserService = TestBed.get('CS_USER_SERVICE');
    spyOn(csUserService, 'updateConsent').and.returnValue(throwError({}));
    spyOn(toastService, 'error');
    component.updateUserConsent(true);
    expect(csUserService.updateConsent).toHaveBeenCalled();
    expect(toastService.error).toHaveBeenCalledWith('Something went wrong, try again later');
    expect(component.showConsentPopup).toBe(false);
  });

  it('should listen to QueryParams', fakeAsync(() => {
    activatedRoute.changeQueryParams({ consent: true });
    spyOn(component, 'removeQueryParam');
    component.checkQueryParams();
    activatedRoute.changeQueryParams({ consent: true });
    tick(100);
    expect(component.showConsentPopup).toBe(true);
    expect(component.removeQueryParam).toHaveBeenCalled();
  }));

  it('should remove query params from the active URL', () => {
    const router = TestBed.get(Router);
    component.removeQueryParam();
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: { 'consent': null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  });
});

