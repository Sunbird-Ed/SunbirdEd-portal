import { Injectable } from "@angular/core";
import { AbstractControl, ValidatorFn } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class QuestionnaireService {
  constructor() {}

  validate(data): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!data.validation.required) {
        return null;
      }
      if (data.validation.regex) {
        const forbidden = this.testRegex(data.validation.regex, control.value);
        return forbidden ? { err: "Only alphabets allowed" } : null;
      }

      if (data.validation.IsNumber) {
        const forbidden = !isNaN(control.value);
        return forbidden ? { err: "Only numbers allowed" } : null;
      }

      return null;
    };
  }

  public testRegex(rege, value): boolean {
    const regex = new RegExp(rege);
    return regex.test(value);
  }

  getEvidenceData(evidence, formValues) {
    let sections = evidence.sections;
    let answers = this.getSectionData(sections, formValues);
    let payloadData = {
      externalid: "OB", //todo
      answers: answers,
      // startTime: 1620977187792, //todo
      // endTime: 1620977187792, //todo
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
    return {
      qid: currentQuestion._id,
      value: formValues[currentQuestion._id],
      remarks: "", // todo :
      fileName: [], //todo,
      gpsLocation: "",
      payload: {
        question: currentQuestion.question,
        labels: formValues[currentQuestion._id],
        responseType: currentQuestion.responseType,
        filesNotUploaded: [], //todo
      },
      startTime: 1620977188671, //todo
      endTime: "",
      criteriaId: currentQuestion.payload.criteriaId,
      responseType: currentQuestion.responseType,
      evidenceMethod: "OB", //todo
      rubricLevel: "",
    };
  }

  x() {
    this.validate;
    alert(this.validate);
    debugger;
    let evidence = {
      externalid: "OB", //todo
      // answers: answers,
      // startTime: 1620977187792, //todo
      // endTime: 1620977187792, //todo
    };
  }
}
