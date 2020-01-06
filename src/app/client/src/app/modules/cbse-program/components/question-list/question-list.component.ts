import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { UserService, PublicDataService, ActionService, ContentService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { tap, map, catchError, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { of, forkJoin, throwError } from 'rxjs';
import { FormGroup, FormArray, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { CbseProgramService } from '../../services';
import { ItemsetService } from '../../services/itemset/itemset.service';
import { HelperService } from '../../services/helper.service';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { ProgramStageService } from '../../../program/services';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})

export class QuestionListComponent implements OnInit {
  @ViewChild('questionCreationChild') questionCreationChild: ElementRef;
  @Output() changeStage = new EventEmitter<any>();
  @Output() publishButtonStatus = new EventEmitter<any>();
  @Input() practiceQuestionSetComponentInput: any;
  @ViewChild('FormControl') FormControl: NgForm;
  @Output() uploadedContentMeta = new EventEmitter<any>();

  public sessionContext: any;
  public role: any;
  public templateDetails: any;
  public actions: any;
  public questionList: Array<any> = [];
  public selectedQuestionId: any;
  public questionReadApiDetails: any = {};
  public resourceDetails: any = {};
  public resourceStatus: string;
  public questionMetaData: any;
  public refresh = true;
  public showLoader = true;
  public showSuccessModal = false;
  public showReviewModal = false;
  public showRequestChangesPopup = false;
  public showDeleteQuestionModal = false;
  public disableSubmitBtn = true;
  public showPublishModal = false;
  public publishInProgress = false;
  public publishedResourceId: any;
  public existingContentVersionKey = '';
  public resourceTitleLimit = 100;
  public itemSetIdentifier: string;
  public deleteAssessmentItemIdentifie: string;
  public showTextArea = false;
  public resourceName: string;
  visibility: any;
  @ViewChild('resourceTtlTextarea') resourceTtlTextarea: ElementRef;

  constructor(
    private configService: ConfigService, private userService: UserService,
    private publicDataService: PublicDataService, public actionService: ActionService,
    private cdr: ChangeDetectorRef, public toasterService: ToasterService,
    public telemetryService: TelemetryService, private fb: FormBuilder,
    private cbseService: CbseProgramService, public contentService: ContentService,
    private itemsetService: ItemsetService, private helperService: HelperService,
    private resourceService: ResourceService, private collectionHierarchyService: CollectionHierarchyService,
    public programStageService: ProgramStageService) { }

  ngOnInit() {
    this.sessionContext = _.get(this.practiceQuestionSetComponentInput, 'sessionContext');
    this.role = _.get(this.practiceQuestionSetComponentInput, 'role');
    this.templateDetails = _.get(this.practiceQuestionSetComponentInput, 'templateDetails');
    this.actions = _.get(this.practiceQuestionSetComponentInput, 'programContext.config.actions');
    this.sessionContext.resourceIdentifier = _.get(this.practiceQuestionSetComponentInput, 'contentIdentifier');
    this.sessionContext.questionType = this.templateDetails.questionCategories[0];
    this.sessionContext.textBookUnitIdentifier = _.get(this.practiceQuestionSetComponentInput, 'unitIdentifier');
    this.getContentMetadata(this.sessionContext.resourceIdentifier);
  }

  getContentMetadata(contentId: string) {
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
    };
    this.contentService.get(option).pipe(map(data => data.result.content), catchError(err => {
      const errInfo = { errorMsg: 'Unable to read the Content, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      this.resourceDetails = res;
      this.existingContentVersionKey = res.versionKey;
      this.resourceStatus = _.get(this.resourceDetails, 'status');
      this.sessionContext.resourceStatus = this.resourceStatus;
      this.resourceName = this.resourceDetails.name || this.templateDetails.metadata.name;
      // this.resourceStatus = 'Review';
      if (!this.resourceDetails.itemSets) {
        this.createDefaultQuestionAndItemset();
      } else {
        const itemSet = JSON.parse(this.resourceDetails.itemSets);
        if (itemSet[0].identifier) {
          this.itemSetIdentifier = itemSet[0].identifier;
        }
        this.fetchQuestionList();
      }
      this.handleActionButtons();
    });
  }

  handleActionButtons() {
    this.visibility = {};
    // tslint:disable-next-line:max-line-length
    this.visibility['showCreateQuestion'] = (_.includes(this.actions.showCreateQuestion.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Draft');
    // tslint:disable-next-line:max-line-length
    this.visibility['showDeleteQuestion'] = (_.includes(this.actions.showDeleteQuestion.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Draft' && this.questionList.length > 1);
    // tslint:disable-next-line:max-line-length
    this.visibility['showRequestChanges'] = (_.includes(this.actions.showRequestChanges.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Review');
    // tslint:disable-next-line:max-line-length
    this.visibility['showPublish'] = (_.includes(this.actions.showPublish.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Review');
    // tslint:disable-next-line:max-line-length
    this.visibility['showSubmit'] = (_.includes(this.actions.showSubmit.roles, this.sessionContext.currentRoleId)  && this.resourceStatus === 'Draft');
    // tslint:disable-next-line:max-line-length
    this.visibility['showSave'] = (_.includes(this.actions.showSave.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Draft');
     // tslint:disable-next-line:max-line-length
    this.visibility['showEdit'] = (_.includes(this.actions.showEdit.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Draft');
  }

  get isPublishBtnDisable(): boolean {
    return _.find(this.questionList, (question) => question.rejectComment && question.rejectComment !== '');
  }

  public createDefaultQuestionAndItemset() {
    this.createDefaultAssessmentItem().pipe(
      map(data => {
        this.selectedQuestionId = _.get(data, 'result.node_id');
        return this.selectedQuestionId;
    }),
    mergeMap(questionId => this.createItemSet(questionId).pipe(
      map(res => {
        this.itemSetIdentifier = _.get(res, 'result.identifier');
        return this.itemSetIdentifier;
    }),
    mergeMap(() => {
      const reqBody = {
        'content': {
          'versionKey': this.existingContentVersionKey,
          'itemSets': [
           {
             'identifier': this.itemSetIdentifier
           }
         ]
       }
      };
      return this.updateContent(reqBody, this.sessionContext.resourceIdentifier)
    }))))
    .subscribe(() => {
      this.handleQuestionTabChange(this.selectedQuestionId);
    });
  }

  private fetchQuestionList() {
    this.itemsetService.readItemset(this.itemSetIdentifier).pipe(
      map(response => {
        const questionList = _.get(response, 'result.itemset.items');
        const questionIds = _.map(questionList, (question => _.get(question, 'identifier')));
        return questionIds;
    }),
    mergeMap(questionIds => {
      const req = {
        url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
        data: {
          'request': {
            'filters': {
              'identifier': questionIds,
              'status': ['Live', 'Review', 'Draft']
            },
            'sort_by': { 'createdOn': 'desc' },
            'limit': 20
          }
        }
      };
      return this.contentService.post(req).pipe(map(data => {
          this.questionList = _.get(data, 'result.items');
          return this.questionList;
      }));
    }))
    .subscribe(() => {
          this.selectedQuestionId = this.questionList[0].identifier;
          this.handleQuestionTabChange(this.selectedQuestionId);
          this.handleActionButtons();
    });
  }

  handleQuestionTabChange(questionId, isUpdate: boolean = false) {
    if (_.includes(this.sessionContext.questionList, questionId) && !isUpdate) { return; }
    this.sessionContext.questionList = [];
    this.sessionContext.questionList.push(questionId);
    this.selectedQuestionId = questionId;
    this.showLoader = true;
    this.getQuestionDetails(questionId).pipe(tap(data => this.showLoader = false))
      .subscribe((assessment_item) => {
        this.questionMetaData = {
          mode: 'edit',
          data: assessment_item
        };
        if (this.resourceStatus === 'Draft' || this.resourceStatus === 'Rejected') {
          this.sessionContext.isReadOnlyMode = false;
        } else {
          this.sessionContext.isReadOnlyMode = true;
        }
        if (assessment_item && assessment_item.rejectComment === '') {
          const index = _.findIndex(this.questionList, {identifier: questionId});
          this.questionList[index].rejectComment = assessment_item.rejectComment;
          this.questionList[index].status = assessment_item.status;
        }
        // tslint:disable-next-line:max-line-length
        if (this.role.currentRole === 'CONTRIBUTOR') {
          this.refreshEditor();
        }
        if (isUpdate) {  this.saveContent(); }
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
    }),
      catchError(err => {
        const errInfo = { errorMsg: 'Fetching Question details failed' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      }));
  }

  public createNewQuestion(): void {
    this.createDefaultAssessmentItem().pipe(
      map((data: any) => {
        const questionId = data.result.node_id;
        const questionsIds: any = _.map(this.questionList, (question) => ({ 'identifier': _.get(question, 'identifier') }));
        questionsIds.push({'identifier': questionId});
        const requestParams = {
          'name': this.resourceName,
          'items': questionsIds
        };
        this.selectedQuestionId = questionId;
        return requestParams;
    }),
    mergeMap(requestParams => this.updateItemset(requestParams, this.itemSetIdentifier)))
    .subscribe((contentRes: any) => {
      this.handleQuestionTabChange(this.selectedQuestionId);
    });
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
      if (event.type === 'update' || event.type === 'Draft' || event.type === 'Live') {
        delete this.questionReadApiDetails[event.identifier];
        this.handleQuestionTabChange(this.selectedQuestionId,  true);
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

  saveContent() {
    this.publishInProgress = true;
    this.publishButtonStatus.emit(this.publishInProgress);
    const selectedQuestionsData = _.reduce(this.questionList, (final, question) => {
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
          url: `${this.configService.urlConFig.URLS.CONTENT.UPDATE}/${this.sessionContext.resourceIdentifier}`,
          data: {
            'request': {
              'content': {
                questions: questions,
                body: JSON.stringify(response[0]),
                versionKey: existingContentVersionKey,
                'author': _.join(_.uniq(_.compact(_.get(selectedQuestionsData, 'author'))), ', '),
                'attributions': _.uniq(_.compact(_.get(selectedQuestionsData, 'attributions'))),
                // tslint:disable-next-line:max-line-length
                name: this.resourceName,
                'programId': this.sessionContext.programId,
                'program': this.sessionContext.program,
                'plugins': [{
                  identifier: 'org.sunbird.questionunit.quml',
                  semanticVersion: '1.1'
                }],
                'questionCategories': _.uniq(_.compact(_.get(selectedQuestionsData, 'category'))),
                'topic': this.sessionContext.topic ? [this.sessionContext.topic] : [] ,
                'editorVersion': 3,
                'unitIdentifiers': [this.sessionContext.textBookUnitIdentifier],
                'rejectComment' : ''
              }
            }
          }
        };
        this.actionService.patch(options).pipe(catchError(err => {
          const errInfo = { errorMsg: 'Resource updation failed' };
          return throwError(this.cbseService.apiErrorHandling(err, errInfo));
        }))
        .subscribe((res) => {
            if (res.responseCode === 'OK' && (res.result.content_id || res.result.node_id)) {
              this.disableSubmitBtn = false;
              this.toasterService.success('Question and content updated successfully');
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

  sendForReview() {
    const reviewItemSet = this.itemsetService.reviewItemset(this.itemSetIdentifier);
    const reviewContent = this.helperService.reviewContent(this.sessionContext.resourceIdentifier);
    forkJoin([reviewItemSet, reviewContent]).subscribe((res: any) => {
      const contentId = res[1].result.content_id;
      if (this.sessionContext.collection && this.sessionContext.textBookUnitIdentifier) {
        // tslint:disable-next-line:max-line-length
        this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.sessionContext.textBookUnitIdentifier, contentId )
        .subscribe((data) => {
          this.disableSubmitBtn = true;
          this.toasterService.success(this.resourceService.messages.smsg.m0061);
          this.programStageService.removeLastStage();
          this.uploadedContentMeta.emit({
            contentId: contentId
          });
        }, (err) => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0099);
        });
      }
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0099);
     });
  }

  publichContent() {
    this.helperService.publishContent(this.sessionContext.resourceIdentifier, this.userService.userProfile.userId)
      .subscribe(res => {
      const contentId = res.result.content_id;
      this.showPublishModal = false;
      if (this.sessionContext.collection && this.sessionContext.textBookUnitIdentifier) {
        // tslint:disable-next-line:max-line-length
        this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.sessionContext.textBookUnitIdentifier, contentId )
        .subscribe((data) => {
          this.toasterService.success(this.resourceService.messages.smsg.m0063);
          this.programStageService.removeLastStage();
          this.uploadedContentMeta.emit({
            contentId: contentId
          });
        });
      }
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m00101);
    });
  }

  requestChanges() {
    if (this.FormControl.value.rejectComment) {
      this.helperService.submitRequestChanges(this.sessionContext.resourceIdentifier, this.FormControl.value.rejectComment)
      .subscribe(res => {
        this.showRequestChangesPopup = false;
        const contentId =  res.result.node_id || res.result.content_id;
        if (this.sessionContext.collection && this.sessionContext.textBookUnitIdentifier) {
          this.collectionHierarchyService.addResourceToHierarchy(
            this.sessionContext.collection, this.sessionContext.textBookUnitIdentifier, contentId
          )
          .subscribe((data) => {
            this.toasterService.success(this.resourceService.messages.smsg.m0062);
            this.programStageService.removeLastStage();
            this.uploadedContentMeta.emit({
              contentId: contentId
            });
          }, (err) => {
            this.toasterService.error(this.resourceService.messages.fmsg.m00100);
          });
        }
      }, (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m00100);
      });
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

  public dismissPublishModal() {
    setTimeout(() => this.changeStage.emit('prev'), 0);
  }

  openDeleteQuestionModal(identifier: string) {
    this.deleteAssessmentItemIdentifie = identifier;
    console.log(this.deleteAssessmentItemIdentifie);
    this.showDeleteQuestionModal = true;
  }

  deleteQuestion() {
    const request = {
      url: `${this.configService.urlConFig.URLS.ASSESSMENT.RETIRE}/${this.deleteAssessmentItemIdentifie}` 
    };

    this.actionService.delete(request).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Question deletion failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }))
    .subscribe((res) => {
      if (res.responseCode === 'OK') {
        this.showDeleteQuestionModal = false;
        this.toasterService.success('Question deleted successfully');
        this.fetchQuestionList();
      }
    }, error => {
      console.log(error);
    });
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

  public createDefaultAssessmentItem() {
    const request = {
      url: `${this.configService.urlConFig.URLS.ASSESSMENT.CREATE}`,
      data: {
        'request': {
          'assessment_item': {
            'objectType': 'AssessmentItem',
            'metadata': {
              'itemType': 'UNIT',
              'code': UUID.UUID(),
              'subject': this.sessionContext.subject[0],
              'qumlVersion': 1.0,
              'qlevel': 'MEDIUM',
              'channel': this.sessionContext.channel,
              'organisation': this.sessionContext.onBoardSchool ? [this.sessionContext.onBoardSchool] : [],
              'language': [
                'English'
              ],
              'program': this.sessionContext.program,
              'medium': this.sessionContext.medium[0],
              'templateId': 'NA',
              'type': 'reference',
              'gradeLevel': this.sessionContext.gradeLevel,
              'creator': this.getUserName(),
              'version': 3,
              'framework': this.sessionContext.framework,
              'name': this.sessionContext.questionType + '_' + this.sessionContext.framework,
              'topic': this.sessionContext.topic ? this.sessionContext.topic : [],
               // tslint:disable-next-line:max-line-length
              'category': this.sessionContext.questionType === 'curiosity' ? 'CuriosityQuestion' : this.sessionContext.questionType.toUpperCase(),
              'programId': this.sessionContext.programId,
              'board': this.sessionContext.board,
              'editorState': {
                'question': '',
                'solutions': [
                  {
                    'id': UUID.UUID(),
                    'value': ''
                  }
                ]
              },
              'body': '',
              'solutions': [],
              'media': [],
              'author' : this.getUserName()
            }
          }
        }
      }
    };

    return this.actionService.post(request).pipe(map((response) => {
      this.questionList.push(_.assign(request.data.request.assessment_item.metadata, {'identifier': _.get(response, 'result.node_id')}));
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = { errorMsg: 'Default question creation failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }

  public createItemSet(questionId) {
    const reqBody = {
      'code': UUID.UUID(),
      'name': this.resourceName,
      'description': this.resourceName,
      'language': [
          'English'
      ],
      'owner': this.getUserName(),
      'items': [
        {
          'identifier': questionId
        }
      ]
    };

    return this.itemsetService.createItemset(reqBody).pipe(map((response) => {
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = { errorMsg: 'Itemsets creation failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));

  }

  public updateItemset(requestBody, identifier) {
    const reqBody = requestBody;
    return this.itemsetService.updateItemset(reqBody, identifier).pipe(map((response) => {
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = { errorMsg: 'Content updation failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }

  public updateContent(reqBody, contentId) {
    return this.helperService.updateContent(reqBody, contentId).pipe(map((response) => {
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = { errorMsg: 'Content updation failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }

  getUserName() {
    let creator = this.userService.userProfile.firstName;
    if (!_.isEmpty(this.userService.userProfile.lastName)) {
      creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
    }
    return creator;
  }

}
