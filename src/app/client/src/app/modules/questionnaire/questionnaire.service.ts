import { Injectable } from "@angular/core";
import { AbstractControl, ValidatorFn } from "@angular/forms";
import { ConfigService } from "@sunbird/shared";
import { KendraService } from "@sunbird/core";

@Injectable({
  providedIn: "root",
})
export class QuestionnaireService {
  private _submissionId: any;
  constructor(
    private config: ConfigService,
    private kendraService: KendraService
  ) {}

  validate = (data): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!data.validation.required) {
        return null;
      }
      if (data.validation.regex) {
        const forbidden = this.testRegex(data.validation.regex, control.value);
        return forbidden ? null : { err: "Only alphabets allowed" };
      }

      if (data.validation.IsNumber) {
        const forbidden = !isNaN(control.value);
        return forbidden ? null : { err: "Only numbers allowed" };
      }

      if (data.validation.required) {
        if (!control.value || !control.value.length) {
          return { err: "Required field" };
        }
      }

      return null;
    };
  };

  public testRegex(rege, value): boolean {
    const regex = new RegExp(rege);
    return regex.test(value);
  }

  getEvidenceData(evidence, formValues) {
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
      remarks: "", // todo :
      fileName: [], //todo,
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
                questions.remarks = validSubmission.answers[question._id]
                  ? validSubmission.answers[question._id].remarks
                  : "";
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
            ].value
          ) {
            question.value =
              validSubmission.answers[matrixQuestion._id].value[index][
                question._id
              ].value;
            question.remarks =
              validSubmission.answers[matrixQuestion._id].value[index].remarks;
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
}
