import { Component, Input, OnInit } from "@angular/core";
import { QuestionnaireService } from "../../questionnaire.service";
import { ResourceService } from "@sunbird/shared";

@Component({
  selector: "question-generic-inputs",
  templateUrl: "./question-generic-inputs.component.html",
  styleUrls: ["./question-generic-inputs.component.scss"],
})
export class QuestionGenericInputsComponent implements OnInit {
  @Input() questions: any;
  @Input() questionnaireForm: any;
  attachmentData = { submissionId: this.qService.getSubmissionId() };
  selectedIndex: any;
  constructor(
    public resourceService: ResourceService,
    private qService: QuestionnaireService
  ) {}

  ngOnInit() {}

  openRemark(data, i) {
    this.selectedIndex = i;
    data["isRemarkClicked"] = true;
  }

  deleteRemarks(data, i) {
    data["isRemarkClicked"] = false;
  }

  saveClicked(event, data) {
    data["isRemarkClicked"] = false;
  }

  toggleQuestion(parent) {
    const { children } = parent;

    this.questions.map((q, i) => {
      if (children.includes(q._id)) {
        let child = this.questions[i];
        child["canDisplay"] = this.canDisplayChildQ(child, i);
      }
    });
  }

  canDisplayChildQ(currentQuestion, currentQuestionIndex) {
    let display = true;
    for (const question of this.questions) {
      for (const condition of currentQuestion.visibleIf) {
        if (condition._id === question._id) {
          let expression = [];
          if (condition.operator != "===") {
            if (question.responseType === "multiselect") {
              for (const parentValue of question.value) {
                for (const value of condition.value) {
                  expression.push(
                    "(",
                    "'" + parentValue + "'",
                    "===",
                    "'" + value + "'",
                    ")",
                    condition.operator
                  );
                }
              }
            } else {
              for (const value of condition.value) {
                expression.push(
                  "(",
                  "'" + question.value + "'",
                  "===",
                  "'" + value + "'",
                  ")",
                  condition.operator
                );
              }
            }
            expression.pop();
          } else {
            if (question.responseType === "multiselect") {
              for (const value of question.value) {
                expression.push(
                  "(",
                  "'" + condition.value + "'",
                  "===",
                  "'" + value + "'",
                  ")",
                  "||"
                );
              }
              expression.pop();
            } else {
              expression.push(
                "(",
                "'" + question.value + "'",
                condition.operator,
                "'" + condition.value + "'",
                ")"
              );
            }
          }
          if (!eval(expression.join(""))) {
            this.questions[currentQuestionIndex].isCompleted = true;
            return false;
          } else {
            // this.questions[currentQuestionIndex].isCompleted =
            //   this.utils.isQuestionComplete(currentQuestion);
          }
        }
      }
    }
    return display;
  }
}
