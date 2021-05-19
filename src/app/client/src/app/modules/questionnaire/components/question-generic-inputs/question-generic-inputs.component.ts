import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "question-generic-inputs",
  templateUrl: "./question-generic-inputs.component.html",
  styleUrls: ["./question-generic-inputs.component.scss"],
})
export class QuestionGenericInputsComponent implements OnInit {
  @Input() questions: any;
  @Input() questionnaireForm: any;
  constructor() {}

  ngOnInit() {}
}
