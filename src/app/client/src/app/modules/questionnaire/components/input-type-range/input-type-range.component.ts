import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "input-type-range",
  templateUrl: "./input-type-range.component.html",
  styleUrls: ["./input-type-range.component.scss"],
})
export class InputTypeRangeComponent implements OnInit {
  @Input() questionnaireForm: FormGroup;
  @Input() question: any;
  constructor() {}

  ngOnInit() {
    console.log("matrix");
    console.log(this.question);
    this.questionnaireForm.addControl(
      this.question._id,
      new FormControl(this.question.value || 0, Validators.required)
    );
    this.question.startTime = this.question.startTime
      ? this.question.startTime
      : Date.now();
    this.initRange();
  }
  initRange() {
    const range = document.getElementById("range"),
      rangeV = document.getElementById("rangeV"),
      setValue = () => {
        const newValue = Number(
            ((range["value"] - range["min"]) * 100) /
              (range["max"] - range["min"])
          ),
          newPosition = 10 - newValue * 0.2;
        rangeV.innerHTML = `<span>${range["value"]}</span>`;
        rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
      };
    document.addEventListener("DOMContentLoaded", setValue);
    range.addEventListener("input", setValue);
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
