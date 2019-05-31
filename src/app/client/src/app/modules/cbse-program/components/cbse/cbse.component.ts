import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FrameworkService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { first } from 'rxjs/operators';
import {Subject} from 'rxjs';
 
interface ISelectedAttributes {
    framework?: string;
    channel?: string;
    board?: string;
    medium?: string;
    gradeLevel?: string;
    subject?: string;
    textbook?: string;
    topic?: string;
    questionType?: string;
    programId?: string;
    program?: string;
    currentRole?: string;
    bloomsLevel?: Array<any>;
    topicList?: Array<any>;
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
  public stages: Array<string> = ['chooseClass', 'chooseTextbook', 'topicList', 'createQuestion'];
  public currentStage = 0;
  public role: any = {};
  constructor(public frameworkService: FrameworkService) { }



  ngOnInit() {
    this.selectedAttributes = {
      currentRole: _.get(this.programDetails, 'userDetails.roles[0]'),
      framework: _.get(this.programDetails, 'config.scope.framework'),
      channel: _.get(this.programDetails, 'config.scope.channel'),
      board: _.get(this.programDetails, 'config.scope.board[0]'),
      medium: _.get(this.programDetails, 'config.scope.medium[0]'),
      bloomsLevel: _.get(this.programDetails, 'config.scope.bloomsLevel'),
      programId: _.get(this.programDetails, 'programId'),
      program: _.get(this.programDetails, 'name')
    };
    this.role.currentRole= this.selectedAttributes.currentRole;
    this.fetchFrameWorkDetails();
  }

  public selectedClassSubjectHandler(event) {
    this.selectedAttributes.gradeLevel =  event.gradeLevel;
    this.selectedAttributes.subject =  event.subject;
    this.navigate('next');
  }

  public selectedTextbookHandler(event) {
    this.selectedAttributes.textbook =  event;
    this.navigate('next');
  }

  public selectedQuestionTypeTopic(event) {
    this.selectedAttributes.topic =  event.topic;
    this.selectedAttributes.questionType =  event.questionType;
    this.navigate('next');
  }
  handleRoleChange() {  
    this.role = Object.assign({},{currentRole :this.selectedAttributes.currentRole});
  } 
  public fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.selectedAttributes.framework);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.selectedAttributes.framework].categories;
        this.selectedAttributes.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
      }
    });
  }
  navigate(step) {
    if (step === 'next') {
      this.currentStage = this.currentStage + 1;
    } else if (step === 'prev') {
      this.currentStage = this.currentStage - 1;
    }
  }
}
