import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Question, Validation } from "../../Interface/assessmentDetails";
import { ResourceService } from "@sunbird/shared";

@Component({
  selector: "input-type-date-picker",
  templateUrl: "./input-type-date-picker.component.html",
  styleUrls: ["./input-type-date-picker.component.scss"],
})
export class InputTypeDatePickerComponent implements OnInit {
  date: any;
  @Input() questionnaireForm: FormGroup;
  @Input() question: Question;
  min: Date;
  max: Date;
  
  constructor(public resourceService: ResourceService) {}

  ngOnInit() {
    setTimeout(() => {
      this.questionnaireForm.addControl(
        this.question._id,
        new FormControl(
          this.question.value ? new Date(this.question.value as string) : null,
          Validators.required
        )
      );

      this.question.startTime = this.question.startTime
        ? this.question.startTime
        : Date.now();
    });
    this.min = (this.question.validation as Validation).min? new Date((this.question.validation as Validation).min) : null;
    this.max = (this.question.validation as Validation).max? new Date((this.question.validation as Validation).max) : null;
  }

  onChange(e: string) {
    let value = e;
    this.question.value = value;
    this.question.endTime = Date.now();
  }

  autoCapture() {
    this.questionnaireForm.controls[this.question._id].patchValue(
      new Date(Date.now())
    );
  }
}
