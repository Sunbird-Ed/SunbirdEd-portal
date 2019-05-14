import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { ConfigService, IUserProfile, IUserData } from '@sunbird/shared';
import { UserService, PublicDataService, ActionService } from '@sunbird/core';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {
  @Input() selectedAttributes: any;
  public questionList = [];
  public selectedQuestionId: any;
  public questionMetaData: any;
  public refresh = true;
  public enableCreateButton = true;
  public showLoader = true;
  constructor(private configService: ConfigService, private userService: UserService, private publicDataService: PublicDataService,
    public actionService: ActionService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.fetchQuestionList();
  }
  fetchQuestionList() {
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'AssessmentItem',
            'board': this.selectedAttributes.board,
            'framework': this.selectedAttributes.framework,
            'gradeLevel': this.selectedAttributes.gradeLevel,
            'subject': this.selectedAttributes.subject,
            'medium': this.selectedAttributes.medium,
            'type': this.selectedAttributes.questionType,
            'topic': this.selectedAttributes.topic,
            'createdBy': this.userService.userid,
            'version': 3,
            'status': []
          },
          'sort_by': { 'createdOn': 'ASC' }
        }
      }
    };
    this.publicDataService.post(req).subscribe((res) => {
      this.questionList = res.result.items;
      if (this.questionList.length) {
        this.getQuestion(this.questionList[0].identifier);
        this.selectedQuestionId = this.questionList[0].identifier;
        return;
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
      console.log('fetching question failed');
    });
  }
  public getQuestion(questionId) {
    this.showLoader = true;
    const req = {
      url: `${this.configService.urlConFig.URLS.ASSESSMENT.READ}/${questionId}`
    };
    this.actionService.get(req).subscribe((res) => {
      let editorMode;
      if (['Draft', 'Review', 'Reject'].includes(res.result.assessment_item.status)) {
        editorMode = 'edit';
      } else {
        editorMode = 'view';
      }
      this.questionMetaData = {
        mode: editorMode,
        data: res.result.assessment_item
      };
      this.enableCreateButton = true;
      this.showLoader = false;
    }, error => {
      this.showLoader = false;
      console.log('fetching questions failed');
    });
  }
  public createNewQuestion(): void {
    this.enableCreateButton = false;
    this.questionMetaData = {
      mode: 'create'
    };
    this.refreshEditor();
  }
  public questionStatusHandler(event) {
    console.log('editor event', event);
    if (event.type === 'close') {
      this.showLoader = true;
      this.getQuestion(this.selectedQuestionId);
      return;
    }
    if (event.status === 'failed') {
      console.log('failed');
    } else {
      this.enableCreateButton = true;
      this.fetchQuestionList();
    }
  }
  private refreshEditor() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
}
