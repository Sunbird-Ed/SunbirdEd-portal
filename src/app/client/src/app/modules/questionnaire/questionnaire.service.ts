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

  createpayload(questions, values) {
    let answers = {};
    for (let index = 0; index < questions.length; index++) {
      let currentQuestion = questions[index];
      if (currentQuestion.responseType == "pageQuestions") {
        answers = {
          ...answers,
          ...this.createpayload(currentQuestion.pageQuestions, values),
        };
        continue;
      }
      if (currentQuestion.responseType == "matrix") {
        for (let index = 0; index < currentQuestion.value.length; index++) {
          values[currentQuestion._id][index] = this.createpayload(
            currentQuestion.value[index],
            values[currentQuestion._id][index]
          );
        }
      }

      let perQuestionData = {
        qid: currentQuestion._id,
        value: values[currentQuestion._id],
        remarks: "", // todo :
        fileName: [], //todo,
        gpsLocation: "",
        payload: {
          question: currentQuestion.question,
          labels: values[currentQuestion._id],
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
      if (currentQuestion.responseType == "multiselect") {
        // check value field is array format or not
      }
      // Array.isArray(perQuestionData.payload.labels)
      //   ? null
      //   : (perQuestionData.payload.labels = [perQuestionData.payload.labels]);
      answers[currentQuestion._id] = perQuestionData;
    }

    return answers;
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
