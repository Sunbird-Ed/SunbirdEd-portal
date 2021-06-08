import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  SuiModalService,
  TemplateModalConfig,
  ModalTemplate,
} from "ng2-semantic-ui";
import { ResourceService } from "@sunbird/shared";
import { MatrixQuestion, Question } from "../../Interface/assessmentDetails";
import { ObservationUtilService } from "../../../observation/service";
import { QuestionnaireService } from "../../questionnaire.service";
import * as _ from 'lodash-es';

export interface IContext {
  questions: Question[];
  heading: string;
  index: number;
}
@Component({
  selector: "matrix-questions",
  templateUrl: "./matrix-questions.component.html",
  styleUrls: ["./matrix-questions.component.scss"],
})
export class MatrixQuestionsComponent implements OnInit {
  @Input() questionnaireForm: FormGroup;
  @Input() question: MatrixQuestion;
  matrixForm: FormGroup;
  @ViewChild("modalTemplate", { static: false })
  public modalTemplate: ModalTemplate<IContext, string, string>;
  context: IContext;
  showBadgeAssingModel: boolean;
  constructor(
    public modalService: SuiModalService,
    public fb: FormBuilder,
    public resourceService: ResourceService,
    public observationUtilService: ObservationUtilService,
    public qService: QuestionnaireService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matrixForm = this.fb.group({}, Validators.required);
      this.questionnaireForm.addControl(
        this.question._id,
        new FormArray([], [Validators.required])
      );
      this.initializeMatrix();
    });
  }

  initializeMatrix() {
    let valid = true;
    if (this.question.value.length) {
      this.question.value.map((v) => {
        let obj = {};
        v.forEach((ques) => {
          if (!ques.value) return;
          obj[ques._id] = ques.value;
        });
        (this.questionnaireForm.controls[this.question._id] as FormArray).push(
          new FormControl(obj)
        );
        if (_.isEmpty(obj)) {
          valid = false;
        }
      });
    }

    if (!valid)
      this.questionnaireForm.controls[this.question._id].setErrors({
        err: "Matrix reposne not valid",
      });
  }

  addInstances(): void {
    this.question.value = this.question.value ? this.question.value : [];
    this.question.value.push(
      JSON.parse(JSON.stringify(this.question.instanceQuestions))
    );
    this.matrixForm.reset();
    this.formAsArray.push(new FormControl([], [Validators.required]));
  }

  viewInstance(i): void {
    this.matrixForm.reset();
    if (this.formAsArray.controls[i].value) {
      this.matrixForm.patchValue(this.formAsArray.controls[i].value);
    }
    const config = new TemplateModalConfig<IContext, string, string>(
      this.modalTemplate
    );
    config.closeResult = "closed!";
    config.context = {
      questions: this.question.value[i],
      heading: `${this.question.instanceIdentifier} ${i + 1}`,
      index: i,
    };
    this.context = config.context;
    this.showBadgeAssingModel = true;
  }

  get formAsArray() {
    return this.questionnaireForm.controls[this.question._id] as FormArray;
  }

  matrixSubmit(index) {
    this.showBadgeAssingModel = false;
    this.formAsArray.at(index).patchValue(this.matrixForm.value);
    if (this.matrixForm.invalid) {
      this.formAsArray.at(index).setErrors({ err: "Matrix reposne not valid" });
    }
  }

  async deleteInstanceAlert(index) {
    let metaData = await this.observationUtilService.getAlertMetaData();
    metaData.content.body.data =
      this.resourceService.frmelmnts.lbl.deleteSubmission;
    metaData.content.body.type = "text";
    metaData.content.title = this.resourceService.frmelmnts.btn.delete;
    metaData.size = "mini";
    metaData.footer.buttons.push({
      type: "cancel",
      returnValue: false,
      buttonText: this.resourceService.frmelmnts.btn.no,
    });
    metaData.footer.buttons.push({
      type: "accept",
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.yes,
    });
    metaData.footer.className = "double-btn";
    const accepted = await this.observationUtilService.showPopupAlert(metaData);
    if (!accepted) {
      return;
    }

    this.question.value.splice(index, 1);
    (this.questionnaireForm.controls[this.question._id] as FormArray).removeAt(
      index
    );
  }
}
