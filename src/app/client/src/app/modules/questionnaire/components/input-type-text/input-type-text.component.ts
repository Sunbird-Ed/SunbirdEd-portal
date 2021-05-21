import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { QuestionnaireService } from "../../questionnaire.service";

@Component({
  selector: "input-type-text",
  templateUrl: "./input-type-text.component.html",
  styleUrls: ["./input-type-text.component.scss"],
})
export class InputTypeTextComponent implements OnInit {
  text: any;
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
  }

  onChange(e) {
    let value = e.target.value
    this.question.value = value
  }

  get isValid() {
    return this.questionnaireForm.controls[this.question._id].valid;
  }

  get isTouched() {
    return this.questionnaireForm.controls[this.question._id].touched;
  }
}
