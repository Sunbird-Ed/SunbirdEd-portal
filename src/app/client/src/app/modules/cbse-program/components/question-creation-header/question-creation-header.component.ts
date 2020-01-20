import { Component, OnInit, Output, Input, EventEmitter, OnChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-question-creation-header',
  templateUrl: './question-creation-header.component.html',
  styleUrls: ['./question-creation-header.component.scss']
})
export class QuestionCreationHeaderComponent implements OnInit {
  public reviewerCommentModal = false;
  @Input() role: any;
  @Input() questionMetaData: any;
  @Input() resourceStatus: any;
  constructor() { }

  ngOnInit() {}

  openReviewerCommentModal() {
    this.reviewerCommentModal = true;
  }

  closeReviewerCommentModal() {
    this.reviewerCommentModal = false;
  }

}
