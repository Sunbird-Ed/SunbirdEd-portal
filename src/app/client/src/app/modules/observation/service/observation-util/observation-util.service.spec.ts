import { async, fakeAsync, TestBed } from "@angular/core/testing";
import { ObservationUtilService } from "./observation-util.service";
import { UserService, KendraService } from "@sunbird/core";
import { ModalConfig, ModalControls, SuiModal, SuiModalModule, SuiModalService } from "ng2-semantic-ui";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { configureTestSuite } from "@sunbird/test-util";
import { ConfigService, ResourceService, IUserData } from "@sunbird/shared";
import { CacheService } from "ng2-cache-service";
import { APP_BASE_HREF } from "@angular/common";
import { Router } from "@angular/router";
import {
  ResponseData,
  EntityResponse,
  ProfileDataList,
  metaData,
} from "./observation-util.service.spec.data";
import {
  of as observableOf,
  throwError as observableThrowError,
  Observable,
  of,
  observable,
} from "rxjs";

describe("ObservationUtilService", () => {
  let baseHref, kendraService, userService,modalService;
  let service: ObservationUtilService;
  let requiredFields, data, allFieldsPresent, originalTimeout;
  let mockModalRef: SuiModalService;
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
    modalService=TestBed.get(SuiModalService);
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should run #getProfileData() not null", async () => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: "deo",
          type: "administrator",
        },
      },
    });
    spyOn(service, "getProfileData").and.callThrough();
    service.getProfileData();
  });
  

  it("should run #getProfileData() null", async () => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: null,
          type: "administrator",
        },
      },
    });
    spyOn(service, "getProfileData").and.callThrough();
    service.getProfileData();
  });

  it("it should capture any error in getProfileData", () => {
    userService.userData$ = observableThrowError({});
    service.getProfileData();
  });

  it("should run #getProfileDataList()", async () => {
    service.getProfileDataList();

    let mySpy = spyOn(service, "getProfileDataList").and.callFake(() => {
      return Promise.resolve({
        result: ProfileDataList,
      }).catch((error)=>{
        return Promise.reject({
          result:false
        });
      });
    });
    service.dataParam = ProfileDataList;
    expect(mySpy).toBeDefined();
  });

  it("should run #getProfileInfo() success", fakeAsync(() => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: "deo",
          type: "administrator",
        },
      },
    });
    service.getProfileData();
    service.dataParam = ProfileDataList;
    spyOn(service, "getProfileDataList").and.callFake(() => {
      return Promise.resolve({
        result: ProfileDataList,
      });
    });
    service.getProfileDataList();
    let mySpy = spyOn(kendraService, "get").and.returnValue(of(EntityResponse));
    service.requiredFields = EntityResponse;
    service.getMandatoryEntities();
    expect(mySpy).toBeDefined();
    expect(KendraService).toBeDefined();
    expect(kendraService).toBeTruthy();
    service.getProfileInfo();
  }));

  it("should run #getProfileInfo() failed", fakeAsync(() => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: "deo",
          type: "administrator",
        },
      },
    });
    spyOn(service, "getProfileData").and.callFake(() => Promise.resolve(false));
    service.getProfileData();
    service.dataParam = ProfileDataList;
    spyOn(service, "getProfileDataList").and.callFake(() => {
      return Promise.resolve({
        result: ProfileDataList,
      });
    });
    service.getProfileDataList();
    EntityResponse.result = ["test"];
    let mySpy = spyOn(kendraService, "get").and.returnValue(of(EntityResponse));
    service.getMandatoryEntities();
    expect(mySpy).toBeDefined();
    expect(KendraService).toBeDefined();
    expect(kendraService).toBeTruthy();
    service.getProfileInfo();
  }));

  it("should run #getProfileInfo() no entity", fakeAsync(() => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: "deo",
          type: "administrator",
        },
      },
    });
    spyOn(service, "getProfileData").and.callFake(() => Promise.resolve(false));
    service.getProfileData();
    service.dataParam = ProfileDataList;
    spyOn(service, "getProfileDataList").and.callFake(() => {
      return Promise.resolve({
        result: ProfileDataList,
      });
    });
    service.getProfileDataList();
    EntityResponse.result = [];
    let mySpy = spyOn(kendraService, "get").and.returnValue(of(EntityResponse));
    service.getMandatoryEntities();
    expect(mySpy).toBeDefined();
    expect(KendraService).toBeDefined();
    expect(kendraService).toBeTruthy();
    service.getProfileInfo();
  }));


  it("should run #getProfileInfo() throw error", fakeAsync(() => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: "deo",
          type: "administrator",
        },
      },
    });
    spyOn(service, "getProfileData").and.callFake(() => Promise.resolve(false));
    service.getProfileData();
    service.dataParam = ProfileDataList;
    spyOn(service, "getProfileDataList").and.callFake(() => {
      return Promise.resolve({
        result: ProfileDataList,
      });
    });
    service.getProfileDataList();
    let mySpy = spyOn(kendraService, "get").and.returnValue(observableThrowError({}));
    service.getMandatoryEntities();
    expect(mySpy).toBeDefined();
    expect(KendraService).toBeDefined();
    expect(kendraService).toBeTruthy();
    service.getProfileInfo();
  }));

  it("should run #getProfileDataList()", async () => {
    spyOn(service, "getProfileDataList").and.returnValue(observableThrowError({}));
    service.getProfileDataList();
  });

  it("should run #showPopupAlert()", async () => {
    let mySpy = spyOn(modalService, "open").and.callFake(()=>{
      return Promise.resolve(true);
    })
    service.showPopupAlert(metaData);
    expect(mySpy).toBeDefined();
  });

  it("should call the getAlertMetaData", () => {
    service.getAlertMetaData();
  });
});
