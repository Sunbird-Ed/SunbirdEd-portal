import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { PageQuestion } from "../../Interface/assessmentDetails";

@Component({
  selector: "page-questions",
  templateUrl: "./page-questions.component.html",
  styleUrls: ["./page-questions.component.scss"],
})
export class PageQuestionsComponent implements OnInit {
  @Input() questionnaireForm: FormGroup;
  @Input() question: PageQuestion;
  constructor() {}

  ngOnInit() {}
}
