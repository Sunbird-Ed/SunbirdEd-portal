import { TestBed } from "@angular/core/testing";

import { QuestionnaireService } from "./questionnaire.service";
import { KendraService, CloudService } from "@sunbird/core";
import { configureTestSuite } from "@sunbird/test-util";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { APP_BASE_HREF } from "@angular/common";
import { Router } from "@angular/router";
import { ConfigService, ResourceService } from "@sunbird/shared";
import {
  Question,
  PayloadData,
  Evidence,
  FormValue,
  Answer,
  NumberValidation,Validation,
  Questionnaire,
  Questionnaire1,
  Regex,
  NoValidation,
  ValidSubmission,
  MatrixQuestion
} from "./questionnaire.service.mock";
import { AbstractControl } from "@angular/forms";
import { FormGroup, FormBuilder,FormControl } from "@angular/forms";

import * as _ from "lodash-es";
import {
  of as observableOf,
  throwError as observableThrowError,
  Observable,
  of,
  observable
} from "rxjs";


describe("QuestionnaireService", () => {
  let baseHref, kendraService, userService, modalService, fb :FormBuilder = new FormBuilder;
  let service: QuestionnaireService;
  configureTestSuite();
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        KendraService,
        CloudService,
        ConfigService,
        { provide: APP_BASE_HREF, useValue: baseHref },
        { provide: Router },
        { provide: ResourceService }
      ],
      imports: [HttpClientTestingModule]
    })
  );
  beforeEach(() => {
    service = TestBed.get(QuestionnaireService);
    kendraService = TestBed.get(KendraService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Should validate the data", () => {
    spyOn(service, "validate").and.callThrough();
    service.validate(<any>Question);
    expect(service.validate).toHaveBeenCalled();
  });

  it("Should validate the Number", () => {
    let form = fb.group({});
    let value = 456;
    form.addControl('number', new FormControl(value,[
      service.validate(<any>NumberValidation)
    ]));
   spyOn(service, "validate").and.callThrough();
   service.validate(<any>NumberValidation);
    expect(service.validate).toHaveBeenCalled();
    expect(form.controls['number'].valid).toBe(true);
  });

  it("Should validate the Number with empty value", () => {
    let form = fb.group({});
    form.addControl('numberWithEmptyVal', new FormControl('',[
      service.validate(<any>NumberValidation)
    ]));
    spyOn(service, "validate").and.callThrough();
    service.validate(<any>NumberValidation);
    expect(service.validate).toHaveBeenCalled();
    expect(form.controls['numberWithEmptyVal'].valid).toBe(false);
  });

  it("Should return null if no validation required", () => {
    let form = fb.group({});
    form.addControl('no validation', new FormControl('',[
      service.validate(<any>NoValidation)
    ]));
    spyOn(service, "validate").and.callThrough();
    service.validate(<any>NoValidation);  
    expect(service.validate).toHaveBeenCalled();
    expect(form.controls['no validation'].valid).toBe(true);
  });

  it("Should validate the validation",() =>{
    let form = fb.group({});
    form.addControl('validation', new FormControl('',[
      service.validate(<any>Validation)
    ]));
    spyOn(service, "validate").and.callThrough();
    service.validate(<any>Validation);  
    expect(service.validate).toHaveBeenCalled();
    expect(form.controls['validation'].valid).toBe(false);
  })

  it("Should validate the Regex", () => {
    let form = fb.group({});
    form.addControl('Regrex', new FormControl('Regrex test',[
      service.validate(<any>Regex)
    ]));
    spyOn(service, "validate").and.callThrough();
    service.validate(<any>Regex);
    expect(service.validate).toHaveBeenCalled();
    expect(form.controls['Regrex'].valid).toBe(true);
  });

  it("Should set Submission Id", () => {
    let submissionId = "60c89137b66fbd53b9c52dfb";
    spyOn(service, "setSubmissionId").and.callThrough();
    service.setSubmissionId(submissionId);
    expect(service.setSubmissionId).toHaveBeenCalled();
    expect(service['_submissionId']).toEqual(submissionId);
  });


  it("Should return submission Id", () => {
    spyOn(service, "getSubmissionId").and.callThrough();
    service.getSubmissionId();
    expect(service.getSubmissionId).toHaveBeenCalled();
  });

  it("Should test Regex", () => {
    let controlVal: any = ["R2", "R3"];
    spyOn(service, "testRegex").and.callThrough();
    service.testRegex(<any>Regex, controlVal);
    expect(service.testRegex).toHaveBeenCalled();
  });

  it("Should fetch evidence", () => {
    spyOn(service, "getEvidenceData").and.callThrough();
    service.getEvidenceData(<any>Evidence, <any>FormValue);
    expect(service.getEvidenceData).toHaveBeenCalled();
  });

  it("Should fetch Section data", () => {
    spyOn(service, "getSectionData").and.callThrough();
    service.getSectionData(Evidence.sections, FormValue);
    expect(service.getSectionData).toHaveBeenCalled();
  });

  it("Should fetch pre signed url", () => {
    spyOn(service, "getPreSingedUrls").and.callThrough();
    service.getPreSingedUrls(PayloadData);
    expect(service.getPreSingedUrls).toHaveBeenCalled();
  });

  it("Shuold create payload matrix with responseType matrix", () => {
    spyOn(service, "createpayload").and.callThrough();
    service.createpayload(
      Questionnaire1.result.assessment.evidences[0].sections[0].questions,
      FormValue
    );
    expect(service.createpayload).toHaveBeenCalled();
  });
  it("Should upload to cloud", () => {
    spyOn(service, "cloudStorageUpload").and.callThrough();
    service.cloudStorageUpload(PayloadData);
    expect(service.cloudStorageUpload).toHaveBeenCalled();
  });

  it("Should return matrix value", () => {
    spyOn(service, "constructMatrixValue").and.callThrough();
    service.constructMatrixValue(ValidSubmission, MatrixQuestion, "OB");
    expect(service.constructMatrixValue).toHaveBeenCalled();
  });

  it("Should call mapSubmissionToAssessment", () => {
    spyOn(service, "mapSubmissionToAssessment").and.callThrough();
    service.mapSubmissionToAssessment(Questionnaire.result);
    expect(service.mapSubmissionToAssessment).toHaveBeenCalled();
  });

  it("Should format the payload", () => {
    spyOn(service, "formatToPayload").and.callThrough();
    service.formatToPayload(
      Questionnaire.result.assessment.evidences[0].sections[0].questions[0],
      FormValue
    );
    expect(service.formatToPayload).toHaveBeenCalled();
  });
});
