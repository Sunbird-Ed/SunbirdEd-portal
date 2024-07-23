import { mockData } from './../../../../app.component.spec.data';
import { ConfigService,ResourceService,ToasterService,LayoutService} from "@sunbird/shared";
import { ObservationDetailsComponent } from "./observation-details.component";
import { ObservationService, ObservationUtilService } from '@sunbird/core';
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs/internal/observable/of";
import { Location } from '@angular/common';
import { readSolutionResult } from './Observation-details.component.mock.data'
import { throwError } from "rxjs";

describe("Observation Details", () => {
  let component: ObservationDetailsComponent;
  let toasterService:  Partial<ToasterService> = {
    error: jest.fn(),
  };
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
    post: jest.fn(),
    delete: jest.fn()
  };
  const observationUtilService: Partial<ObservationUtilService> = {
    getAlertMetaData: jest.fn(),
    showPopupAlert: jest.fn(),
    getProfileDataList: jest.fn(),
  };
  const router: Partial<Router> = {
    navigate: jest.fn(),
  };
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
        allReadyNotApplicable: 'mock-ready-not-applicable',
        allReadyNotApplicableTitle: 'mock-ready-applicable-title',
        notApplicable: 'mock-not-applicable',
        notApplicableRemark: 'mock-not-applicable-remark',
        instanceName: 'mock-instance',
        privacyPolicy: 'mock-privacy',
        programConsent: 'mock-consent',
        createObserveAgain: 'mock-observe',
        deleteSubmission: 'mock-delete-submit'
      },
      btn:{
        goBack: 'mock-goBack',
        save: 'mock-save',
        cancel: 'mock-cancel',
        update: 'mock-update',
        observeAgain: 'mock-observe-again',
        yes: 'mock-yes',
        no: 'mock-no',
        delete: 'mock-delete',
      }
    },
  };
  const location: Partial<Location> = {
    back: jest.fn(),
  };

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

  
  describe('actionOnSubmission',() =>{
    it('should call editSubmission on actionOnSubmission when the event action is edit',() =>{
      const mockEvent = {
        action: 'edit',
        data: 'mock-data',
      }
      const editSpy =jest.spyOn(component as any,'openEditSubmission' as any).mockReturnValue(of({}));
      component.actionOnSubmission(mockEvent);

      expect(editSpy).toHaveBeenCalledWith(mockEvent.data);
    });

    it('should call eleteSubmission on actionOnSubmission ',() =>{
      const mockEvent = {
        action: 'delete',
        data: 'mock-data',
      }
      const deleteSpy =jest.spyOn(component as any,'deleteSubmission' as any).mockReturnValue(of({}));
      component.actionOnSubmission(mockEvent);

      expect(deleteSpy).toHaveBeenCalledWith(mockEvent.data);
    });
  });
  
  it('should call actionOnSubmission method on dropDownAction',() =>{
    const mockData = {
      action: 'delete',
      data: 'mock-data'
    }
    jest.spyOn(component as any,'actionOnSubmission' as any)
    component.dropDownAction('mock-data', 'delete');
    
    expect(component.actionOnSubmission).toHaveBeenCalledWith(mockData);
  });
  
  it('should set values and call methods on markEcmNotApplicableRemark',() =>{
    const mockEvent = { 
          notApplicable: true , 
          submissionId: 'mock-submission-id',
          code: 'mock-code',
    }
    const mockMetaData ={ 
      content:{
        body: {
          data: 'mock-data',
          type: 'mock-type'
        },
        title: 'mock-title',
      },
      size: 'small',
      footer:{
        buttons: [],
        className: 'double-btn',
      },
    }
    jest.spyOn(component.observationUtilService as any,'getAlertMetaData' as any).mockReturnValue(mockMetaData);
    component.markEcmNotApplicableRemark(mockEvent);

    expect(component.observationUtilService.getAlertMetaData).toHaveBeenCalled();
    expect(component.observationUtilService.showPopupAlert).toHaveBeenCalledWith(
      {
        "content": {"body": {"data": "mock-ready-not-applicable", "type": "text"}, 
        "title": "mock-ready-applicable-title"}, "footer": {"buttons": 
        [{"buttonText": "Go back", "returnValue": false, "type": "cancel"}], 
        "className": "double-btn"}, "size": "small"
      }, '350px'
    );
    expect(component.openEditModal.show).toBeTruthy;
    expect(component.openEditModal.data).toBeNull;
  });
  

  it('should mark evidence as not applicable and update submission status', () => {
    const event = {
      returnParams: {
        submissionId: 'submissionId',
        code: 'code'
      },
      data: 'remarks'
    };
   jest.spyOn(component['observationService'] as any,'post' as any).mockReturnValue(of({}));
    component.markEcmNotApplicable(event);

    expect(component.observationUtilService.getProfileDataList).toHaveBeenCalled();
  });
  
  describe('closeEditModal',() =>{
    it('should return when there is no data on event',() =>{
       const mockEvent ={data: false}
       const result = component.closeEditModal(mockEvent);

       expect(component.openEditModal.show).toBeFalsy;
       expect(result).toBeUndefined;
    }); 

    it('should call updateSubmission method when the event action is submissionTitleUpdate',() =>{
       const mockEvent ={data: 'mock-data', action: 'submissionTitleUpdate',returnParams:{submissionId: 'mock-id'}}
       component.payload = { title: 'mock-title'};
       jest.spyOn(component as any,'updateSubmission' as any)
       component.closeEditModal(mockEvent);

       expect(component.updateSubmission).toHaveBeenCalledWith(mockEvent);
    }); 
    
    it('should call markEcmNotApplicable method when the event action is markEcmNotApplicable',() =>{
      const mockEvent ={data: 'mock-data', action: 'markEcmNotApplicable', returnParams:{code: 'mock-code'}}
      jest.spyOn(component as any,'markEcmNotApplicable' as any)
      component.closeEditModal(mockEvent);

      expect(component.markEcmNotApplicable).toHaveBeenCalledWith(mockEvent);
   }); 
  });

  it('should set values on openEditSubmission',() =>{
    const mockEvent = { title: 'mock-title', _id: 'mock-id'}
    component.openEditSubmission(mockEvent);

    expect(component.openEditModal.data).toBeNull;
    expect(component.openEditModal.show).toBeTruthy;
  });

  describe('updateSubmission',() => {
    it('should set showloader and call getEntities method on updateSubmission',() =>{
      const mockEvent = { data: 'mock-data', returnParams:{submissionId: 'mock-id'}};
      const mockData = {data: 'mock-data'};
      jest.spyOn(component['observationService'] as any,'post' as any).mockReturnValue(of(mockData));
      const entitiesSpy =  jest.spyOn(component,'getEntities')
      component.updateSubmission(mockEvent);

      expect(component.showLoader).toBeFalsy;
      expect(component.payload.title).toEqual(mockEvent.data);
      expect(component['observationService'].post).toHaveBeenCalled();
      expect(entitiesSpy).toHaveBeenCalled();
    });

    it('should set showloader to be false when error is thrown',() =>{
      const mockEvent = { data: 'mock-data', returnParams:{submissionId: 'mock-id'}};
      const mockData = {data: 'mock-data'};
      jest.spyOn(component['observationService'] as any,'post' as any).mockReturnValue(of(mockData));
      jest.spyOn(component['observationService'], 'post').mockReturnValue(throwError({ error: 'mock-error' }));
      component.updateSubmission(mockEvent);

      expect(component.showLoader).toBeFalsy;
    });
  });
  
  it('should set submissionNumber and call redirectToQuestions on open method',() =>{
    const mocksb = 1;
    const data = { data: 'mock-data',submissionNumber: 0 }
    component.open(mocksb, data);
    
    expect(data.submissionNumber).toEqual(1);
    expect(component.redirectToQuestions).toHaveBeenCalledWith(data);
  });
   
  it('should call router navigate on redirectToQuestions',() =>{
    component.observationId = 'mock-observe-id';
    component.selectedEntity = { _id: 'mock-id' }
    const mockEvidence = { submissionNumber: 1 , code: 'mock-code'}
    jest.spyOn(component,'isConsentUpdated').mockReturnValue(true)
    component.redirectToQuestions(mockEvidence)

    expect(component['router'].navigate).toHaveBeenCalled();
  });
  
  it('should call back method of location on goBack',() =>{
    component.goBack();
    expect(component['location'].back).toHaveBeenCalled();
  });
  
  it('should set values and call methods on modalClose',() =>{
    component.modalClose();

    expect(component.showDownloadModal).toBeFalsy;
    expect(component.getEntities).toHaveBeenCalled();
  });
  
  it('should set values and call methods on changeEntity',() =>{
    const mockEvent = { event: 'mock-event'};
    jest.spyOn(component,'getObservationForm');
    component.changeEntity(mockEvent);

    expect(component.selectedEntity).toEqual(mockEvent);
    expect(component.getObservationForm).toHaveBeenCalled();
  });

  it('should set showDownloadModal to true on addEntity',() =>{
     jest.spyOn(component,'isConsentUpdated').mockReturnValue(true);
     component.addEntity();

     expect(component.showDownloadModal).toBeTruthy;
  });
  
  describe(' actionOnEntity',() =>{
    it('should call delete method when the event action is delete',() =>{
       const mockEvent = { action: 'delete', data: 'mock-data'};
       jest.spyOn(component,'delete');
       component.actionOnEntity(mockEvent);

       expect(component.delete).toHaveBeenCalledWith(mockEvent.data);
    });

    it('should call changeEntity method when the event action is change',() =>{
      const mockEvent = { action: 'change', data: 'mock-data'};
      jest.spyOn(component,'changeEntity');
      component.actionOnEntity(mockEvent);

      expect(component.changeEntity).toHaveBeenCalledWith(mockEvent.data);
   });
  });
  
  it('should call methods and set values on getProfileData',() =>{
    const mockData = { title: 'mock-data' };
    jest.spyOn(component.observationUtilService as any,'getProfileDataList' as any).mockResolvedValue(of(mockData));
    window.scroll = jest.fn() as any;
    component.getProfileData();
    
    expect(component.payload).toEqual(mockData);
    expect(window.scroll).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('should set values and call methods on checkConsent',() =>{
    const mockEvent = { consent: 'mock-consent' };
    component.checkConsent(mockEvent);

    expect(component.consentUpdated).toEqual(mockEvent.consent);
    expect(component.openConsentPopUp).toBeFalsy;
    expect(component.joinProgram).toHaveBeenCalled();
  });
  
  it('should call methods on ngOnInit',() =>{
    const profileSpy = jest.spyOn(component,'getProfileData')
    jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({layout: 'mock-layout'}));
    component.ngOnInit();

    expect(component.layoutService.initlayoutConfig).toHaveBeenCalled();
    expect(profileSpy).toHaveBeenCalled();
    expect(component.consentConfig).toEqual(
      {"tncLink": "mock-privacy", "tncText": "mock-consent"}
    );
    expect(component.layoutService.switchableLayout).toHaveBeenCalled();
    expect(component.layoutConfiguration).toEqual('mock-layout');
  });
  
  it('should call methods and set values on observeAgainConfirm',async() =>{
    jest.spyOn(component,'isConsentUpdated').mockReturnValue(true);
    const metadata = { 
      content:{
        title: 'mock-title',
         body:{
            data: 'mock-data',
            type: 'mock-type',
         },
      },
      size: 'mock-size',
      footer:{
        buttons: [],
        className: 'mock-class'
      }
    }
    jest.spyOn(component.observationUtilService as any,'getAlertMetaData' as any).mockReturnValue(metadata);
    await component.observeAgainConfirm();

    expect(component.observationUtilService.getAlertMetaData).toHaveBeenCalled();
    expect(component.observationUtilService.showPopupAlert).toHaveBeenCalledWith(metadata,'250px');
  });

  it('should call methods and set values on deleteSubmission',async() =>{
    const mockEvent = {name: 'mock-event'};
    const mockData = { data: 'mock-data'};
    const metadata = { 
      content:{
        title: 'mock-title',
         body:{
            data: 'mock-data',
            type: 'mock-type',
         },
      },
      size: 'mock-size',
      footer:{
        buttons: [],
        className: 'mock-class'
      }
    }
    jest.spyOn(component.observationUtilService as any,'getAlertMetaData' as any).mockReturnValue(metadata);
    jest.spyOn(component.observationUtilService as any,'showPopupAlert' as any).mockReturnValue(mockData);
    await component.deleteSubmission(mockEvent);
    
    expect(component.deleteSubmission).toHaveBeenCalled();
  });

  describe(' observeAgain',() =>{
    it('should set values and call methods on observeAgain when data is returned',() =>{
      jest.spyOn(component['observationService'] as any, 'post' as any).mockReturnValue(of({}));
      component.observeAgain();

      expect(component['observationService'].post).toHaveBeenCalled();
      expect(component.showLoader).toBeFalsy();
    });

    it('should set values on observeAgain when data is not returned',() =>{
      jest.spyOn(component['observationService'], 'post').mockReturnValue(throwError({ error: 'mock-error' }));
      component.observeAgain();

      expect(component['observationService'].post).toHaveBeenCalled();
      expect(component.showLoader).toBeFalsy();
    });
  });
  
  describe('delete',() =>{ 
    it('should call methods and set values on delete when data is returned',async() =>{
      const mockEntity = { data: 'mock-data', _id: 'mock-id'};
      component.payload = { data: 'mock-data' };
      component.selectedEntity = { _id: 'mock-id'};
      jest.spyOn(component['observationService'] as any,'delete').mockReturnValue(of({}));
      await component.delete(mockEntity);

      expect(component.observationUtilService.getAlertMetaData).toHaveBeenCalled();
      expect(component.observationUtilService.showPopupAlert).toHaveBeenCalled();
      expect(component.showLoader).toBeTruthy;
      expect(component.payload.data).toEqual(["mock-id"]);
      expect(component.selectedEntity).toEqual({});
      expect(component['observationService'].delete).toHaveBeenCalled();
      expect(component.getEntities).toHaveBeenCalled();
    });
    
    it('should set values on delete when data is not returned',async() =>{
      const mockEntity = { data: 'mock-data', _id: 'mock-id'};
      component.payload = { data: 'mock-data' };
      component.selectedEntity = { _id: 'mock-id'};
      jest.spyOn(component['observationService'] as any,'delete').mockReturnValue(throwError({ error: 'mock-error' }));
      await component.delete(mockEntity);

      expect(component.showLoader).toBeFalsy;
    });
  });

  it('should set values on openEditSubmission',() => {
    const mockEvent ={ title: 'mock-title', _id: 'mock-id' }
    component.openEditModal = { data: 'mock-data' } as any;
    component.openEditSubmission(mockEvent);
    
    expect(component.openEditModal.data).toEqual('mock-data');
    expect(component.openEditModal.show).toBeTruthy;
  });
  
  describe('getObservationForm',() =>{
    it('should set values and call methods on getObservationForm when data is received',() =>{
      const mockData = { result: 'mock-result'}
      jest.spyOn(component['observationService'] as any, 'post' as any).mockReturnValue(of(mockData));
      component.entities = { allowMultipleAssessemts: false };
      jest.spyOn(component as any, 'observeAgain');
      component.getObservationForm();

      expect(component['observationService'].post).toHaveBeenCalled();
      expect(component.showLoader).toBeFalsy;
      expect(component.submissions).toEqual(mockData.result);
    });

    it('should set values and call methods on getObservationForm when data is not received',() =>{
      jest.spyOn(component['observationService'] as any, 'post' as any).mockReturnValue(throwError({ error: 'mock-error' }));
      component.getObservationForm();
      
      expect(component.showLoader).toBeFalsy;
    });
  });
  
  describe('getEntities',() => { 
    it('should set values and call methods on getEntities when data is received',() => {
      const mockData = { 
        result: {
          license: 'mock-result',
        }
      };
      component.entities = { _id: 'mock-id' }
      jest.spyOn(component['observationService'] as any, 'post' as any).mockReturnValue(of(mockData));
      component.getEntities();
      
      expect(component['observationService'].post).toHaveBeenCalled();
      expect(component.showLoader).toBeFalsy;
      expect(component.disableAddEntity).toBeFalsy;
      expect(component.entities).toEqual(mockData.result);
      expect(component.observationId).toEqual(component.entities._id);
      expect(component.getObservationForm).toHaveBeenCalled();
      expect(component.courseHierarchy).toEqual('mock-result');
    });

    it('should set values and call methods on getEntities when data is not received',() => {
      jest.spyOn(component['observationService'] as any, 'post' as any).mockReturnValue(throwError({ error: 'mock-error' }));
      component.getEntities();

      expect(component.toasterService.error).toHaveBeenCalled();
      expect(component.showLoader).toBeFalsy;
    });
  });
});
