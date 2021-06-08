import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";

@Component({
  selector: "input-type-checkbox",
  templateUrl: "./input-type-checkbox.component.html",
  styleUrls: ["./input-type-checkbox.component.scss"],
})
export class InputTypeCheckboxComponent implements OnInit {
  @Input() options;
  @Input() questionnaireForm: FormGroup;
  @Input() question: any;
  constructor() {}

  ngOnInit() {
    const optionControl = this.options.map((v) => {
      if (this.question.value && this.question.value.find((_v) => _v == v.value)) {
        return new FormControl(v.value);
      }
      return new FormControl("");
    });

    this.questionnaireForm.addControl(
      this.question._id,
      new FormArray(optionControl, Validators.required)
    );

    this.question.startTime = this.question.startTime
      ? this.question.startTime
      : Date.now();
  }

  onChange(oId: string, isChecked: boolean, oIndex: number) {
    const formArray: FormArray = this.questionnaireForm.get(
      this.question._id
    ) as FormArray;
    if (isChecked) {
      formArray.controls[oIndex].patchValue(oId);
    }
    this.question.value =
      this.questionnaireForm.controls[this.question._id].value;
    this.question.value = this.question.value.filter(Boolean);
    this.question.endTime = Date.now();
  }

  get isValid() {
    return this.questionnaireForm.controls[this.question._id].valid;
  }

  get isTouched() {
    return this.questionnaireForm.controls[this.question._id].touched;
  }
}
