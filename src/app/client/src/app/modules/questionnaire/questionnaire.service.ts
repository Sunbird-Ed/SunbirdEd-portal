import { Injectable } from "@angular/core";
import { AbstractControl, ValidatorFn } from "@angular/forms";
import { ConfigService } from "@sunbird/shared";
import { KendraService, CloudService } from "@sunbird/core";
import {
  Evidence,
  Question,
  ResponseType,
} from "./Interface/assessmentDetails";

@Injectable({
  providedIn: "root",
})
export class QuestionnaireService {
  private _submissionId: string;
  constructor(
    private config: ConfigService,
    private kendraService: KendraService,
    private cloudServ: CloudService,
  ) { }

  validate = (data: Question): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof data.validation == "string") {
        return null;
      }
      if (!data.validation.required) {
        return null;
      }
      if (data.validation.regex) {
        const forbidden = this.testRegex(data.validation.regex, control.value);
        return forbidden ? null : { err: "Invalid character found" };
      }

      if (data.validation.IsNumber) {
        if (!control.value) {
          return { err: "Number not entered" };
        }
        const forbidden = !isNaN(control.value);
        return forbidden ? null : { err: "Only numbers allowed" };
      }

      if (data.validation.required) {
        if (!control.value ) {
          return { err: "Required field" };
        }

        if (data.responseType == ResponseType.MULTISELECT) {
          return control.value.some((v) => v != "")
            ? null
            : { err: "Select at least one option" };
        }

        if (data.responseType == ResponseType.SLIDER) {
          let min = data.validation.min;
          let max = data.validation.max;
          return min <= control.value && control.value <= max
            ? null
            : { err: "Selected value  not within range" };
        }
      }
    };
  };

  public testRegex(regexExpression: RegExp, value: string): boolean {
    const regex = new RegExp(regexExpression);
    return regex.test(value);
  }

  getEvidenceData(evidence: Evidence, formValues: object) {
    let sections = evidence.sections;
    let answers = this.getSectionData(sections, formValues);
    let payloadData = {
      externalId: evidence.externalId,
      answers: answers,
      startTime: evidence.startTime,
      endTime: Date.now(),
    };
    return payloadData;
  }

  getSectionData(sections, formValues) {
    let answers = {};
    for (let index = 0; index < sections.length; index++) {
      answers = {
        ...answers,
        ...this.createpayload(sections[index].questions, formValues),
      };
    }
    return answers;
  }

  createpayload(questions, formValues) {
    let answers = {};
    for (let index = 0; index < questions.length; index++) {
      let currentQuestion = questions[index];
      if (currentQuestion.responseType == "pageQuestions") {
        answers = {
          ...answers,
          ...this.createpayload(currentQuestion.pageQuestions, formValues),
        };
        continue;
      }
      if (currentQuestion.responseType == "matrix") {
        for (let index = 0; index < currentQuestion.value.length; index++) {
          formValues[currentQuestion._id][index] = this.createpayload(
            currentQuestion.value[index],
            formValues[currentQuestion._id][index]
          );
        }
      }

      let perQuestionData = this.formatToPayload(currentQuestion, formValues);
      answers[currentQuestion._id] = perQuestionData;
    }

    return answers;
  }

  formatToPayload(currentQuestion, formValues) {
    let value =
      currentQuestion.responseType != "matrix"
        ? currentQuestion.value
        : formValues[currentQuestion._id];
    return {
      qid: currentQuestion._id,
      value: value,
      remarks: currentQuestion.remarks,
      fileName: currentQuestion.fileName, //todo,
      gpsLocation: "",
      payload: {
        question: currentQuestion.question,
        labels: formValues[currentQuestion._id],
        responseType: currentQuestion.responseType,
        filesNotUploaded: [], //todo
      },
      startTime: currentQuestion.startTime,
      endTime: currentQuestion.endTime,
      criteriaId: currentQuestion.payload.criteriaId,
      responseType: currentQuestion.responseType,
      evidenceMethod: currentQuestion.evidenceMethod,
      rubricLevel: "",
    };
  }

  mapSubmissionToAssessment(data) {
    const assessment = data.assessment;

    for (const evidence of assessment.evidences) {
      const validSubmission = assessment.submissions[evidence.externalId];
      if (validSubmission) {
        evidence.notApplicable = validSubmission.notApplicable;
        if (evidence.notApplicable) {
          continue;
        }

        for (const section of evidence.sections) {
          for (const question of section.questions) {
            if (question.responseType === "pageQuestions") {
              for (const questions of question.pageQuestions) {
                questions.value =
                  questions.responseType !== "matrix"
                    ? validSubmission.answers[questions._id].value
                    : this.constructMatrixValue(
                        validSubmission,
                        questions,
                        evidence.externalId
                      );
                questions.remarks = validSubmission.answers[questions._id]
                  ? validSubmission.answers[questions._id].remarks
                  : "";
                questions.fileName = validSubmission.answers[questions._id]
                  ? validSubmission.answers[questions._id].fileName
                  : [];
              }
            } else if (
              validSubmission.answers &&
              validSubmission.answers[question._id]
            ) {
              question.value =
                question.responseType !== "matrix"
                  ? validSubmission.answers[question._id].value
                  : this.constructMatrixValue(
                    validSubmission,
                    question,
                    evidence.externalId
                  );
              question.remarks = validSubmission.answers[question._id]
                ? validSubmission.answers[question._id].remarks
                : "";
              question.fileName = validSubmission.answers[question._id]
                ? validSubmission.answers[question._id].fileName
                : [];
            }
          }
        }
      }
    }
    return data;
  }

  constructMatrixValue(validSubmission, matrixQuestion, ecmId) {
    matrixQuestion.value = [];
    if (
      validSubmission.answers &&
      validSubmission.answers[matrixQuestion._id] &&
      validSubmission.answers[matrixQuestion._id].value
    ) {
      for (const answer of validSubmission.answers[matrixQuestion._id].value) {
        matrixQuestion.value.push(
          JSON.parse(JSON.stringify(matrixQuestion.instanceQuestions))
        );
      }
      matrixQuestion.value.forEach((instance, index) => {
        instance.forEach((question, instanceIndex) => {
          if (
            validSubmission.answers[matrixQuestion._id] &&
            validSubmission.answers[matrixQuestion._id].value[index][
              question._id
            ]
          ) {
            question.value =
              validSubmission.answers[matrixQuestion._id].value[index][
                question._id
              ].value;
            question.remarks =
              validSubmission.answers[matrixQuestion._id].value[index][
                question._id
              ].remarks;
            question.fileName =
              validSubmission.answers[matrixQuestion._id].value[index][
                question._id
              ].fileName;
          }
        });
      });
      return matrixQuestion.value;
    } else {
      return [];
    }
  }

  setSubmissionId(submissionId: any) {
    this._submissionId = submissionId;
  }
  getSubmissionId() {
    return this._submissionId;
  }

  getPreSingedUrls(payload) {
    const paramOptions = {
      url: this.config.urlConFig.URLS.KENDRA.PRESIGNED_URLS,
      data: payload,
    };
    return this.kendraService.post(paramOptions);
  }

  cloudStorageUpload(payload) {
    const paramOptions = {
      url: 'upload',
      data: payload,
      // header:{
      //   "Content-Type": "multipart/form-data",
      // }
    };
    return this.cloudServ.put(paramOptions)
    // return this.http.put(payload['url'], payload.data)
  }

}
