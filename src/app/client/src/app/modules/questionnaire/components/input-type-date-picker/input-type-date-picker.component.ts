import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "input-type-date-picker",
  templateUrl: "./input-type-date-picker.component.html",
  styleUrls: ["./input-type-date-picker.component.scss"],
})
export class InputTypeDatePickerComponent implements OnInit {
  date: any;
  @Input() questionnaireForm: FormGroup;
  @Input() question: any;
  constructor() {}
  firstDayOfWeek

  ngOnInit() {
    this.questionnaireForm.addControl(
      this.question._id,
      new FormControl(0, Validators.required)
    );
    this.question.startTime = this.question.startTime
      ? this.question.startTime
      : Date.now();
  }

  onChange(e) {
    let value = e;
    this.question.value = value;
    this.question.endTime = Date.now();
  }
}
