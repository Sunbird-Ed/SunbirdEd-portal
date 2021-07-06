import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Question } from "../../Interface/assessmentDetails";
import { QuestionnaireService } from "../../questionnaire.service";
import { ResourceService } from "@sunbird/shared";

@Component({
  selector: "input-type-checkbox",
  templateUrl: "./input-type-checkbox.component.html",
  styleUrls: ["./input-type-checkbox.component.scss"],
})
export class InputTypeCheckboxComponent implements OnInit {
  @Input() options;
  @Input() questionnaireForm: FormGroup;
  @Input() question: Question;
  @Output() dependentParent = new EventEmitter<Question>();
  isDimmed: any;
  hint: any;

  constructor(
    public qService: QuestionnaireService,
    public resourceService: ResourceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      const optionControl = this.options.map((v) => {
        if (
          this.question.value &&
          (this.question.value as Array<string>).find((_v) => _v == v.value)
        ) {
          return new FormControl(v.value);
        }
        return new FormControl("");
      });

      this.questionnaireForm.addControl(
        this.question._id,
        new FormArray(optionControl, this.qService.validate(this.question))
      );

      this.question.startTime = this.question.startTime
        ? this.question.startTime
        : Date.now();
      if (this.question.value.length) {
        if (this.question.children.length) {
          this.dependentParent.emit(this.question);
        }
      }
    });
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
    this.question.value = (this.question.value as Array<string>).filter(
      Boolean
    );
    this.question.endTime = Date.now();
    if (this.question.children.length) {
      this.dependentParent.emit(this.question);
    }
  }

  get isValid(): boolean {
    return this.questionnaireForm.controls[this.question._id].valid;
  }

  get isTouched(): boolean {
    return this.questionnaireForm.controls[this.question._id].touched;
  }
}
