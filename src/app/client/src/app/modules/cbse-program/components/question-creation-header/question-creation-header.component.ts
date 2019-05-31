import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-question-creation-header',
  templateUrl: './question-creation-header.component.html',
  styleUrls: ['./question-creation-header.component.css']
})
export class QuestionCreationHeaderComponent implements OnInit,OnChanges {
  public enableBtn;
  public showPreview;
  @Input() role: any;
  @Input() questionMetaData: any;
  @Output() buttonType = new EventEmitter < any > ();
  @Output() questionStatus = new EventEmitter < string > ();
  @Input() disableSubmission: boolean;
  constructor() { }

  ngOnChanges(){
    
  }
  ngOnInit() {
    this.enableBtn = 'edit';
    this.showPreview = false;
  }

  reviewerBtnclick(event, buttonType){
    console.log('Question metadata',this.questionMetaData);
    this.questionStatus.emit(buttonType);
  }

  btnClick(event, button) {
    this.enableBtn = button;
    if (button === 'create') {
      this.enableBtn = 'edit';
    } else {
      this.enableBtn = button;
    }
    this.buttonType.emit(button);
  }

}
