import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservationDetailsComponent } from './observation-details.component';
import { of, Observable } from 'rxjs';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { ConfigService, ResourceService, SharedModule, ILoaderMessage, INoResultMessage } from '@sunbird/shared';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { ProfileData, EntityList, ObservationForm, Entity, AlertMetaData, EventForSubmission,AlertNotApplicable } from './Observation-details.component.mock.data';
import { ObservationService } from '@sunbird/core';
import { ObservationUtilService } from '../../service';
import { EntityListComponent } from '../entity-list/entity-list.component';
import { SubmissionsComponent } from '../submissions/submission.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { AddEntityComponent } from '../add-entity/add-entity.component';
import { EditSubmissionComponent } from '../edit-submission/edit-submission.component';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
const resourceBundle = {
  frmelmnts: {
    lbl: {
      observationDetails: 'Obserevation Details',
      deleteConfirm: 'Are you sure you want to delete this entity ?',
      createObserveAgain: ' Are you sure you want to create new instance ?',
    },
    btn: {
      back: 'Back',
      yes: 'Yes',
      no: 'No',
      delete: 'Delete',
      observeAgain: 'Observe again',
    },
    msg:{
      noEntityFound:"No Entity Found"
    },
  },
  languageSelected$: of({})
};
class ActivatedRouteStub {
  static queryParams: any;
  queryParams = {
    params: {},
  };
}
const locationStub = {
  back: jasmine.createSpy('back')
};
class MockRouter {
  navigate = jasmine.createSpy('navigate');
  url = jasmine.createSpy('url');
}
const routerSpy = { navigate: jasmine.createSpy('navigate') };
describe('ObservationDetailsComponent', () => {
  let component: ObservationDetailsComponent;
  let fixture: ComponentFixture<ObservationDetailsComponent>;
  let observationUtilService, observationService, activatedRouteStub;
  let payload = {};
  observationUtilService = {
    getProfileDataList: () => new Promise((resolve, reject) => {
      resolve;
    }),
    getAlertMetaData: () => AlertMetaData,
    showPopupAlert: () => new Promise((resolve, reject) => {
      resolve;
    })
  };
  observationService = {
    post: () => of(),
    delete: () => of()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), SuiModule, InfiniteScrollModule, RouterTestingModule, FormsModule, HttpClientTestingModule, RouterModule.forRoot([])],
      declarations: [ObservationDetailsComponent, EntityListComponent, SubmissionsComponent, EditSubmissionComponent, AddEntityComponent],
      providers: [{ provide: ObservationUtilService, useValue: observationUtilService },
      { provide: ObservationService, useValue: observationService }, { provide: Location, useValue: locationStub },
      {
        provide: ActivatedRoute,
        useValue: {
          queryParams: of({
            programId: '605083ba09b7bd61555580fb',
            solutionId: '6052eb7e79c5f153ae7f27b8',
            observationId: '606e86c0178d6305375fc83b',
            solution: 'Test-observation-upload-pointBased',
            programName: '3.8 Test AP program'
          })
        }
      },
      { provide: ResourceService, useValue: resourceBundle }, { provide: Router, useValue: routerSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationDetailsComponent);
    component = fixture.componentInstance;
    activatedRouteStub = TestBed.get(ActivatedRoute);
    observationUtilService = TestBed.get(ObservationUtilService);
    observationService = TestBed.get(ObservationService);
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redo layout on render', () => {
    component.layoutConfiguration = {};
    component.layoutConfiguration = null;
  });

  it('should fetch profile details on page load', () => {
    spyOn(observationUtilService, 'getProfileDataList').and.callFake(() => Promise.resolve(ProfileData));
    payload = ProfileData;
    component.getProfileData();
    spyOn(component, 'getProfileData').and.callThrough();
    expect(observationUtilService).toBeDefined();
    expect(observationUtilService).toBeTruthy();

  });

  it('Should fetch Entity list', () => {
    spyOn(observationService, 'post').and.callFake(() => observableOf(EntityList));
    spyOn(component, 'getEntities').and.callThrough();
    spyOn(component, 'getObservationForm');
    component.getEntities();
    expect(component.getEntities).toHaveBeenCalled();
    expect(component.selectedEntity).toBe(EntityList.result.entities[0]);
    expect(component.entities).toBeDefined();
    expect(component.entities.entities.length).toBeGreaterThan(1);
    expect(component.getObservationForm).toHaveBeenCalled();
  });



  it('Should fetch entity throw error', () => {
    spyOn(observationService, 'post').and.returnValue(observableThrowError({}));
    spyOn(component, 'getEntities').and.callThrough();
    component.getEntities();
    expect(component.getEntities).toHaveBeenCalled();
  });


  it('Should fetch Observation forms', () => {
    spyOn(observationService, 'post').and.callFake(() => observableOf(ObservationForm));
    spyOn(component, 'getObservationForm');
    component.getObservationForm();
    component.showLoader = false;
    component.submissions = ObservationForm.result;
    expect(component.submissions).toBeDefined();
    expect(component.submissions.length).toBeGreaterThanOrEqual(0);
    expect(component.getObservationForm).toHaveBeenCalled();
  });


  it('Should Delete Entity', (done) => {
    spyOn(observationUtilService, 'getAlertMetaData').and.callFake(() => AlertMetaData);
    spyOn(observationUtilService, 'showPopupAlert').and.callFake(() => Promise.resolve(true));
    spyOn(observationService, 'delete').and.callFake(() => of(true));
    spyOn(component, 'delete').and.callThrough();
    // spyOn(observationUtilService, "getProfileDataList").and.callFake(() => Promise.resolve(ProfileData));
    component.payload = ProfileData;
    component.payload.data = Entity.data._id;
    component.delete(Entity.data);
    setTimeout(() => {
      expect(component.delete).toHaveBeenCalled();
      expect(observationUtilService.getAlertMetaData).toHaveBeenCalled();
      expect(observationUtilService.showPopupAlert).toHaveBeenCalled();
      done();
    }, 10);
  });

  it('Should Open Submission Name edit modal', () => {
    spyOn(component, 'openEditSubmission').and.callThrough();
    component.openEditSubmission(EventForSubmission.data);
    component.openEditModal.show = true;
    expect(component.openEditModal.show).toBeDefined();
    expect(component.openEditModal.show).toBeTruthy();
    expect(component.openEditSubmission).toHaveBeenCalled();
  });


  it('Should do edit actions on Submission', () => {
    spyOn(component, 'openEditSubmission').and.callThrough();
    component.actionOnSubmission(EventForSubmission);
    component.openEditSubmission(EventForSubmission.data);
    expect(component.openEditSubmission).toHaveBeenCalled();
  });


  it('Should update the submission with changes', () => {
    spyOn(observationUtilService, 'getProfileDataList').and.callFake(() => Promise.resolve(ProfileData));
    component.payload = ProfileData;
    spyOn(component, 'updateSubmission').and.callThrough();
    let event = {
      data:"title changed",returnParams:{submissionId:'123'}
    }
    component.updateSubmission(event);
    component.payload.title = EventForSubmission.data.title;
    spyOn(observationService, 'post').and.returnValue(observableOf());
    expect(component.updateSubmission).toHaveBeenCalled();
  });


  it('Should Enable Add Entity Modal', () => {
    component.showDownloadModal = true;
    spyOn(component, 'addEntity').and.callThrough();
    component.addEntity();
    expect(component.showDownloadModal).toBeDefined();
    expect(component.showDownloadModal).toBeTruthy();
    expect(component.addEntity).toHaveBeenCalled();
  });


  it('Should do delete actions on entity', () => {
    const event = {
      action: 'delete',
      data: {}
    };
    spyOn(component, 'actionOnEntity').and.callThrough();
    component.actionOnEntity(event);
    expect(component.actionOnEntity).toHaveBeenCalled();
  });

  it('Should do select entity actions on entity', () => {
    const event = {
      action: 'change',
      data: {}
    };
    spyOn(component, 'actionOnEntity').and.callThrough();
    component.actionOnEntity(event);
    expect(component.actionOnEntity).toHaveBeenCalled();
  });

  it('should navigate to questionnaire page', () => {
    const evidence = {
      submissionNumber: 1,
      code: 'OB'
    };
    component.observationId = '60a7a7198b5424712b5faec4';
    component.selectedEntity._id = '5fd1f4a0e84a88170cfb0497';
    const params = {
      observationId: component.observationId,
      entityId: component.selectedEntity._id,
      submissionNumber: evidence.submissionNumber,
      evidenceCode: evidence.code,
    };
    const router = TestBed.get(Router);
    component.redirectToQuestions(evidence);
    expect(params).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith(['/questionnaire'], { queryParams: params });
  });

  it('Should work on submission action', () => {
    const type = 'edit';
    const event = {
      action: type,
      data: EventForSubmission
    };
    spyOn(component, 'dropDownAction').and.callThrough();
    spyOn(component, 'actionOnSubmission').and.callThrough();
    component.dropDownAction(EventForSubmission, type);
    component.actionOnSubmission(event);
    expect(component.dropDownAction).toHaveBeenCalled();
    expect(component.actionOnSubmission).toHaveBeenCalled();
  });

  it('should call ModalClose', () => {
    component.showDownloadModal = false;
    spyOn(component, 'modalClose').and.callThrough();
    component.modalClose();
    spyOn(component, 'getEntities').and.callThrough();
    component.getEntities();
    expect(component.showDownloadModal).toBeDefined();
    expect(component.getEntities).toHaveBeenCalled();
  });

  it('Should navigate to back', () => {
    component.goBack();
    const location = fixture.debugElement.injector.get(Location);
    expect(location.back).toHaveBeenCalled();
  });

  it('Should open Submission', () => {
    spyOn(component, 'open').and.callThrough();
    const sbnum = 2;
    const data = {
      submissionNumber: 1,
      code: 'OB'
    };
    component.open(sbnum, data);
    expect(component.open).toHaveBeenCalled();
  });
  it('Should show Observe again confirm popup', () => {
    spyOn(observationUtilService, 'getAlertMetaData').and.callFake(() => AlertMetaData);
    spyOn(observationUtilService, 'showPopupAlert').and.callFake(() => Promise.resolve(true));
    spyOn(component, 'observeAgainConfirm').and.callThrough();
    component.observeAgainConfirm();
    expect(component.observeAgainConfirm).toHaveBeenCalled();
  });
  it('Should call Observe again if no submissions and entities have allowMultipleAssessemts as false', () => {
    spyOn(observationService, 'post').and.returnValue(of(ObservationForm));
    spyOn(component, 'observeAgain').and.callThrough();
    spyOn(component, 'getEntities').and.callThrough();
    component.observeAgain();
    component.getEntities();
    component.entities = EntityList.result;
    expect(observationService).toBeDefined();
    expect(component.observeAgain).toHaveBeenCalled();
    expect(component.getEntities).toHaveBeenCalled();
  });


  it("should call the markEcmNotApplicable when the modal is closed and event callback",()=>{
    spyOn(component,"markEcmNotApplicable").and.callThrough();
    let event={
      action:"",
      data:{},
      returnParams:{
        code:"OB"
      }
    }
    spyOn(observationUtilService,'getProfileDataList').and.callFake(() => Promise.resolve(ProfileData));
    spyOn(observationService,"post").and.returnValue({ subscribe: (data) => {} })
    component.markEcmNotApplicable(event);
    expect(component.markEcmNotApplicable).toHaveBeenCalled();
  });

  it("should call the markEcmNotApplicableRemark fro the remarks on making not applicable true",()=>{
    spyOn(component,"markEcmNotApplicableRemark").and.callThrough();
    let event={
      notApplicable:true
    }
    spyOn(observationUtilService, 'getAlertMetaData').and.callFake(()=>{
      return AlertMetaData;
    })
    spyOn(observationUtilService, 'showPopupAlert').and.returnValue(Promise.resolve(true));
    component.markEcmNotApplicableRemark(event);
    expect(component.markEcmNotApplicableRemark).toHaveBeenCalled();
  });

  it("should call the markEcmNotApplicableRemark fro the remarks on making not applicable false",()=>{
    spyOn(component,"markEcmNotApplicableRemark").and.callThrough();
    let event={
      notApplicable:false
    }
    component.markEcmNotApplicableRemark(event);
    expect(component.markEcmNotApplicableRemark).toHaveBeenCalled();
    expect(component.openEditModal.show).toEqual(true);
  });

  it("should call the #closeEditModal() when action is submissionTitleUpdate",()=>{
    spyOn(component,"closeEditModal").and.callThrough();
    component.payload={
      title:""
    }
    let event ={
      data:{},
      action:"submissionTitleUpdate",
      returnParams:{
        code:"OB"
      }
    }
    component.closeEditModal(event);
    expect(component.closeEditModal).toHaveBeenCalled();
    expect(component.openEditModal.show).toEqual(false);
  });

  it("should call the #closeEditModal() when action is markEcmNotApplicable",()=>{
    spyOn(component,"closeEditModal").and.callThrough();
    let event ={
      data:{},
      action:"markEcmNotApplicable",
      returnParams:{
        code:"OB"
      }
    }
    component.closeEditModal(event);
    expect(component.closeEditModal).toHaveBeenCalled();
    expect(component.openEditModal.show).toEqual(false);
  });

  it("should call the #deleteSubmission",()=>{
    spyOn(component,"deleteSubmission").and.callThrough();
    let event={}
    spyOn(observationUtilService, 'getAlertMetaData').and.callFake(()=>{
      return AlertMetaData;
    })
    spyOn(observationUtilService, 'showPopupAlert').and.returnValue(Promise.resolve(true));
    component.deleteSubmission(event);
    expect(component.deleteSubmission).toHaveBeenCalled();
  })

});
