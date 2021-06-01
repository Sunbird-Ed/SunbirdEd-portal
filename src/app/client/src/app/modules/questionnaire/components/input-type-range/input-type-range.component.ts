import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Question } from "../../Interface/assessmentDetails";
import { QuestionnaireService } from "../../questionnaire.service";

@Component({
  selector: "input-type-range",
  templateUrl: "./input-type-range.component.html",
  styleUrls: ["./input-type-range.component.scss"],
})
export class InputTypeRangeComponent implements OnInit {
  @Input() questionnaireForm: FormGroup;
  @Input() question: Question;
  constructor(public qService: QuestionnaireService) {}

  ngOnInit() {
    setTimeout(() => {
      this.questionnaireForm.addControl(
        this.question._id,
        new FormControl(this.question.value || null, [
          this.qService.validate(this.question),
        ])
      );
      this.question.startTime = this.question.startTime
        ? this.question.startTime
        : Date.now();     
    });
  }

  onChange(e: Event) {
    let value = (e.target as HTMLInputElement).value;
    this.question.value = value;
    this.question.endTime = Date.now();
  }

  get isValid(): boolean {
    return this.questionnaireForm.controls[this.question._id].valid;
  }

  get isTouched(): boolean {
    return this.questionnaireForm.controls[this.question._id].touched;
  }

  get min() {
    if (typeof this.question.validation == "string") {
      return null;
    }
    return this.question.validation.min;
  }

  get max() {
    if (typeof this.question.validation == "string") {
      return null;
    }
    return this.question.validation.max;
  }
}
