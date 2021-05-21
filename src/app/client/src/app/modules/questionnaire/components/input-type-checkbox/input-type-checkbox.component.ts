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
    this.questionnaireForm.addControl(
      this.question._id,
      new FormArray([], Validators.required)
    );
  }

  onChange(oid: string, isChecked: boolean) {
    const formArray: FormArray = this.questionnaireForm.get(
      this.question._id
    ) as FormArray;
    if (isChecked) {
      formArray.push(new FormControl(oid));
    } else {
      let index = formArray.controls.findIndex((ctrl) => ctrl.value == oid);
      formArray.removeAt(index);
    }
    this.question.value =
      this.questionnaireForm.controls[this.question._id].value;
    console.log(this.question)
  }

  get isValid() {
    return this.questionnaireForm.controls[this.question._id].valid;
  }

  get isTouched() {
    return this.questionnaireForm.controls[this.question._id].touched;
  }
}
