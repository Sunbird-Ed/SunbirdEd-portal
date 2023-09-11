import { ConfigService,ResourceService,ToasterService,LayoutService} from "@sunbird/shared";
import { ObservationDetailsComponent } from "./observation-details.component";
import { ObservationService, ObservationUtilService } from '@sunbird/core';
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs/internal/observable/of";
import { Location } from '@angular/common';
import { readSolutionResult } from './Observation-details.component.mock.data'

describe("Observation Details", () => {
  let component: ObservationDetailsComponent;
  let toasterService: ToasterService;
  let configService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        OBSERVATION_PREFIX: "/assessment/",
        OBSERVATION: {
          READ_PROGRAM: "users/mlcore/v1/solutions/abcd1234",
        },
      },
    },
  };
  const observationService: Partial<ObservationService> = {
    post: jest.fn() as any
  };
  let observationUtilService: Partial<ObservationUtilService>;
  const router: Partial<Router> = {};
  const activatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({}),
  };
  const layoutService: Partial<LayoutService> = {
    initlayoutConfig: jest.fn() as any,
    switchableLayout: jest.fn() as any,
  };
  let resourceService: Partial<ResourceService> = {
    frmelmnts: {
      lbl: {
        edit: "Edit",
        delete: "Delete",
      },
    },
  };
  const location: Partial<Location> = {};

  beforeAll(() => {
    component = new ObservationDetailsComponent(
      observationService as ObservationService,
      configService as ConfigService,
      router as Router,
      activatedRoute as ActivatedRoute,
      resourceService as ResourceService,
      observationUtilService as ObservationUtilService,
      layoutService as LayoutService,
      location as Location,
      toasterService as ToasterService
    );
  });

  beforeEach(() => {
    component.programJoined = false;
    jest.clearAllMocks();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should return the correct params using getAPIParams method", () => {
    const url = "http://example.com";
    const payload = { school: "school", id: 1 };
    const expectedParams = { url, data: { id: 1 } };
    const result = component.getAPIParams(url, payload);
    expect(result).toEqual(expectedParams);
  });

  it("should set the programJoined and requestForPIIConsent properties on success", () => {
    component.requestForPIIConsent = true;
    const url = "users/mlcore/v1/solutions/abcd1234";
    const params = { url, data: { id: 1 } };
    jest.spyOn(component, "getAPIParams").mockReturnValue(params);
    jest.spyOn(component, "postAPI").mockReturnValue(of(readSolutionResult));
    jest.spyOn(component, "readProgram");
    component.readProgram();
    expect(component.readProgram).toHaveBeenCalled();
    expect(component.programJoined).toBe(true);
    expect(component.requestForPIIConsent).toBe(true);
  });

  it("should call join program api", () => {
    const url = "programs/mlcore/v1/join/abcd1234";
    const params = { url, data: { id: 1 } };
    jest.spyOn(component, "getAPIParams").mockReturnValue(params);
    const result = {
      id: "api.user.consent.read",
      ver: "v1",
      ts: "2023-05-08 06:30:12:754+0000",
      params: {
        resmsgid: "f3f649209de66dc33e8e0dc22b1c759e",
        msgid: "f3f649209de66dc33e8e0dc22b1c759e",
        err: null,
        status: "SUCCESS",
        errmsg: null,
      },
      responseCode: "OK",
      result: {},
    };
    jest.spyOn(component, "postAPI").mockReturnValue(of(result));
    jest.spyOn(component, "joinProgram");
    component.joinProgram();
    expect(component.joinProgram).toHaveBeenCalled();
    expect(component.programJoined).toBe(true);
    expect(component.openConsentPopUp).toBe(true);
    expect(component.joinProgramLoader).toBe(false);
    expect(component.joinProgramPopUp).toBe(false);
  });

  it("should call postAPI method", () => {
    jest.spyOn(observationService,'post').mockReturnValue(of(readSolutionResult));
    jest.spyOn(component,'postAPI');
    const url = "users/mlcore/v1/solutions/abcd1234";
    const data =  {
      school: "school",
      district : "2f76dcf5-e43b-xxxx-xxxx-cxxxxe1fce03",
      block : "8df55ad6-7b21-xxxx-a93a-xxxx45d34857",
      state : "bc75cc99-9205-xxxx-a722-53xxxx7838f8",
      role: "DEO"
    };
    component.postAPI({url,data:data});
    expect(component.postAPI).toHaveBeenCalled();    
  });

  it("should call postAPI method with catchError", () => {
    jest.spyOn(observationService,'post').mockReturnValue(of(null));
    jest.spyOn(component,'postAPI');
    const url = "users/mlcore/v1/solutions/abcd1234";
    const data =  {
      school: "school",
      district : "2f76dcf5-e43b-xxxx-xxxx-cxxxxe1fce03",
      block : "8df55ad6-7b21-xxxx-a93a-xxxx45d34857",
      state : "bc75cc99-9205-xxxx-a722-53xxxx7838f8",
      role: "DEO"
    };
    component.postAPI({url,data:data});
    expect(component.postAPI).toHaveBeenCalled();    
    expect(component.programJoined).toBe(false);
  });

  it("should call checkConsent method when consent is given",()=> {
    jest.spyOn(component,'checkConsent');
    component.checkConsent({consent:true});
    expect(component.consentUpdated).toBe(true);
    expect(component.openConsentPopUp).toBe(true);
    expect(component.checkConsent).toHaveBeenCalled();
  });

  it("should call checkConsent method when consent is not given",()=> {
    jest.spyOn(component,'checkConsent');
    component.checkConsent({consent:false});
    expect(component.consentUpdated).toBe(false);
    expect(component.openConsentPopUp).toBe(false);
    expect(component.checkConsent).toHaveBeenCalled();
  });

  it("should call isConsentUpdated method", () => {
    jest.spyOn(component,'isConsentUpdated');
    component.consentUpdated = true;
    component.requestForPIIConsent = true;
    component.isConsentUpdated();
    expect(component.isConsentUpdated).toHaveBeenCalled();
    expect(component.isConsentUpdated).toReturnWith(true);
  });

  it("should call isConsentUpdated method when consent is not shared", () => {
    jest.spyOn(component,'isConsentUpdated');
    component.consentUpdated = false;
    component.requestForPIIConsent = true;
    component.isConsentUpdated();
    expect(component.isConsentUpdated).toHaveBeenCalled();
    expect(component.isConsentUpdated).toReturnWith(false);
  });

  it("should call addEntity", () => {
    jest.spyOn(component,'addEntity');
    jest.spyOn(component,'isConsentUpdated').mockReturnValue(false);
    component.addEntity();
    expect(component.addEntity).toHaveBeenCalled();
  });

  it("should call redirectToQuestions", () => {
    jest.spyOn(component,'redirectToQuestions');
    jest.spyOn(component,'isConsentUpdated').mockReturnValue(false);
    component.redirectToQuestions(true);
    expect(component.redirectToQuestions).toHaveBeenCalled();
  });

  it("should call observeAgainConfirm", () => {
    jest.spyOn(component,'observeAgainConfirm');
    jest.spyOn(component,'isConsentUpdated').mockReturnValue(false);
    component.observeAgainConfirm();
    expect(component.observeAgainConfirm).toHaveBeenCalled();
  });
});
