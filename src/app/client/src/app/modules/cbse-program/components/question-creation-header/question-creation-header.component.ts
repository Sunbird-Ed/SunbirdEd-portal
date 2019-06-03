import { Component, OnInit, Output, Input, EventEmitter, OnChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-question-creation-header',
  templateUrl: './question-creation-header.component.html',
  styleUrls: ['./question-creation-header.component.css']
})
export class QuestionCreationHeaderComponent implements OnInit {
  public enableBtn;
  public showPreview;
  showrejectCommentPopup = false;
  showFormError = false;
  @Input() role: any;
  @Input() questionMetaData: any;
  @Output() buttonType = new EventEmitter < any > ();
  @Output() questionStatus = new EventEmitter < any > ();
  @Input() disableSubmission: boolean;
  @ViewChild('FormControl') private FormControl;
  constructor() { }

  ngOnInit() {
    this.enableBtn = 'edit';
    this.showPreview = false;
  }

  reviewerBtnclick(event, buttonType) {
    if (buttonType === 'Reject') {
      this.showrejectCommentPopup = true;
    } else {
      this.questionStatus.emit( { 'status' : buttonType } );
    }
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

  dismissCommentPopup() {
    this.showrejectCommentPopup = false;
  }
  addComment() {
    if (this.FormControl.value.rejectComment) {
      this.showFormError = false;
      this.showrejectCommentPopup = false;
      this.questionStatus.emit( { 'status' : 'Reject', 'rejectComment':  this.FormControl.value.rejectComment} );
    } else {
      this.showFormError = true;
    }
  }

}
