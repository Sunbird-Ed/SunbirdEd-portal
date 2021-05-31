import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import {
  SuiModalService,
  TemplateModalConfig,
  ModalTemplate,
} from "ng2-semantic-ui";
import { ResourceService } from "@sunbird/shared";
import { MatrixQuestion, Question } from "../../Interface/assessmentDetails";
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
    public resourceService: ResourceService
  ) {}

  ngOnInit() {
    this.matrixForm = this.fb.group({});
    debugger
    this.questionnaireForm.addControl(this.question._id, new FormArray([]));
    this.initializeMatrix();
  }

  initializeMatrix() {
    if (this.question.value.length) {
      this.question.value.map((v) => {
        let obj = {};
        v.forEach((ques) => {
          obj[ques._id] = ques.value;
        });
        (this.questionnaireForm.controls[this.question._id] as FormArray).push(
          new FormControl(obj)
        );
      });
    }
  }

  addInstances(): void {
    this.question.value = this.question.value ? this.question.value : [];
    this.question.value.push(
      JSON.parse(JSON.stringify(this.question.instanceQuestions))
    );

    // this.checkForValidation();//TODO
  }

  viewInstance(i): void {
    this.matrixForm.reset();
    if (this.formAsArray.controls[i]) {
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
    // const obj = {
    //   selectedIndex: i,
    //   data: JSON.parse(JSON.stringify(this.data)),
    //   evidenceId: this.evidenceId,
    //   schoolId: this.schoolId,
    //   generalQuestion: this.generalQuestion,
    //   submissionId: this.submissionId,
    //   questionIndex: this.inputIndex,
    //   enableQuestionReadOut: this.enableQuestionReadOut,
    // };
    // let matrixModal = this.modalCntrl.create(MatrixActionModalPage, obj);
    // matrixModal.onDidDismiss((instanceValue) => {
    //   if (this.enableGps) {
    //     this.checkForGpsLocation(i, instanceValue);
    //   } else {
    //     this.updateInstance(i, instanceValue);
    //   }
    // });
    // matrixModal.present();
  }

  get formAsArray() {
    return this.questionnaireForm.controls[this.question._id] as FormArray;
  }

  matrixSubmit(index) {
    this.showBadgeAssingModel = false;
    if (this.formAsArray.controls[index]) {
      this.formAsArray.at(index).patchValue(this.matrixForm.value);
      return;
    }
    this.formAsArray.push(new FormControl(this.matrixForm.value));
  }

  deleteInstanceAlert(index) {
    this.question.value.splice(index, 1);
    (this.questionnaireForm.controls[this.question._id] as FormArray).removeAt(
      index
    );
  }
}
