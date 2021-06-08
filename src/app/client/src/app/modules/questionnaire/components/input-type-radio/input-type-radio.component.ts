import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ResourceService } from "@sunbird/shared";
import { Question } from "../../Interface/assessmentDetails";
import { QuestionnaireService } from "../../questionnaire.service";

@Component({
  selector: "input-type-radio",
  templateUrl: "./input-type-radio.component.html",
  styleUrls: ["./input-type-radio.component.scss"],
})
export class InputTypeRadioComponent implements OnInit {
  @Input() options: any;
  @Input() questionnaireForm: FormGroup;
  @Input() question: Question;
  @Output() dependentParent = new EventEmitter<Question>();
  isDimmed: any
  hint:any

  constructor(
    public qService: QuestionnaireService,
    public resourceService: ResourceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.questionnaireForm.addControl(
        this.question._id,
        new FormControl(
          this.question.value || null,
          this.qService.validate(this.question)
        )
      );

      this.question.startTime = this.question.startTime
        ? this.question.startTime
        : Date.now();
      if (this.question.value) {
        if (this.question.children.length) {
          this.dependentParent.emit(this.question);
        }
      }
    });
  }

  get isValid(): boolean {
    return this.questionnaireForm.controls[this.question._id].valid;
  }

  get isTouched(): boolean {
    return this.questionnaireForm.controls[this.question._id].touched;
  }

  onChange(value) {
    this.questionnaireForm.controls[this.question._id].setValue(value);
    this.question.value = value;
    this.question.endTime = Date.now();
    if (this.question.children.length) {
      this.dependentParent.emit(this.question);
    }
  }
}
