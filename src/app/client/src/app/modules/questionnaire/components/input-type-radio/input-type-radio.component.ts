import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "input-type-radio",
  templateUrl: "./input-type-radio.component.html",
  styleUrls: ["./input-type-radio.component.scss"],
})
export class InputTypeRadioComponent implements OnInit {
  @Input() options: any;
  @Input() questionnaireForm: FormGroup;
  @Input() question: any;

  constructor() {}

  ngOnInit() {
    this.questionnaireForm.addControl(
      this.question._id,
      new FormControl(null, Validators.required)
    );
  }

  get isValid() {
    return this.questionnaireForm.controls[this.question._id].valid;
  }

  get isTouched() {
    return this.questionnaireForm.controls[this.question._id].touched;
  }

  onChange(x) {
    this.questionnaireForm.controls[this.question._id].setValue(x);
  }
}
