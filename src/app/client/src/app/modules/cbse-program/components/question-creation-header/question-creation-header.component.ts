import { Component, OnInit, Output, Input, EventEmitter, OnChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-question-creation-header',
  templateUrl: './question-creation-header.component.html',
  styleUrls: ['./question-creation-header.component.css']
})
export class QuestionCreationHeaderComponent implements OnInit, OnChanges {
  public enableBtn;
  public showPreview;
  showrejectCommentPopup = false;
  showFormError = false;
  public reviewerCommentModal = false;
  public dummySelectionStatus: any;
  @Input() role: any;
  @Input() questionMetaData: any;
  @Input() questionSelectionStatus: any;
  @Input() rejectComment: any;
  @Output() buttonType = new EventEmitter < any > ();
  @Output() questionStatus = new EventEmitter < any > ();
  @Output() questionQueueStatus = new EventEmitter < any > ();
  @Input() disableSubmission: boolean;
  @ViewChild('FormControl') private FormControl;
  constructor() { }

  ngOnInit() {
    this.enableBtn = 'edit';
    this.showPreview = false;
  }
  ngOnChanges() {
    this.showPreview = false;
    console.log(this.questionSelectionStatus);
    this.dummySelectionStatus = this.questionSelectionStatus;
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
  setQuestionSelection() {
    this.questionSelectionStatus = !this.questionSelectionStatus;
    this.questionQueueStatus.emit({questionId: this.questionMetaData.data.identifier, status: this.questionSelectionStatus });
  }
  openReviewerCommentModal() {
    this.reviewerCommentModal = true;
   }

   closeReviewerCommentModal() {
     this.reviewerCommentModal = false;
   }

}
