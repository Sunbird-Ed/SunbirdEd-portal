import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ConfigService, ToasterService, IUserData } from '@sunbird/shared';
import { UserService, PublicDataService, ActionService, ContentService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { tap, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { of, forkJoin } from 'rxjs';
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
  @Input() resourceName: any;
  @Output() changeStage = new EventEmitter <any> ();
  @Output() publishButtonStatus = new EventEmitter <any> ();

  public questionList = [];
  public selectedQuestionId: any;
  public questionReadApiDetails: any = {};
  public questionMetaData: any;
  public refresh = true;
  public showLoader = true;
  public enableRoleChange = false;
  public showSuccessModal =  false;
  public publishInProgress = false;
  public publishedResourceId: any;
  public questionSelectionStatus: any;
  public existingContentVersionKey = '';
  selectedAll: any;
  initialized: boolean;
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
    if (this.enableRoleChange) {
      this.initialized = false; // it should be false before fetch
      this.fetchQuestionWithRole();
    }
    if((this.selectedAttributes.currentRole=== 'REVIEWER') || (this.selectedAttributes.currentRole === 'PUBLISHER')){
      this.selectedAttributes['showMode'] = 'previewPlayer';
    } else {
      this.selectedAttributes['showMode'] = 'editorForm';
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
            'category': this.selectedAttributes.questionType === 'curiosity' ? 'CuriosityQuestion' : this.selectedAttributes.questionType.toUpperCase(),
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
    let apiRequest;
    apiRequest = [this.publicDataService.post(req).pipe(tap(data => this.showLoader = false))];
    if (this.role.currentRole === "PUBLISHER") {
      delete req.data.request.filters.createdBy;
      req.data.request.filters.status = ['Live'];
      if (this.selectedAttributes.resourceIdentifier) {
        // tslint:disable-next-line:max-line-length
        apiRequest = [this.publicDataService.post(req).pipe(tap(data => this.showLoader = false)), this.fetchExistingResource(this.selectedAttributes.resourceIdentifier)];
      }
    }



    forkJoin(apiRequest)
      .subscribe((res: any) => {
          this.questionList = res[0].result.items || [];
          let selectedQuestionList = [];
          if (res[1]) {
            selectedQuestionList  = _.map(_.get(res[1], 'result.content.questions'), 'identifier') || [];
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

  fetchExistingResource(contentId) {
    const request = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
    };
    return this.publicDataService.get(request).pipe(map((response) => {
      this.existingContentVersionKey = _.get(response, 'result.content.versionKey');
      return response;
    }, err => {
      console.log(err);
    }));
  }


  handleQuestionTabChange(questionId) {
    if (_.includes(this.selectedAttributes.questionList, questionId)) { return; }
    this.selectedAttributes.questionList = [];
    this.selectedAttributes.questionList.push(questionId);
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
        // min of 1sec timeOut is set, so that it should go to bottom of call stack and execute whennever the player data is available
        if (this.selectedAttributes.showMode === 'previewPlayer' && this.initialized) {
          this.showLoader = true;
          setTimeout(() => {
            this.showLoader = false;
          }, 1000);
        }
        // tslint:disable-next-line:max-line-length
        if (this.role.currentRole === 'CONTRIBUTOR' && (editorMode === 'edit' || editorMode === 'view')  && (this.selectedAttributes.showMode === 'editorForm')) {
          this.refreshEditor();
           }
           this.initialized = true;
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
      const selectedQuestion = _.find(this.questionList, {identifier : questionId});
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
    const selectedQuestion = _.find(this.questionList, {identifier : event.questionId});
    if (selectedQuestion) {
      selectedQuestion.isSelected = event.status;
    }
    this.selectedAll = this.questionList.every((question: any) => {
      return question.isSelected === true;
    });
    this.questionSelectionStatus = event.status;
  }
 public publishQuestions() {
    let selectedQuestions = _.filter(this.questionList, (question) => _.get(question, 'isSelected'));
    this.publishInProgress = true;
    this.publishButtonStatus.emit(this.publishInProgress);
    let selectedQuestionsData = _.reduce(selectedQuestions, (final, question) => {
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
                'name': this.resourceName  || `${this.questionTypeName[this.selectedAttributes.questionType]} - ${this.selectedAttributes.topic}`,
                'contentType': this.selectedAttributes.questionType === 'curiosity' ? 'CuriosityQuestionSet' : 'PracticeQuestionSet',
                'mimeType': 'application/vnd.ekstep.ecml-archive',
                'programId': this.selectedAttributes.programId,
                'program': this.selectedAttributes.program,
                'framework': this.selectedAttributes.framework,
                'board': this.selectedAttributes.board,
                'medium': [this.selectedAttributes.medium],
                'gradeLevel': [this.selectedAttributes.gradeLevel],
                'subject': [this.selectedAttributes.subject],
                'topic': [this.selectedAttributes.topic],
                'createdBy': this.userService.userid, // '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8'  || 'edce4f4f-6c82-458a-8b23-e3521859992f',
                'creator': creator,
                'questionCategories': _.uniq(_.compact(_.get(selectedQuestionsData, 'category'))),
                'editorVersion': 3,
                'code': UUID.UUID(),
                'body': JSON.stringify(theme),
                'resourceType': this.selectedAttributes.questionType === 'curiosity' ? 'Teach' : 'Practice',
                'description': `${this.questionTypeName[this.selectedAttributes.questionType]} - ${this.selectedAttributes.topic}`,
                'questions': questions,
                'author': _.join(_.uniq(_.compact(_.get(selectedQuestionsData, 'author'))), ', '),
                'attributions': _.uniq(_.compact(_.get(selectedQuestionsData, 'attributions'))),
                'unitIdentifiers': [this.selectedAttributes.textBookUnitIdentifier],
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
        this.publicDataService.post(option).subscribe((res) => {
          console.log('res ', res);
          if (res.responseCode === 'OK' && (res.result.content_id || res.result.node_id)) {
            this.publishResource(res.result.content_id || res.result.node_id);
          }
        }, error => {
          this.publishInProgress = false;
          this.publishButtonStatus.emit(this.publishInProgress);
          this.toasterService.error(_.get(error, 'error.params.errmsg') || 'content creation failed');
        });
      });
    } else {
      this.publishInProgress = false;
      this.publishButtonStatus.emit(this.publishInProgress);
      this.toasterService.error('Please select some questions to Publish');
    }
  }

  public updateQuestions() {
    let selectedQuestions = _.filter(this.questionList, (question) => _.get(question, 'isSelected'));
    this.publishInProgress = true;
    this.publishButtonStatus.emit(this.publishInProgress);
    let selectedQuestionsData = _.reduce(selectedQuestions, (final, question) => {
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
    const versionKey = this.getContentVersion(this.selectedAttributes.resourceIdentifier);

    forkJoin([updateBody, versionKey]).subscribe((response: any) => {
      const existingContentVersionKey = _.get(response[1], 'content.versionKey');
      const options = {
        url: `private/content/v3/update/${this.selectedAttributes.resourceIdentifier}`,
        data : {
          'request': {
            'content': {
              questions: questions,
              body: JSON.stringify(response[0]),
              versionKey: existingContentVersionKey,
              'author': _.join(_.uniq(_.compact(_.get(selectedQuestionsData, 'author'))), ', '),
              'attributions': _.uniq(_.compact(_.get(selectedQuestionsData, 'attributions'))),
              // tslint:disable-next-line:max-line-length
              name: this.resourceName  || `${this.questionTypeName[this.selectedAttributes.questionType]} - ${this.selectedAttributes.topic}`
            }
          }
        }
      };
      this.publicDataService.patch(options).subscribe((res) => {
        if (res.responseCode === 'OK' && (res.result.content_id || res.result.node_id)) {
          this.publishResource(res.result.content_id || res.result.node_id);
        }
      }, error => {
        this.publishInProgress = false;
        this.publishButtonStatus.emit(this.publishInProgress);
        this.toasterService.error(_.get(error, 'error.params.errmsg') || 'content update failed');
      });
    });
    } else {
      this.publishInProgress = false;
      this.publishButtonStatus.emit(this.publishInProgress);
      this.toasterService.error('Please select some questions to Publish');
    }
  }

  getContentVersion(contentId) {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}?mode=edit&fields=versionKey,createdBy`
    };
    return this.publicDataService.get(req).pipe(
      map(res => {
        return _.get(res, 'result');
      }, err => {
        console.log(err);
        this.toasterService.error(_.get(err, 'error.params.errmsg') || 'content update failed');
      })
    );
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
    this.contentService.post(optionVal).subscribe(response => {
      this.publishedResourceId = response.result.content_id || response.result.node_id  || '';
      // tslint:disable-next-line:max-line-length
      this.updateHierarchyObj(contentId, this.resourceName  || `${this.questionTypeName[this.selectedAttributes.questionType]} - ${this.selectedAttributes.topic}`);

    }, (err) => {
      this.publishInProgress = false;
      this.publishButtonStatus.emit(this.publishInProgress);
      this.toasterService.error(_.get(err, 'error.params.errmsg') || 'content publish failed');
    });
  }

  updateHierarchyObj(contentId, name) {
    const index = _.indexOf(_.keys(this.selectedAttributes.hierarchyObj.hierarchy), this.selectedAttributes.textBookUnitIdentifier);
    if (index >= 0) {
      this.selectedAttributes.hierarchyObj.hierarchy[this.selectedAttributes.textBookUnitIdentifier].children.push(contentId);
      if (!_.has(this.selectedAttributes.hierarchyObj.hierarchy, contentId)) {
        this.selectedAttributes.hierarchyObj.hierarchy[contentId] = {
          'name': name,
          'contentType': this.selectedAttributes.questionType === 'curiosity' ? 'CuriosityQuestionSet' : 'PracticeQuestionSet',
          'children': [],
          'root': false
        };
      }
    }
    const requestBody = {
      'request': {
        'data': {
          'nodesModified': {},
          'hierarchy': this.selectedAttributes.hierarchyObj.hierarchy,
          'lastUpdatedBy': this.userService.userid
        }
      }
    };
    const req = {
      url: `private/content/v3/hierarchy/update`,
      data: requestBody
    };
    this.publicDataService.patch(req).subscribe((res) => {
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
}
