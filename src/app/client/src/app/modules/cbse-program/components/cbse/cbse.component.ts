import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

interface ISelectedAttributes {
    framework?: string;
    board?: string;
    medium?: string;
    gradeLevel?: string;
    subject?: string;
    topic?: string;
    questionType?: string;
}

@Component({
  selector: 'app-cbse',
  templateUrl: './cbse.component.html',
  styleUrls: ['./cbse.component.scss']
})
export class CbseComponent implements OnInit {

  @Input() programDetails: any;
  @Input() userProfile: any;
  public selectedAttributes: ISelectedAttributes = {};
  public topicList: any;
  public gradeLevelList: any;
  public subjectList: any;
  // public selectedQuestionTypeTopic: any;
  public stages: Array<string> = ['chooseClass', 'topicList', 'createQuestion'];
  public currentStage = 0;
  public defaultSelectedOptions: any;
  constructor() { }

  ngOnInit() {
    this.selectedAttributes.framework = this.programDetails.config.framework;
    this.selectedAttributes.board = this.programDetails.config.scope.board[0];
    this.selectedAttributes.medium = this.programDetails.config.scope.medium[0];
    this.gradeLevelList = this.programDetails.config.scope.gradeLevel;
    this.subjectList = this.programDetails.config.scope.subject;
    console.log('programDetails', this.programDetails, this.userProfile);
  }

  public selectedTextbookHandler(event) {
    console.log(event);
    // this.selectedOptions = event
    this.selectedAttributes.gradeLevel =  event.class;
    this.selectedAttributes.subject =  event.subject;
    this.topicList = event.topics;
    this.navigate('next');
  }

  public selectedQuestionTypeTopic(event) {
    // this.selectedQuestionTypeTopic = event;
    this.selectedAttributes.topic =  event.topic;
    this.selectedAttributes.questionType =  event.questionType;
    this.navigate('next');
  }

  navigate(step) {
    if (step === 'next') {
      this.currentStage = this.currentStage + 1;
    } else if (step === 'prev') {
      this.currentStage = this.currentStage - 1;
    }
  }
}
