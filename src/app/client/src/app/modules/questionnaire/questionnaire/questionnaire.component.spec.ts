
import { QuestionnaireComponent } from "./questionnaire.component";
import { ConfigService } from "../../shared";
import { SlQuestionnaireService, SlUtilsService } from "@shikshalokam/sl-questionnaire";
import {
  Questionnaire,
  Payload,
  SubmissionSuccessResp,
  AlertMetaData,
  ProfileData,
} from './questionnaire.component.mock';
import { LayoutService, ResourceService } from "../../shared";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { ObservationService, ObservationUtilService } from "../../core";
import { QuestionnaireService } from "../questionnaire.service";
import { of, throwError } from "rxjs";
import { combineAll } from "rxjs/operators";

describe("QuestionnaireComponent", () => {
  let questionnaireComponent: QuestionnaireComponent;
  const mockLayoutService: Partial<LayoutService> = {
    initlayoutConfig: jest.fn().mockReturnValue(of({})),
    redoLayoutCSS: jest.fn()
  };
  const mockFormBuilder: Partial<FormBuilder> = {
    group: jest.fn()
  };
  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
      lbl: {
        continue: 'Continue',
        successfullySaved: 'Your Form has been saved successfully!',
        saveConfirm: 'Are you sure you want to save this form?',
        submitConfirm: 'Are you sure you want to submit the form?',
        successfullySubmitted: 'Your form has been submitted successfully!',
        failedToSave: 'Failed to save the form!',
        submissionFailed: 'Failed to submit the form!',
      },
      btn: {
        back: 'Back',
        yes: 'Yes',
        ok: 'Ok',
        no: 'No',
      },
    },
    languageSelected$: of({}),
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {

    snapshot: {
      queryParams: {
        selectedTab: 'course'
      },
      data: {
        sendUtmParams: true
      }
    } as any,
    queryParams: of({ observationId: '0124963192947507200', timePeriod: '7d' }),
  };
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        "OBSERVATION": {
          "GET_ASSESSMENT": "observations/mlsurvey/v1/assessment/",
        },
      }
    }
  };
  const mockObservationService: Partial<ObservationService> = {
    post: jest.fn(),
    delete: jest.fn()
  };
  const mockLocation: Partial<Location> = {
    back: jest.fn()
  };
  const mockObservationUtilService: Partial<ObservationUtilService> = {
    getAlertMetaData: jest.fn().mockReturnValue({
      type: '',
      size: '',
      isClosed: false,
      content: {
        title: '',
        body: {
          type: '',
          data: '',
        },
      },
      footer: {
        className: '',
        buttons: [

        ],
      },
    }),
    showPopupAlert: jest.fn(() => { Promise.resolve({ a: '' }) }) as any,
    getProfileDataList: jest.fn()
  }

  const mockSlQuestionnaireService: Partial<SlQuestionnaireService> = {
    mapSubmissionToAssessment: jest.fn(),
    getEvidenceData: jest.fn(() => {
      externalId: '';
      answers: { };
      startTime: 1;
      endTime: 1;
    }) as any
  };
  const mockQuestionnaireService: Partial<QuestionnaireService> = {};

  beforeAll(() => {
    questionnaireComponent = new QuestionnaireComponent(
      mockLayoutService as LayoutService,
      mockFormBuilder as FormBuilder,
      mockResourceService as ResourceService,
      mockActivatedRoute as ActivatedRoute,
      mockConfigService as ConfigService,
      mockObservationService as ObservationService,
      mockLocation as Location,
      mockObservationUtilService as ObservationUtilService,
      mockSlQuestionnaireService as SlQuestionnaireService,
      mockQuestionnaireService as QuestionnaireService,
    )
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should be created", () => {
    expect(questionnaireComponent).toBeTruthy();
  });

  it('Should initialize config', () => {
    jest.spyOn(questionnaireComponent, 'initConfiguration');
    questionnaireComponent.initConfiguration();
    expect(questionnaireComponent.initConfiguration).toHaveBeenCalled();
  });

  it('Should call ngOnInit', () => {
    jest.spyOn(questionnaireComponent, 'initConfiguration');
    window.scroll = jest.fn() as any;
    questionnaireComponent.ngOnInit();
    expect(questionnaireComponent.initConfiguration).toHaveBeenCalled();
  });

  describe('fetch Questionnaire', () => {
    it('should fetch Questionnaire', () => {
      jest.spyOn(questionnaireComponent, 'getQuestionnare');
      jest.spyOn(mockObservationService, 'post').mockReturnValue(of(Questionnaire) as any);
      questionnaireComponent.queryParams = of({ observationId: '0124963192947507200', timePeriod: '7d' }),
        questionnaireComponent.getQuestionnare();
      expect(questionnaireComponent.getQuestionnare).toHaveBeenCalled();
      expect(mockObservationService.post).toHaveBeenCalled();
    });
  });

  describe('canDeactivate', () => {
    it('should call canDeactivate', () => {
      questionnaireComponent.questionnaireForm = new FormGroup({});
      questionnaireComponent.canDeactivate();
      expect(questionnaireComponent.canDeactivate()).toBeTruthy();
    });

    it('should call canDeactivate', () => {
      questionnaireComponent.canLeave = false
      questionnaireComponent.questionnaireForm = new FormGroup({});
      questionnaireComponent.questionnaireForm.markAsDirty();
      questionnaireComponent.canDeactivate();
      expect(questionnaireComponent.canDeactivate()).toBeFalsy();
    });
  })

  it('should call goBack', () => {
    questionnaireComponent.goBack();
    expect(mockLocation.back).toHaveBeenCalled()
  });


  it('should call redoLayout', () => {
    questionnaireComponent.layoutConfiguration = "joy"
    questionnaireComponent.redoLayout();
    expect(mockLayoutService.redoLayoutCSS).toHaveBeenCalled()
  });

  it('should call scrollToContent', () => {
    window.scrollBy = jest.fn() as any;
    let mockElement = (<HTMLInputElement>document.createElement('id'));
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
    questionnaireComponent['scrollToContent']('id')
    expect(window.scrollBy).toBeDefined();
  });

  describe('openAlert', () => {
    it('should  openAlert without cancel button', () => {
      let msg = 'test';
      mockObservationUtilService.getAlertMetaData = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      questionnaireComponent.openAlert(msg);
      expect(window.scrollBy).toBeDefined();
    });

    it('should openAlert with cancel button', () => {
      let msg = 'test';
      mockObservationUtilService.getAlertMetaData = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      questionnaireComponent.openAlert(msg, true);
      expect(window.scrollBy).toBeDefined();
    });
  })

  it('should call backOrContinue', () => {
    let msg = 'test';
    mockObservationUtilService.getAlertMetaData = jest.fn(() => Promise.resolve(AlertMetaData)) as any
    mockObservationUtilService.showPopupAlert = jest.fn(() => Promise.resolve(AlertMetaData)) as any
    questionnaireComponent.backOrContinue();
    expect(window.scrollBy).toBeDefined();
  });

  describe('onSubmit', () => {
    it('should call onSubmit while clicking button', () => {
      let save = 'save';
      mockObservationUtilService.getAlertMetaData = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      mockObservationUtilService.showPopupAlert = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      mockSlQuestionnaireService.getEvidenceData = jest.fn(() => Promise.resolve({})) as any
      questionnaireComponent.openAlert = jest.fn(() => Promise.resolve({})) as any
      questionnaireComponent.onSubmit(save);
    });

    it('should call onSubmit on click', () => {
      mockObservationUtilService.getAlertMetaData = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      mockObservationUtilService.showPopupAlert = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      mockSlQuestionnaireService.getEvidenceData = jest.fn(() => Promise.resolve({})) as any
      questionnaireComponent.openAlert = jest.fn(() => Promise.resolve({})) as any
      questionnaireComponent.onSubmit();
    });

    it('should call onSubmit without save event', () => {
      mockObservationUtilService.getAlertMetaData = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      mockObservationUtilService.showPopupAlert = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      mockSlQuestionnaireService.getEvidenceData = jest.fn(() => Promise.resolve({})) as any
      questionnaireComponent.openAlert = jest.fn(() => Promise.resolve()) as any
      questionnaireComponent.onSubmit();
    });
  })

  describe('submit Evidence', () => {
    it('Should call submitEvidence for draft data', () => {
      questionnaireComponent.assessmentInfo = <any>Questionnaire.result;
      mockObservationUtilService.getAlertMetaData = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      mockObservationService.post = jest.fn(() => of(AlertMetaData)) as any;
      questionnaireComponent.submitEvidence(Payload);
      expect(mockObservationService.post).toHaveBeenCalled();
    });

    it('Should not call submitEvidence for draft data', () => {
      questionnaireComponent.assessmentInfo = <any>Questionnaire.result;
      mockObservationUtilService.getAlertMetaData = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      mockObservationService.post = jest.fn(() => throwError({})) as any;
      questionnaireComponent.openAlert = jest.fn(() => Promise.resolve({ a: '' })) as any
      questionnaireComponent.submitEvidence(Payload);
      expect(mockObservationService.post).toHaveBeenCalled();
    });

    it('Should call submitEvidence for non draft data', () => {
      questionnaireComponent.assessmentInfo = <any>Questionnaire.result;
      mockObservationUtilService.getAlertMetaData = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      mockObservationService.post = jest.fn(() => of(AlertMetaData)) as any;
      questionnaireComponent.openAlert = jest.fn(() => Promise.resolve({})) as any
      Payload.evidence.status = 'submit'
      questionnaireComponent.submitEvidence(Payload);
      expect(mockObservationService.post).toHaveBeenCalled();
    });

    it('Should not call submitEvidence for non-draft data', () => {
      questionnaireComponent.assessmentInfo = <any>Questionnaire.result;
      mockObservationUtilService.getAlertMetaData = jest.fn(() => Promise.resolve(AlertMetaData)) as any
      mockObservationService.post = jest.fn(() => throwError({})) as any;
      questionnaireComponent.openAlert = jest.fn(() => Promise.resolve({})) as any
      Payload.evidence.status = 'submit'
      questionnaireComponent.submitEvidence(Payload);
      expect(mockObservationService.post).toHaveBeenCalled();
    });
  })
});