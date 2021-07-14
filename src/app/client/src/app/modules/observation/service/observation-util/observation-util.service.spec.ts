import { async, fakeAsync, TestBed } from '@angular/core/testing';
import { ObservationUtilService } from './observation-util.service';
import { UserService, KendraService } from '@sunbird/core';
import {
  ModalConfig,
  ModalControls,
  SuiModal,
  SuiModalModule,
  SuiModalService,
} from 'ng2-semantic-ui-v9';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { ConfigService, ResourceService, IUserData } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { APP_BASE_HREF } from '@angular/common';
import { Router } from '@angular/router';
import {
  ResponseData,
  EntityResponse,
  ProfileDataList,
  metaData,
} from './observation-util.service.spec.data';
import {
  of as observableOf,
  throwError as observableThrowError,
  Observable,
  of,
  observable,
} from 'rxjs';

describe('ObservationUtilService', () => {
  let baseHref, kendraService, userService, modalService;
  let service: ObservationUtilService;
  let requiredFields, data, allFieldsPresent, originalTimeout;
  let mockModalRef: SuiModalService;

  const fakeModalService = {
    approve: () => true,
    context: data,
  };
  configureTestSuite();
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        UserService,
        KendraService,
        ConfigService,
        CacheService,
        { provide: APP_BASE_HREF, useValue: baseHref },
        { provide: Router },
        { provide: ResourceService },
      ],
      imports: [HttpClientTestingModule, SuiModalModule],
    })
  );

  beforeEach(() => {
    service = TestBed.get(ObservationUtilService);
    userService = TestBed.get(UserService);
    kendraService = TestBed.get(KendraService);
    modalService = TestBed.get(SuiModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should run #getProfileData() not null', async (done) => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: 'deo',
          type: 'administrator',
        },
      },
    });
    spyOn(service, 'getProfileData').and.callThrough();
    const value = await service.getProfileData();
    setTimeout(() => {
      expect(service.getProfileData).toHaveBeenCalled();
      expect(value).toEqual(true);
      done();
    });
  });

  it('should run #getProfileData() null', async (done) => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: null,
          type: 'administrator',
        },
      },
    });
    spyOn(service, 'getProfileData').and.callThrough();
    const value = await service.getProfileData();
    setTimeout(() => {
      expect(service.getProfileData).toHaveBeenCalled();
      expect(value).toEqual(false);
      done();
    });
  });

  it('should run #getProfileDataList()', async () => {
    spyOn(service, 'getProfileDataList').and.returnValue(
      observableThrowError({})
    );
    service.getProfileDataList();
  });

  it('should run #getProfileInfo() success', fakeAsync(() => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: 'deo',
          type: 'administrator',
        },
      },
    });
    service.getProfileData();
    service.dataParam = ProfileDataList;
    spyOn(service, 'getProfileDataList').and.callFake(() => {
      return Promise.resolve({
        result: ProfileDataList,
      });
    });
    service.getProfileDataList();
    spyOn(kendraService, 'get').and.returnValue(of(EntityResponse));
    service.requiredFields = EntityResponse;
    service.getMandatoryEntities();
    spyOn(service, 'getProfileInfo').and.callThrough();
    service.getProfileInfo();
    expect(service.getProfileInfo).toHaveBeenCalled();
  }));

  it('should run #getProfileInfo() failed', fakeAsync(() => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: 'deo',
          type: 'administrator',
        },
      },
    });
    spyOn(service, 'getProfileData').and.callFake(() => Promise.resolve(false));
    service.getProfileData();
    service.dataParam = ProfileDataList;
    spyOn(service, 'getProfileDataList').and.callFake(() => {
      return Promise.resolve({
        result: ProfileDataList,
      });
    });
    service.getProfileDataList();
    EntityResponse.result = ['test'];
    const mySpy = spyOn(kendraService, 'get').and.returnValue(of(EntityResponse));
    service.getMandatoryEntities();
    spyOn(service, 'getProfileInfo').and.callThrough();
    service.getProfileInfo();
    expect(service.getProfileInfo).toHaveBeenCalled();
  }));

  it('should run #getProfileInfo() no entity', fakeAsync(() => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: 'deo',
          type: 'administrator',
        },
      },
    });
    spyOn(service, 'getProfileData').and.callFake(() => Promise.resolve(false));
    service.getProfileData();
    service.dataParam = ProfileDataList;
    spyOn(service, 'getProfileDataList').and.callFake(() => {
      return Promise.resolve({
        result: ProfileDataList,
      });
    });
    service.getProfileDataList();
    EntityResponse.result = [];
    const mySpy = spyOn(kendraService, 'get').and.returnValue(of(EntityResponse));
    service.getMandatoryEntities();
    spyOn(service, 'getProfileInfo').and.callThrough();
    service.getProfileInfo();
    expect(service.getProfileInfo).toHaveBeenCalled();
  }));

  it('should run #getProfileInfo() throw error', fakeAsync(() => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: 'deo',
          type: 'administrator',
        },
      },
    });
    spyOn(service, 'getProfileData').and.callFake(() =>
      Promise.resolve({ result: false })
    );
    service.getProfileData();
    service.dataParam = ProfileDataList;
    spyOn(service, 'getProfileDataList').and.callFake(() => {
      return Promise.resolve({
        result: ProfileDataList,
      });
    });
    service.getProfileDataList();
    spyOn(kendraService, 'get').and.returnValue(observableThrowError({}));
    service.getMandatoryEntities();
    spyOn(service, 'getProfileInfo').and.callThrough();
    service.getProfileInfo();
    expect(service.getProfileInfo).toHaveBeenCalled();
  }));

  it('should run #getProfileDataList on success', async () => {
    service.dataParam = observableOf({
      result: ProfileDataList,
    });
    spyOn(service, 'getProfileDataList').and.callThrough();
    service.getProfileDataList();
    expect(service.getProfileDataList).toHaveBeenCalled();
  });

  it('should run #getProfileDataList on fail', async () => {
    service.dataParam = observableThrowError({});
    spyOn(service, 'getProfileDataList').and.returnValue(Promise.reject());
    service.getProfileDataList();
    expect(service.getProfileDataList).toHaveBeenCalled();
  });

  it('should run #showPopupAlert()', async () => {
    spyOn(modalService, 'open').and.callFake(() => {
      return Promise.resolve(true);
    });

    spyOn(service, 'showPopupAlert').and.callThrough();
    service.showPopupAlert(metaData);
    expect(service.showPopupAlert).toHaveBeenCalled();
  });

  it('should call the getAlertMetaData', () => {
    service.getAlertMetaData();
  });
});
