import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Question } from "../../Interface/assessmentDetails";
import { QuestionnaireService } from "../../questionnaire.service";

@Component({
  selector: "input-type-number",
  templateUrl: "./input-type-number.component.html",
  styleUrls: ["./input-type-number.component.scss"],
})
export class InputTypeNumberComponent implements OnInit {
  response: string;
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
}
