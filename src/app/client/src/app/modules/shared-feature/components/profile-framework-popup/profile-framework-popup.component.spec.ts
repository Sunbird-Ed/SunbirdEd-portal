import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileFrameworkPopupComponent } from './profile-framework-popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  FrameworkService, FormService, ChannelService, CoreModule, UserService, OrgDetailsService, PublicDataService } from '@sunbird/core';
import { ConfigService, ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { throwError, of } from 'rxjs';
import { Response } from './profile-framework-popup.component.spec.data';
import { CacheService } from 'ng2-cache-service';

describe('ProfileFrameworkPopupComponent', () => {
  let component: ProfileFrameworkPopupComponent;
  let fixture: ComponentFixture<ProfileFrameworkPopupComponent>;
  let channelService, formService, cacheService, userService, publicDataService, orgDetailsService, toasterService, router;
  let mockFormFields, mockCustodianOrg, mockFrameworkCategories, mockHashTagId, mockFrameworkId, mockCustOrgFrameWorks;
  let makeChannelReadSuc, makeFrameworkReadSuc, makeFormReadSuc, makeCustOrgSuc, makeCustOrgFrameWorkSuc;
  const resourceBundle = {
    'messages': {
      'emsg': {'m0005': ''}
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      declarations: [ProfileFrameworkPopupComponent],
      providers: [CacheService, { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub }],
        schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFrameworkPopupComponent);
    component = fixture.componentInstance;
    channelService = TestBed.get(ChannelService);
    formService = TestBed.get(FormService);
    cacheService = TestBed.get(CacheService);
    userService = TestBed.get(UserService);
    publicDataService = TestBed.get(PublicDataService);
    orgDetailsService = TestBed.get(OrgDetailsService);
    toasterService = TestBed.get(ToasterService);
    router = TestBed.get(Router);
    makeChannelReadSuc = true, makeFrameworkReadSuc = true, makeFormReadSuc  = true, makeCustOrgSuc = true, makeCustOrgFrameWorkSuc = true;
    mockFormFields = [], mockCustodianOrg = '', mockFrameworkCategories = [], mockHashTagId = '', mockFrameworkId = '',
    mockCustOrgFrameWorks = [];
    spyOn(publicDataService, 'get').and.callFake((options) => {
      if (options.url === 'channel/v1/read/' + mockHashTagId && makeChannelReadSuc) {
        return of({result: {channel: {defaultFramework: mockFrameworkId}}});
      } else if (options.url === 'framework/v1/read/' + mockFrameworkId && makeFrameworkReadSuc) {
        return of({result: {framework: {code: mockFrameworkId, categories: mockFrameworkCategories}}});
      }
      return throwError({});
    });
    spyOn(publicDataService, 'post').and.callFake((options) => {
      if (makeFormReadSuc) {
        return of({result: {form: {data: {fields: mockFormFields}}}});
      }
      return throwError({});
    });
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake((options) => {
      if (makeCustOrgSuc) {
        return of({result: {response: {value: mockCustodianOrg}}});
      }
      return throwError({});
    });
    spyOn(channelService, 'getFrameWork').and.callFake((options) => {
      if (makeCustOrgFrameWorkSuc) {
        return of({result: {channel: {frameworks: mockCustOrgFrameWorks}}});
      }
      return throwError({});
    });
    spyOn(toasterService, 'warning').and.callFake(() => {});
  });
  it('should throw warning and navigate to resource if not in edit mode and fetching custodian org details fails', () => {
    makeCustOrgSuc = false;
    component.ngOnInit();
    expect(toasterService.warning).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/resources']);
  });
  it('should throw warning and should not navigate to resource if in edit mode and fetching custodian org details fails', () => {
    makeCustOrgSuc = false;
    component.formInput = {board: ['NCRT']};
    component.ngOnInit();
    expect(toasterService.warning).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalledWith(['/resources']);
  });
  it('should fetch default framework, then form and finally init dropDowns if user not belong to custodian org', () => {
    userService._userProfile = { rootOrg: { rootOrgId: '321'} };
    userService._hashTagId = '321';
    mockHashTagId = '321';
    mockCustodianOrg = '123';
    mockFrameworkId = 'NCF';
    mockFrameworkCategories = Response.categories1;
    mockFormFields = Response.formFields1;
    component.ngOnInit();
    expect(component.formFieldOptions.length).toBeGreaterThan(1);
    expect(component.formFieldOptions[0].range.length).toBeGreaterThan(1);
    expect(component.formFieldOptions[1].range.length).toEqual(0);
    expect(component.formFieldOptions[2].range.length).toEqual(0);
    expect(component.formFieldOptions[3].range.length).toEqual(0);
    expect(toasterService.warning).not.toHaveBeenCalled();
  });
  it('should fetch default framework, then form and finally init dropDowns if user not belong to custodian org', () => {
    userService._userProfile = { rootOrg: { rootOrgId: '123'} }; // userProfile.rootOrg.rootOrgId
    userService._hashTagId = '321';
    mockHashTagId = '321';
    mockCustodianOrg = '123';
    mockFrameworkId = 'NCF';
    mockFrameworkCategories = Response.categories1;
    mockFormFields = Response.formFields1;
    mockCustOrgFrameWorks = Response.custOrgFrameworks1;
    component.ngOnInit();
    expect(component.formFieldOptions.length).toBeGreaterThan(1);
    expect(component.formFieldOptions[0].range.length).toBeGreaterThan(1);
    expect(component.formFieldOptions[1].range).toBeUndefined();
    expect(component.formFieldOptions[2].range).toBeUndefined();
    expect(component.formFieldOptions[3].range).toBeUndefined();
    expect(toasterService.warning).not.toHaveBeenCalled();
  });

  it('should set the editMode to true if profile framework is launched from the profile page', () => {
    component.formInput = {
      gradeLevel: ['Class 2'],
      medium: ['English'],
      subject: []
    };
    component.ngOnInit();
    expect(component['editMode']).toBeDefined();
    expect(component['editMode']).toBeTruthy();
  });

  it('should set the editMode to false if profile framework is launched for a new user', () => {
    component.formInput = {};
    component.ngOnInit();
    expect(component['editMode']).toBeDefined();
    expect(component['editMode']).toBeFalsy();
  });

  describe('enable/disable submit button based on required fields in form API', () => {

    beforeEach(() => {
      component['_formFieldProperties'] = Response.formWithoutBoard;
    });

    it('should enable submit button if board value is not there in framework' , () => {
      component.selectedOption = {
        gradeLevel: ['Class 2'],
        medium: ['English'],
        subject: []
      };
      component['enableSubmitButton']();
      expect(component.showButton).toBeTruthy();
    });
    it('should disable submit button if any of board, medium or gradeLevel is not present', () => {
      component.selectedOption = {
        gradeLevel: ['Class 1'],
        medium: ['English'],
        subject: ['Hindi'],
        board: []
      };
      component['enableSubmitButton']();
      expect(component.showButton).toBeFalsy();
    });
    it('should submit board value in form as null when board value is not present in the framework', () => {
      const selectedOptions = {
        gradeLevel: ['Class 1'],
        medium: ['English'],
        subject: ['Hindi']
      };
      component.selectedOption = selectedOptions;
      component['frameWorkId'] = 'NCFCOPY2';
      const submitEventEmitter = spyOn(component.submit, 'emit');
      component.onSubmitForm();
      expect(submitEventEmitter).toHaveBeenCalledWith({...selectedOptions, ...{board: [], id: 'NCFCOPY2' }});
    });
  });
});

