import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ConfigService, ToasterService, IUserData } from '@sunbird/shared';
import { UserService, PublicDataService, ActionService, ContentService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { tap, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { of } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CbseProgramService } from '../../services';
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, OnChanges {
  @Input() selectedAttributes: any;
  @Input() role: any;
  @Output() changeStage = new EventEmitter();

  public questionList = [];
  public selectedQuestionId: any;
  public questionReadApiDetails: any = {};
  public questionMetaData: any;
  public refresh = true;
  public showLoader = true;
  public showDelete = false;
  public enableRoleChange = false;
  selectedAll: any;
  private questionTypeName = {
    vsa: 'Very Short Answer',
    sa: 'Short Answer',
    la: 'Long Answer',
    mcq: 'Multiple Choice Question'
  };

  constructor(private configService: ConfigService, private userService: UserService, private publicDataService: PublicDataService,
    public actionService: ActionService, private cdr: ChangeDetectorRef, public toasterService: ToasterService,
    public telemetryService: TelemetryService, private fb: FormBuilder, private cbseService: CbseProgramService,
    public contentService: ContentService) {
  }
  ngOnChanges(changedProps: any) {
    if (this.enableRoleChange) {
      this.fetchQuestionWithRole();
    }
  }
  ngOnInit() {
    console.log('changes detected in question list', this.role);
    this.fetchQuestionWithRole();
    this.enableRoleChange = true;
    this.selectedAll = false;
  }
  private fetchQuestionWithRole() {
    (this.role.currentRole === 'REVIEWER') ? this.fetchQuestionList(true) : this.fetchQuestionList();
  }
  private fetchQuestionList(isReviewer?: boolean) {
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
            'type': this.selectedAttributes.questionType === 'mcq' ? 'mcq' : 'reference',
            'category': this.selectedAttributes.questionType.toUpperCase(),
            'topic': this.selectedAttributes.topic,
            'createdBy': this.userService.userid,
            'programId': this.selectedAttributes.programId,
            'version': 3,
            'status': []
          },
          'sort_by': { 'createdOn': 'desc' }
        }
      }
    };
    if (isReviewer) {
      delete req.data.request.filters.createdBy;
      if (this.selectedAttributes.selectedSchoolForReview) {
        req.data.request.filters['organisation'] = this.selectedAttributes.selectedSchoolForReview;
      }
      req.data.request.filters.status = ['Review'];
    }
    if (this.role.currentRole === "PUBLISHER") {
      delete req.data.request.filters.createdBy;
      req.data.request.filters.status = ['Live'];
    }
    if (this.role.currentRole === "CONTRIBUTOR") {
      req.data.request.filters.status = ['Live','Review','Reject','Draft'];
    }
    this.publicDataService.post(req).pipe(tap(data => this.showLoader = false))
      .subscribe((res) => {
        this.questionList = res.result.items || [];
        _.forEach(this.questionList, (question) => {
          question.isSelected = false;
        });
        if (this.questionList.length) {
          this.selectedQuestionId = this.questionList[0].identifier;
          this.handleQuestionTabChange(this.selectedQuestionId);
        }else if(this.questionList.length == 0){ this.showDelete = false}
      }, err => {
        this.toasterService.error(_.get(err, 'error.params.errmsg') || 'Fetching question list failed');
        const telemetryErrorData = {
          context: {
            env: 'cbse_program'
          },
          edata: {
            err: err.status.toString(),
            errtype: 'PROGRAMPORTAL',
            stacktrace: _.get(err, 'error.params.errmsg') || 'Fetching question list failed'
          }
        };
        this.telemetryService.error(telemetryErrorData);
      });
  }
  handleQuestionTabChange(questionId) {
    this.selectedQuestionId = questionId;
    this.showLoader = true;
    this.getQuestionDetails(questionId).pipe(tap(data =>{ this.showLoader = false; if(this.showDelete){this.showDelete = false}}))
      .subscribe((assessment_item) => {
        let editorMode;
        if (['Draft', 'Review', 'Reject'].includes(assessment_item.status)) {
          editorMode = 'edit';
        } else {
          editorMode = 'view';
        }
        this.questionMetaData = {
          mode: editorMode,
          data: assessment_item
        };
        this.refreshEditor();
      }, err => {
        this.toasterService.error(_.get(err, 'error.params.errmsg') || 'Fetching question failed');
        const telemetryErrorData = {
          context: {
            env: 'cbse_program'
          },
          edata: {
            err: err.status.toString(),
            errtype: 'PROGRAMPORTAL',
            stacktrace: _.get(err, 'error.params.errmsg') || 'Fetching question list failed'
          }
        };
        this.telemetryService.error(telemetryErrorData);
      });
  }
  public getQuestionDetails(questionId) {
    if (this.questionReadApiDetails[questionId]) {
      return of(this.questionReadApiDetails[questionId]);
    }
    const req = {
      url: `${this.configService.urlConFig.URLS.ASSESSMENT.READ}/${questionId}`
    };
    return this.actionService.get(req).pipe(map(res => {
      this.questionReadApiDetails[questionId] = res.result.assessment_item;
      return res.result.assessment_item;
    }));
  }
  public createNewQuestion(): void {
    this.questionMetaData = {
      mode: 'create'
    };
    this.refreshEditor();
  }
  discardEvent(event){
    if(this.selectedQuestionId){ 
    this.handleQuestionTabChange(this.selectedQuestionId);
    }else{
    this.changeStage.emit('topicList');
    }
  }
  public questionStatusHandler(event) {
    console.log('editor event', event);
    if (event.type === 'close') {
      this.questionMetaData = {};
      if (this.questionList.length) {
        this.handleQuestionTabChange(this.selectedQuestionId);
      }
      return;
    } else if (event.status === 'failed') {
      console.log('failed');
    } else if (event.type === 'update') {
        delete this.questionReadApiDetails[event.identifier];
        this.handleQuestionTabChange(this.selectedQuestionId);
      }else if (event.type === 'Retired') {
        console.log('Retired ques:',this.selectedQuestionId);
        this.showLoader = true;
        this.showDelete = true;
        setTimeout(() => this.fetchQuestionList(), 2000);
      }else if (event.type === 'Reject' || event.type === 'Live') {
        this.showLoader = true;
        setTimeout(() => this.fetchQuestionList(true), 2000);
      } else {
        this.showLoader = true;
        setTimeout(() => this.fetchQuestionList(), 2000);
      }
    
  }

  handleRefresEvent() {
    this.refreshEditor();
  }
  private refreshEditor() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  selectAll() {
    _.forEach(this.questionList, (question) => {
      question.isSelected = this.selectedAll;
    })
  }

  checkIfAllSelected() {
    this.selectedAll = this.questionList.every(function (question: any) {
      return question.selected == true;
    })
  }

  publishQuestions() {
    let selectedQuestions = _.filter(this.questionList, (question) => _.get(question, 'isSelected'));
    let selectedQuestionsData = _.reduce(selectedQuestions, (final, question) => {
      final.ids.push(_.get(question, 'identifier'));
      final.contributors.push(_.get(question, 'creator'));
      _.union(final.attributions, _.get(question, 'organisation'));
      return final;
    }, { ids: [], contributors: [], attributions: [] });

    if (selectedQuestionsData.ids.length > 0) {
      const questions = [];
      _.forEach(_.get(selectedQuestionsData, 'ids'), (value) => {
        questions.push({ 'identifier': value });
      });
      this.cbseService.getECMLJSON(selectedQuestionsData.ids).subscribe((theme) => {
        let creator = this.userService.userProfile.firstName;
        if (!_.isEmpty(this.userService.userProfile.lastName)) {
          creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
        }
        const option = {
          url: this.configService.urlConFig.URLS.CONTENT.CREATE,
          data: {
            'request': {
              'content': {
                'name': `${this.questionTypeName[this.selectedAttributes.questionType]} - ${this.selectedAttributes.topic}`,
                'contentType': 'PracticeQuestionSet',
                'mimeType': 'application/vnd.ekstep.ecml-archive',
                'programId': this.selectedAttributes.programId,
                'program': this.selectedAttributes.program,
                'framework': this.selectedAttributes.framework,
                'board': this.selectedAttributes.board,
                'medium': [this.selectedAttributes.medium],
                'gradeLevel': [this.selectedAttributes.gradeLevel],
                'subject': [this.selectedAttributes.subject],
                'topic': [this.selectedAttributes.topic],
                'createdBy': 'edce4f4f-6c82-458a-8b23-e3521859992f',
                'creator': 'Content Creator',
                'editorVersion': 3,
                'body': JSON.stringify(theme),
                'resourceType': 'Practice',
                'description': `${this.questionTypeName[this.selectedAttributes.questionType]} - ${this.selectedAttributes.topic}`,
                'questions': questions,
                'contributors': _.join(_.uniq(_.compact(_.get(selectedQuestionsData, 'contributors'))), ', '),
                'attributions': _.compact(_.get(selectedQuestionsData, 'attributions')),
                'textBookUnitIdentifier': this.selectedAttributes.textBookUnitIdentifier,
                // tslint:disable-next-line: max-line-length
                'appIcon': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11279144369168384014/artifact/qa_1561455529937.png'
              }
            }
          }
        };
        this.contentService.post(option).subscribe((res) => {
          console.log('res ', res);
          if(res.responseCode === 'OK' && res.result.content_id !== undefined){
            this.publishResource(res.result.content_id);
          }
        }, error => {
          this.toasterService.error(_.get(error, 'error.params.errmsg') || 'content creation failed');
        });
      });
    } else {
      this.toasterService.error('Please select some questions to Publish');
    }
  }

  publishResource(contentId){
    const requestBody = {
      request: {
        content: {
          publisher: 'CBSE',
          lastPublishedBy: '99606810-7d5c-4f1f-80b0-36c4a0b4415d'
        }
      }
    };
    const optionVal = {
      url: `${this.configService.urlConFig.URLS.CONTENT.PUBLISH}/${contentId}`,
      data: requestBody
    };
    this.contentService.post(optionVal).subscribe(response => {
      this.toasterService.success('content created & published successfully');
    }, (err) => {
      this.toasterService.error(_.get(err, 'error.params.errmsg') || 'content publish failed');
    });
  }
}
