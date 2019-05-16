import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-question-creation-header',
  templateUrl: './question-creation-header.component.html',
  styleUrls: ['./question-creation-header.component.css']
})
export class QuestionCreationHeaderComponent implements OnInit {
  public enableBtn = 'edit';
  @Input() questionMetaData: any;
  @Output() buttonType = new EventEmitter < any > ();
  @Input() disableSubmission: boolean;
  constructor() { }

  ngOnInit() {
  }
  btnClick(event, button) {
    this.enableBtn = button;
    this.buttonType.emit(button);
  }

}
