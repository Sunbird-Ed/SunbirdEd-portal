import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "page-questions",
  templateUrl: "./page-questions.component.html",
  styleUrls: ["./page-questions.component.scss"],
})
export class PageQuestionsComponent implements OnInit {
  @Input() questionnaireForm: FormGroup;
  @Input() question: any;
  constructor() {}

  ngOnInit() {
  }
}
