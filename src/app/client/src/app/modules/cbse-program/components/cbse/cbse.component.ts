import { Component, OnInit, Input } from '@angular/core';
import { FrameworkService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { first } from 'rxjs/operators';

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
  public topicList: any;
  public selectedAttributes: ISelectedAttributes = {};
  public stages: Array<string> = ['chooseClass', 'topicList', 'createQuestion'];
  public currentStage = 0;
  constructor(public frameworkService: FrameworkService) { }

  ngOnInit() {
    this.selectedAttributes.framework = _.get(this.programDetails, 'config.framework');
    this.selectedAttributes.board = _.get(this.programDetails, 'config.scope.board[0]');
    this.selectedAttributes.medium = _.get(this.programDetails, 'config.scope.medium[0]');
    this.fetchFrameWorkDetails();
  }

  public selectedTextbookHandler(event) {
    this.selectedAttributes.gradeLevel =  event.gradeLevel;
    this.selectedAttributes.subject =  event.subject;
    this.navigate('next');
  }

  public selectedQuestionTypeTopic(event) {
    this.selectedAttributes.topic =  event.topic;
    this.selectedAttributes.questionType =  event.questionType;
    this.navigate('next');
  }

  public fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.selectedAttributes.framework);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.selectedAttributes.framework].categories;
        this.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
          }
      }
    );
  }
  navigate(step) {
    if (step === 'next') {
      this.currentStage = this.currentStage + 1;
    } else if (step === 'prev') {
      this.currentStage = this.currentStage - 1;
    }
  }
}
