import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { QuestionnaireService } from "../../questionnaire.service";

@Component({
  selector: "input-type-number",
  templateUrl: "./input-type-number.component.html",
  styleUrls: ["./input-type-number.component.scss"],
})
export class InputTypeNumberComponent implements OnInit {
  response;
  @Input() questionnaireForm: FormGroup;
  @Input() question: any;
  constructor(public qService: QuestionnaireService) {}

  ngOnInit() {
    this.questionnaireForm.addControl(
      this.question._id,
      new FormControl(null, [
        Validators.required,
        this.qService.validate(this.question),
      ])
    );
    this.question.startTime = this.question.startTime
      ? this.question.startTime
      : Date.now();
  }
  onChange(e) {
    let value = e.target.value;
    this.question.value = value;

    this.question.endTime = Date.now();
  }

  get isValid() {
    return this.questionnaireForm.controls[this.question._id].valid;
  }

  get isTouched() {
    return this.questionnaireForm.controls[this.question._id].touched;
  }
}
