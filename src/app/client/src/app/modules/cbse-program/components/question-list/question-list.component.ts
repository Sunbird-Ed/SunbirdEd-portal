import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { ConfigService, ToasterService, IUserData } from '@sunbird/shared';
import { UserService, PublicDataService, ActionService, ContentService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { tap, map, catchError } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { of, forkJoin, throwError } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CbseProgramService } from '../../services';
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit, OnChanges {
  @ViewChild('questionCreationChild') questionCreationChild: ElementRef;
  @Output() changeStage = new EventEmitter<any>();
  @Output() publishButtonStatus = new EventEmitter<any>();
  @Input() practiceQuestionSetComponentInput: any;
  public sessionContext: any;
  public role: any;
  public templateDetails: any;
  public questionList = [];
  public selectedQuestionId: any;
  public questionReadApiDetails: any = {};
  public resourceDetails: any = {};
  public resourceStatus: string;
  public questionMetaData: any;
  public refresh = true;
  public showLoader = true;
  public enableRoleChange = false;
  public showSuccessModal = false;
  public showReviewModal = false;
  public showAddReviewModal = false;
  public showDelectContentModal = false;
  public showPublishModal = false;
  public publishInProgress = false;
  public publishedResourceId: any;
  public questionSelectionStatus: any;
  public existingContentVersionKey = '';
  public resourceTitleLimit = 100;
  selectedAll: any;
  initialized: boolean;
  public showTextArea = false;
  public resourceName: string;
  @ViewChild('resourceTtlTextarea') resourceTtlTextarea: ElementRef;
  private questionTypeName = {
    vsa: 'Very Short Answer',
    sa: 'Short Answer',
    la: 'Long Answer',
    mcq: 'Multiple Choice Question',
    curiosity: 'Curiosity Question'
  };

  constructor(private configService: ConfigService, private userService: UserService, private publicDataService: PublicDataService,
    public actionService: ActionService, private cdr: ChangeDetectorRef, public toasterService: ToasterService,
    public telemetryService: TelemetryService, private fb: FormBuilder, private cbseService: CbseProgramService,
    public contentService: ContentService) {
  }
  ngOnChanges(changedProps: any) {
    this.sessionContext = _.get(this.practiceQuestionSetComponentInput, 'sessionContext');
    if (this.enableRoleChange) {
      this.initialized = false; // it should be false before fetch
      if (this.sessionContext.questionType) {
        this.fetchQuestionWithRole();
      }
    }
    if ((this.sessionContext.currentRole === 'REVIEWER') || (this.sessionContext.currentRole === 'PUBLISHER')) {
      this.sessionContext['showMode'] = 'previewPlayer';
    } else {
      this.sessionContext['showMode'] = 'editorForm';
    }
  }
  ngOnInit() {
    // console.log('changes detected in question list', this.role);
    this.role = _.get(this.practiceQuestionSetComponentInput, 'role');
    this.templateDetails = _.get(this.practiceQuestionSetComponentInput, 'templateDetails');
    this.sessionContext.resourceIdentifier = _.get(this.practiceQuestionSetComponentInput, 'contentIdentifier');
    this.sessionContext.questionType = this.templateDetails.questionCategories[0];
    this.resourceName = this.templateDetails.metadata.name;
    this.fetchExistingResource(this.sessionContext.resourceIdentifier).subscribe(response => {
      this.resourceDetails = _.get(response, 'result.content');
      this.resourceStatus = _.get(this.resourceDetails, 'status');
      //this.resourceStatus = 'Review';
    });
    if (this.sessionContext.questionType) {
      this.fetchQuestionWithRole();
    } else {
      console.log(this.templateDetails.questionCategories);
    }
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
            'board': this.sessionContext.board,
            'framework': this.sessionContext.framework,
            // 'gradeLevel': this.sessionContext.gradeLevel,
            // 'subject': this.sessionContext.subject,
            'medium': this.sessionContext.medium,
            'type': this.sessionContext.questionType === 'mcq' ? 'mcq' : 'reference',
            'category': this.sessionContext.questionType === 'curiosity' ? 'CuriosityQuestion' :
              this.sessionContext.questionType.toUpperCase(),
            'topic': this.sessionContext.topic,
            'createdBy': this.userService.userid,
            'programId': this.sessionContext.programId,
            'version': 3,
            'status': []
          },
          'sort_by': { 'createdOn': 'desc' }
        }
      }
    };
    if (isReviewer) {
      delete req.data.request.filters.createdBy;
      if (this.sessionContext.selectedSchoolForReview) {
        req.data.request.filters['organisation'] = this.sessionContext.selectedSchoolForReview;
      }
      req.data.request.filters.status = ['Review'];
    }
    let apiRequest;
    apiRequest = [this.contentService.post(req).pipe(
      tap(data => this.showLoader = false),
      catchError(err => {
        const errInfo = { errorMsg: 'Fetching question list failed' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      }))];
    if (this.role.currentRole === 'PUBLISHER') {
      delete req.data.request.filters.createdBy;
      req.data.request.filters.status = ['Live'];
      if (this.sessionContext.resourceIdentifier) {
        // tslint:disable-next-line:max-line-length
        apiRequest = [this.contentService.post(req).pipe(tap(data => this.showLoader = false),
          catchError(err => {
            const errInfo = { errorMsg: 'Fetching question list failed' };
            return throwError(this.cbseService.apiErrorHandling(err, errInfo));
          })),
        this.fetchExistingResource(this.sessionContext.resourceIdentifier)];
      }
    }



    forkJoin(apiRequest)
      .subscribe((res: any) => {
        this.questionList = res[0].result.items || [];
        let selectedQuestionList = [];
        if (res[1]) {
          selectedQuestionList = _.map(_.get(res[1], 'result.content.questions'), 'identifier') || [];
        }
        _.forEach(this.questionList, (question) => {
          if (_.includes(selectedQuestionList, question.identifier)) {
            question.isSelected = true;
          } else {
            question.isSelected = false;
          }
        });
        if (this.questionList.length) {
          this.selectedQuestionId = this.questionList[0].identifier;
          this.handleQuestionTabChange(this.selectedQuestionId);
          this.questionSelectionStatus = this.questionList[0].isSelected;
        }
        this.selectedAll = this.questionList.every((question: any) => {
          return question.isSelected === true;
        });
      });
  }

  fetchExistingResource(contentId) {
    const request = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
    };
    return this.contentService.get(request).pipe(map((response) => {
      this.existingContentVersionKey = _.get(response, 'result.content.versionKey');
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = { errorMsg: 'Resource updation failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }


  handleQuestionTabChange(questionId) {
    if (_.includes(this.sessionContext.questionList, questionId)) { return; }
    this.sessionContext.questionList = [];
    this.sessionContext.questionList.push(questionId);
    this.selectedQuestionId = questionId;
    this.showLoader = true;
    this.getQuestionDetails(questionId).pipe(tap(data => this.showLoader = false))
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
        this.sessionContext.resourceStatus = this.resourceStatus;
        if (this.sessionContext.resourceStatus === 'Draft' || this.sessionContext.resourceStatus === 'Rejected') {
          this.sessionContext.isReadOnlyMode = false;
        } else {
          this.sessionContext.isReadOnlyMode = true;
        }
        // min of 1sec timeOut is set, so that it should go to bottom of call stack and execute whennever the player data is available
        if (this.sessionContext.showMode === 'previewPlayer' && this.initialized) {
          this.showLoader = true;
          setTimeout(() => {
            this.showLoader = false;
          }, 1000);
        }
        // tslint:disable-next-line:max-line-length
        if (this.role.currentRole === 'CONTRIBUTOR' && (editorMode === 'edit' || editorMode === 'view') && (this.sessionContext.showMode === 'editorForm')) {
          this.refreshEditor();
        }
        this.initialized = true;
      });
    const selectedQuestion = _.find(this.questionList, { identifier: questionId });
    if (selectedQuestion) {
      this.questionSelectionStatus = selectedQuestion.isSelected;
    }
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
    }),
      catchError(err => {
        const errInfo = { errorMsg: 'Fetching Question details failed' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      }));
  }
  public createNewQuestion(): void {
    this.questionMetaData = {
      mode: 'create'
    };
    this.refreshEditor();
  }
  public questionStatusHandler(event) {
    console.log('editor event', event);
    if (event.type === 'close') {
      this.questionMetaData = {};
      if (this.questionList.length) {
        this.handleQuestionTabChange(this.selectedQuestionId);
      }
      return;
    }
    if (event.status === 'failed') {
      console.log('failed');
    } else {
      if (event.type === 'update') {
        delete this.questionReadApiDetails[event.identifier];
        this.handleQuestionTabChange(this.selectedQuestionId);
      } if (event.type === 'Reject' || event.type === 'Live') {
        this.showLoader = true;
        setTimeout(() => this.fetchQuestionList(true), 2000);
      } else {
        this.showLoader = true;
        setTimeout(() => this.fetchQuestionList(), 2000);
      }
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
    });
    this.questionSelectionStatus = this.selectedAll;
  }

  checkIfAllSelected(qs) {
    this.selectedAll = this.questionList.every((question: any) => {
      return question.isSelected === true;
    });
    if (this.selectedQuestionId === qs.identifier) {
      this.questionSelectionStatus = qs.isSelected;
    }
  }
  questionQueueStatusHandler(event) {
    const selectedQuestion = _.find(this.questionList, { identifier: event.questionId });
    if (selectedQuestion) {
      selectedQuestion.isSelected = event.status;
    }
    this.selectedAll = this.questionList.every((question: any) => {
      return question.isSelected === true;
    });
    this.questionSelectionStatus = event.status;
  }
  public publishQuestions() {
    const selectedQuestions = _.filter(this.questionList, (question) => _.get(question, 'isSelected'));
    this.publishInProgress = true;
    this.publishButtonStatus.emit(this.publishInProgress);
    const selectedQuestionsData = _.reduce(selectedQuestions, (final, question) => {
      final.ids.push(_.get(question, 'identifier'));
      final.author.push(_.get(question, 'author'));
      final.category.push(_.get(question, 'category'));
      final.attributions = _.union(final.attributions, _.get(question, 'organisation'));
      return final;
    }, { ids: [], author: [], category: [], attributions: [] });

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
          url: `private/content/v3/create`,
          data: {
            'request': {
              'content': {
                // tslint:disable-next-line:max-line-length
                'name': this.resourceName || `${this.questionTypeName[this.sessionContext.questionType]} - ${this.sessionContext.topic}`,
                'contentType': this.sessionContext.questionType === 'curiosity' ? 'CuriosityQuestionSet' : 'PracticeQuestionSet',
                'mimeType': 'application/vnd.ekstep.ecml-archive',
                'programId': this.sessionContext.programId,
                'program': this.sessionContext.program,
                'framework': this.sessionContext.framework,
                'board': this.sessionContext.board,
                'medium': [this.sessionContext.medium],
                'gradeLevel': [this.sessionContext.gradeLevel],
                'subject': [this.sessionContext.subject],
                'topic': [this.sessionContext.topic],
                'createdBy': this.userService.userid, // '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8'  || 'edce4f4f-6c82-458a-8b23-e3521859992f',
                'creator': creator,
                'questionCategories': _.uniq(_.compact(_.get(selectedQuestionsData, 'category'))),
                'editorVersion': 3,
                'code': UUID.UUID(),
                'body': JSON.stringify(theme),
                'resourceType': this.sessionContext.questionType === 'curiosity' ? 'Teach' : 'Practice',
                'description': `${this.questionTypeName[this.sessionContext.questionType]} - ${this.sessionContext.topic}`,
                'questions': questions,
                'author': _.join(_.uniq(_.compact(_.get(selectedQuestionsData, 'author'))), ', '),
                'attributions': _.uniq(_.compact(_.get(selectedQuestionsData, 'attributions'))),
                'unitIdentifiers': [this.sessionContext.textBookUnitIdentifier],
                'plugins': [{
                  identifier: 'org.sunbird.questionunit.quml',
                  semanticVersion: '1.0'
                }],
                // tslint:disable-next-line: max-line-length
                'appIcon': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11279144369168384014/artifact/qa_1561455529937.png'
              }
            }
          }
        };
        this.contentService.post(option).pipe(catchError(err => {
          const errInfo = { errorMsg: 'Resource publish failed' };
          return throwError(this.cbseService.apiErrorHandling(err, errInfo));
        }))
          .subscribe((res) => {
            console.log('res ', res);
            if (res.responseCode === 'OK' && (res.result.content_id || res.result.node_id)) {
              this.publishResource(res.result.content_id || res.result.node_id);
            }
          }, error => {
            this.publishInProgress = false;
            this.publishButtonStatus.emit(this.publishInProgress);
          });
      });
    } else {
      this.publishInProgress = false;
      this.publishButtonStatus.emit(this.publishInProgress);
      this.toasterService.error('Please select some questions to Publish');
    }
  }

  public updateQuestions() {
    const selectedQuestions = _.filter(this.questionList, (question) => _.get(question, 'isSelected'));
    this.publishInProgress = true;
    this.publishButtonStatus.emit(this.publishInProgress);
    const selectedQuestionsData = _.reduce(selectedQuestions, (final, question) => {
      final.ids.push(_.get(question, 'identifier'));
      final.author.push(_.get(question, 'author'));
      final.category.push(_.get(question, 'category'));
      final.attributions = _.union(final.attributions, _.get(question, 'organisation'));
      return final;
    }, { ids: [], author: [], category: [], attributions: [] });
    if (selectedQuestionsData.ids.length > 0) {
      const questions = [];
      _.forEach(_.get(selectedQuestionsData, 'ids'), (value) => {
        questions.push({ 'identifier': value });
      });

      const updateBody = this.cbseService.getECMLJSON(selectedQuestionsData.ids);
      const versionKey = this.getContentVersion(this.sessionContext.resourceIdentifier);

      forkJoin([updateBody, versionKey]).subscribe((response: any) => {
        const existingContentVersionKey = _.get(response[1], 'content.versionKey');
        const options = {
          url: `private/content/v3/update/${this.sessionContext.resourceIdentifier}`,
          data: {
            'request': {
              'content': {
                questions: questions,
                body: JSON.stringify(response[0]),
                versionKey: existingContentVersionKey,
                'author': _.join(_.uniq(_.compact(_.get(selectedQuestionsData, 'author'))), ', '),
                'attributions': _.uniq(_.compact(_.get(selectedQuestionsData, 'attributions'))),
                // tslint:disable-next-line:max-line-length
                name: this.resourceName || `${this.questionTypeName[this.sessionContext.questionType]} - ${this.sessionContext.topic}`
              }
            }
          }
        };
        this.contentService.patch(options).pipe(catchError(err => {
          const errInfo = { errorMsg: 'Resource updation failed' };
          return throwError(this.cbseService.apiErrorHandling(err, errInfo));
        }))
          .subscribe((res) => {
            if (res.responseCode === 'OK' && (res.result.content_id || res.result.node_id)) {
              this.publishResource(res.result.content_id || res.result.node_id);
            }
          }, error => {
            this.publishInProgress = false;
            this.publishButtonStatus.emit(this.publishInProgress);
          });
      });
    } else {
      this.publishInProgress = false;
      this.publishButtonStatus.emit(this.publishInProgress);
    }
  }

  getContentVersion(contentId) {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}?mode=edit&fields=versionKey,createdBy`
    };
    return this.contentService.get(req).pipe(
      map(res => {
        return _.get(res, 'result');
      }, err => {
        console.log(err);
        this.toasterService.error(_.get(err, 'error.params.errmsg') || 'content update failed');
      })
    );
  }
  public selectQuestionCategory(questionCategory) {
    this.sessionContext.questionType = questionCategory;
    this.fetchQuestionWithRole();
  }
  publishResource(contentId) {
    const requestBody = {
      request: {
        content: {
          publisher: 'CBSE',
          lastPublishedBy: this.userService.userid // '99606810-7d5c-4f1f-80b0-36c4a0b4415d'
        }
      }
    };
    const optionVal = {
      url: `private/content/v3/publish/${contentId}`,
      data: requestBody
    };
    this.contentService.post(optionVal).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Resource updation failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }))
      .subscribe(response => {
        this.publishedResourceId = response.result.content_id || response.result.node_id || '';
        // tslint:disable-next-line:max-line-length
        this.updateHierarchyObj(contentId, this.resourceName || `${this.questionTypeName[this.sessionContext.questionType]} - ${this.sessionContext.topic}`);

      }, (err) => {
        this.publishInProgress = false;
        this.publishButtonStatus.emit(this.publishInProgress);
      });
  }

  updateHierarchyObj(contentId, name) {
    const index = _.indexOf(_.keys(this.sessionContext.hierarchyObj.hierarchy), this.sessionContext.textBookUnitIdentifier);
    if (index >= 0) {
      this.sessionContext.hierarchyObj.hierarchy[this.sessionContext.textBookUnitIdentifier].children.push(contentId);
      if (!_.has(this.sessionContext.hierarchyObj.hierarchy, contentId)) {
        this.sessionContext.hierarchyObj.hierarchy[contentId] = {
          'name': name,
          'contentType': this.sessionContext.questionType === 'curiosity' ? 'CuriosityQuestionSet' : 'PracticeQuestionSet',
          'children': [],
          'root': false
        };
      }
    }
    const requestBody = {
      'request': {
        'data': {
          'nodesModified': {},
          'hierarchy': this.sessionContext.hierarchyObj.hierarchy,
          'lastUpdatedBy': this.userService.userid
        }
      }
    };
    const req = {
      url: `private/content/v3/hierarchy/update`,
      data: requestBody
    };
    this.contentService.patch(req).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Resource updation failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }))
      .subscribe((res) => {
        this.showSuccessModal = true;
        this.publishInProgress = false;
        this.publishButtonStatus.emit(this.publishInProgress);
        this.toasterService.success('content created & published successfully');
      }, err => {
        console.log(err);
        this.toasterService.error(_.get(err, 'error.params.errmsg') || 'content update failed');
      });
  }

  public dismissPublishModal() {
    setTimeout(() => this.changeStage.emit('prev'), 0);
  }

  deleteQuestion(index, identifier) {
    console.log(index);
    console.log(identifier);
    const selectedQuestions = _.filter(this.questionList, (question) => question.identifier === identifier);
    console.log(this.questionList[index]);
    console.log(selectedQuestions);
  }

  public showResourceTitleEditor() {
    this.showTextArea = true;
    setTimeout(() => {
      this.resourceTtlTextarea.nativeElement.focus();
    }, 500);
  }

  public onResourceNameChange(event: any) {
    const remainChar = this.resourceTitleLimit - this.resourceName.length;
    if (remainChar <= 0 && event.keyCode !== 8) {
      event.preventDefault();
      return;
    }
    this.resourceName = this.removeSpecialChars(event.target.value);
  }

  private removeSpecialChars(text: any) {
    if (text) {
      const iChars = '!`~@#$^*+=[]\\\'{}|\"<>%';
      for (let i = 0; i < text.length; i++) {
        if (iChars.indexOf(text.charAt(i)) !== -1) {
          this.toasterService.error(`Special character ${text.charAt(i)} is not allowed`);
        }
      }
       // tslint:disable-next-line:max-line-length
      text = text.replace(/[^\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF\uFB50-\uFDFF\u0980-\u09FF\u0900-\u097F\u0D00-\u0D7F\u0A80-\u0AFF\u0C80-\u0CFF\u0B00-\u0B7F\u0A00-\u0A7F\u0B80-\u0BFF\u0C00-\u0C7F\w:&_\-.(\),\/\s]/g, '');
      return text;
    }
  }

  public onResourceNameBlur() {
    if (this.resourceName.length > 0 && this.resourceName.length <= this.resourceTitleLimit) {
      this.showTextArea = false;
    }
  }

  public showReview() {
    this.showReviewModal = true;
  }
}
