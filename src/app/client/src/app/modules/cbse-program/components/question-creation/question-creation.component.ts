import {
  Component, OnInit, AfterViewInit, Output, Input, EventEmitter,
  OnChanges, AfterViewChecked, ChangeDetectorRef, ElementRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, IUserData, IUserProfile, ToasterService } from '@sunbird/shared';
import { PublicDataService, UserService, ActionService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash-es';
import { CbseProgramService } from '../../services';

@Component({
  selector: 'app-question-creation',
  templateUrl: './question-creation.component.html',
  styleUrls: ['./question-creation.component.scss']
})
export class QuestionCreationComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {
  public userProfile: IUserProfile;
  public publicDataService: PublicDataService;
  private toasterService: ToasterService;
  public resourceService: ResourceService;
  public editorConfig: any;
  questionMetaForm: FormGroup;
  enableSubmitBtn = false;
  public isAssetBrowserReadOnly = false;
  initialized = false;
  public isQuestionFocused: boolean;
  public isAnswerFocused: boolean;
  public showPreview = false;
  public refresh = true;
  private prevShowPreview = true;
  public previewData: any;
  public mediaArr = [];
  showFormError = false;
  public userName: any;
  @Input() tabIndex: any;
  @Input() questionMetaData: any;
  @Input() questionSelectionStatus: any;
  @Output() questionStatus = new EventEmitter<any>();
  @Input() sessionContext: any;
  @Input() role: any;
  @ViewChild('author_names') authorName;
  @Output() statusEmitter = new EventEmitter<string>();
  @Output() questionQueueStatus = new EventEmitter<any>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private configService: ConfigService,
    private http: HttpClient,
    private cbseService: CbseProgramService,
    publicDataService: PublicDataService,
    toasterService: ToasterService,
    resourceService: ResourceService, public telemetryService: TelemetryService,
    public actionService: ActionService, private cdr: ChangeDetectorRef
  ) {
    this.userService = userService;
    this.configService = configService;
    this.publicDataService = publicDataService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
  }
  solution: any;
  question: any;
  editor: any;
  editorState: any;
  solutionUUID: string;
  body: any;
  myAssets = [];
  allImages = [];
  showImagePicker: boolean;
  showImageUploadModal: boolean;
  showErrorMsg: boolean;
  errorMsg: string;
  topicName: string;
  learningOutcomeOptions = [];
  updateStatus = 'update';
  public rejectComment: any;
  bloomsLevelOptions = ['remember', 'understand', 'apply', 'analyse', 'evaluate', 'create'];
  isReadOnlyMode = false;
  ngOnInit() {
    this.initialized = true;
    this.editorConfig = { 'mode': 'create' };
    this.question = '';
    this.editorState = {
      solutions: ''
    };
    this.solutionUUID = UUID.UUID();
    if (this.sessionContext.bloomsLevel) {
      this.bloomsLevelOptions = this.sessionContext.bloomsLevel;
    }
    const topicTerm = _.find(this.sessionContext.topicList, { name: this.sessionContext.topic });
    if (topicTerm && topicTerm.associations) {
      this.learningOutcomeOptions = topicTerm.associations;
    }
    this.initializeFormFields();
    if (this.questionMetaData && this.questionMetaData.data) {
      this.question = this.questionMetaData.data.editorState.question;
      this.editorState.solutions = this.questionMetaData.data.editorState.solutions[0].value;
      this.solutionUUID = this.questionMetaData.data.editorState.solutions[0].id;
      if (this.questionMetaData.data.learningOutcome && this.questionMetaForm.controls.learningOutcome) {
        this.questionMetaForm.controls.learningOutcome.setValue(this.questionMetaData.data.learningOutcome[0]);
      }
      this.questionMetaForm.controls.bloomsLevel.setValue(this.questionMetaData.data.bloomsLevel[0]);
      // this.questionMetaForm.controls.qlevel.setValue(this.questionMetaData.data.qlevel);
      // this.questionMetaForm.controls.maxScore.setValue(this.questionMetaData.data.maxScore);
      this.mediaArr = this.questionMetaData.data.media || [];
    }
    if (this.role.currentRole === 'REVIEWER' || this.role.currentRole === 'PUBLISHER') {
      this.showPreview = true;
      // this.buttonTypeHandler('preview');
    }
    this.userName = this.setUserName();
    this.isReadOnlyMode = this.sessionContext.isReadOnlyMode;
  }

  setUserName() {
    let userName = '';
    if (this.userService.userProfile.firstName) {
      userName = this.userService.userProfile.firstName;
    }
    if (this.userService.userProfile.lastName) {
      userName += (' ' + this.userService.userProfile.lastName);
    }
    return userName;
  }

  ngAfterViewInit() {
    this.initializeDropdown();
    // tslint:disable-next-line:max-line-length
    // if( this.sessionContext.currentRole === 'CONTRIBUTOR' && this.questionMetaData.mode === 'create') this.authorName.nativeElement.value =  this.userName;
    // tslint:disable-next-line:max-line-length
    // if( this.sessionContext.currentRole === 'CONTRIBUTOR' && this.questionMetaData.mode === 'edit') this.authorName.nativeElement.value = this.questionMetaData.data.authorNames;
  }
  ngOnChanges() {
    if (this.initialized) {
      this.previewData = this.questionMetaData;
      if (this.questionMetaData.mode === 'edit') {
        // this.isEditorReadOnly(false);
      } else {
        // this.isEditorReadOnly(true);
      }
      this.editorConfig = { 'mode': 'create' };
      this.question = '';
      this.editorState.solutions = '';
      if (this.questionMetaData && this.questionMetaData.data) {
        this.question = this.questionMetaData.data.editorState.question;
        this.editorState.solutions = this.questionMetaData.data.editorState.solutions[0].value;
        this.solutionUUID = this.questionMetaData.data.editorState.solutions[0].id;
        if (this.questionMetaData.data.learningOutcome && this.questionMetaForm.controls.learningOutcome) {
          this.questionMetaForm.controls.learningOutcome.setValue(this.questionMetaData.data.learningOutcome[0]);
        }
        this.questionMetaForm.controls.bloomsLevel.setValue(this.questionMetaData.data.bloomsLevel[0]);
        // this.questionMetaForm.controls.qlevel.setValue(this.questionMetaData.data.qlevel);
        // this.questionMetaForm.controls.maxScore.setValue(this.questionMetaData.data.maxScore);
      } else {
        this.questionMetaForm.reset();
      }
    }
    if (this.role.currentRole === 'REVIEWER' || this.role.currentRole === 'PUBLISHER') {
      this.showPreview = true;
      // this.buttonTypeHandler('preview')
    } else if ((this.sessionContext.role === 'CONTRIBUTOR') && (this.sessionContext.showMode = 'editorForm')) {
      this.showPreview = false;
    }
    if (this.questionMetaData && this.questionMetaData.mode === 'edit' && this.questionMetaData.data.status === 'Reject' &&
      this.questionMetaData.data.rejectComment) {
      this.rejectComment = this.questionMetaData.data.rejectComment;
    }
  }
  ngAfterViewChecked() {
    if (!this.showPreview && this.prevShowPreview) {
      this.initializeDropdown();
    }
    this.prevShowPreview = this.showPreview;
  }
  initializeDropdown() {
    (<any>$('.ui.checkbox')).checkbox();
  }
  initializeFormFields() {
    if (this.learningOutcomeOptions.length > 0) {
      this.questionMetaForm = new FormGroup({
        learningOutcome: new FormControl(''),
        bloomsLevel: new FormControl(''),
      });
    } else {
      this.questionMetaForm = new FormGroup({
        bloomsLevel: new FormControl('')
      });
    }
  }
  handleQuestionSelectionStatus(event) {
    this.questionQueueStatus.emit(event);
  }
  enableSubmitButton() {
    this.questionMetaForm.valueChanges.subscribe(val => {
      this.enableSubmitBtn = (this.questionMetaForm.status === 'VALID');
    });
  }
  validateAllFormFields(questionMetaForm: FormGroup) {
    Object.keys(questionMetaForm.controls).forEach(field => {
      const control = questionMetaForm.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({
          onlySelf: true
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  handleReviewrStatus(event) {
    this.updateQuestion([{ key: 'status', value: event.status }, { key: 'rejectComment', value: event.rejectComment }]);
  }
  buttonTypeHandler(event) {
    if (event === 'preview') {
      this.sessionContext.showMode = 'previewPlayer';
      // call createQuestion with param true to get the local question data
      if (this.sessionContext.currentRole === 'CONTRIBUTOR') {
        this.createQuestion(true);
      }
    } else if (event === 'edit') {
      this.sessionContext.showMode = 'editorForm';
      this.refreshEditor();
      this.showPreview = false;
    } else {
      this.handleSubmit(this.questionMetaForm);
    }
  }
  handleSubmit(questionMetaForm) {
    if (this.questionMetaForm.valid && this.question !== ''
      && this.editorState.solutions !== '') {
      this.showFormError = false;
      if (this.questionMetaData.mode === 'create') {
        this.createQuestion();
      } else {
        this.updateQuestion();
      }
    } else {
      this.showFormError = true;
      this.showPreview = false;
      this.validateAllFormFields(this.questionMetaForm);
    }
  }
  /**
   * @param forPreview  {boolean}
   * - set param forPreview to true for local question preview
   */
  createQuestion(forPreview?: boolean) {
    forkJoin([this.getConvertedLatex(this.question), this.getConvertedLatex(this.editorState.solutions)])
      .subscribe((res) => {
        this.body = res[0];
        this.solution = res[1];
        let creator = this.userService.userProfile.firstName;
        let authorName;
        if (!_.isEmpty(this.userService.userProfile.lastName)) {
          creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
        }
        if (this.role.currentRole === 'CONTRIBUTOR') {
          authorName = (this.authorName.nativeElement.value === '') ? this.userName : this.authorName.nativeElement.value;
        }
        const req = {
          url: this.configService.urlConFig.URLS.ASSESSMENT.CREATE,
          data: {
            'request': {
              'assessment_item': {
                'objectType': 'AssessmentItem',
                'metadata': {
                  'createdBy': this.userService.userid,
                  'creator': creator,
                  'organisation': this.sessionContext.onBoardSchool ? [this.sessionContext.onBoardSchool] : [],
                  'code': UUID.UUID(),
                  'type': 'reference',
                  // tslint:disable-next-line:max-line-length
                  'category': this.sessionContext.questionType === 'curiosity' ? 'CuriosityQuestion' : this.sessionContext.questionType.toUpperCase(),
                  'itemType': 'UNIT',
                  'version': 3,
                  'name': this.sessionContext.questionType + '_' + this.sessionContext.framework,
                  'editorState': {
                    'question': this.question,
                    'solutions': [
                      {
                        'id': this.solutionUUID,
                        'value': this.editorState.solutions
                      }
                    ]
                  },
                  'body': this.body,
                  "responseDeclaration": {
                    "responseValue": {
                      "cardinality": "single",
                      "type": "string",
                      "correct_response": {
                        "value": this.solution
                      }
                    }
                  },
                  'learningOutcome': this.questionMetaForm.value.learningOutcome ? [this.questionMetaForm.value.learningOutcome] : [],
                  'bloomsLevel': [this.questionMetaForm.value.bloomsLevel],
                  // 'qlevel': this.questionMetaForm.value.qlevel,
                  // 'maxScore': Number(this.questionMetaForm.value.maxScore),
                  'templateId': 'NA',
                  'programId': this.sessionContext.programId,
                  'program': this.sessionContext.program,
                  'channel': this.sessionContext.channel,
                  // 'framework': this.sessionContext.framework,
                  // 'board': this.sessionContext.board,
                  // 'medium': this.sessionContext.medium,
                  // 'gradeLevel': [
                  //   this.sessionContext.gradeLevel
                  // ],
                  // 'subject': this.sessionContext.subject,
                  // 'topic': [this.sessionContext.topic],
                  'status': 'Review',
                  'media': this.mediaArr,
                  'qumlVersion': 1.0,
                  'textBookUnitIdentifier': this.sessionContext.textBookUnitIdentifier,
                  'author': authorName
                }
              }
            }
          }
        };
        /**
         * - If it is a local preview don't create question.
         * - for local preview only question body required with all other parameter to create Ecml.
         */
        if (!forPreview) {
          this.actionService.post(req).pipe(catchError(err => {
            const errInfo = { errorMsg: 'Question creation failed' };
            return throwError(this.cbseService.apiErrorHandling(err, errInfo));
          })).subscribe((apiRes) => {
            this.questionStatus.emit({ 'status': 'success', 'type': 'create', 'identifier': apiRes.result.node_id });
          });
        } else {
          this.sessionContext.previewQuestionData = {
            result: {
              assessment_item: req.data.request.assessment_item.metadata
            }
          };
          this.previewData = this.questionMetaData;
          // Initialize preview player, Once all the data is attached
          this.showPreview = true;
        }
      });
  }
  /**
   * @param optionalParams  {Array of Objects }  -Key and Value to add in metadata
   */

  updateQuestion(optionalParams?: Array<{}>) {
    forkJoin([this.getConvertedLatex(this.question), this.getConvertedLatex(this.editorState.solutions)])
      .subscribe((res) => {
        this.body = res[0];
        this.solution = res[1];
        const option = {
          url: this.configService.urlConFig.URLS.ASSESSMENT.UPDATE + '/' + this.questionMetaData.data.identifier,
          data: {
            'request': {
              'assessment_item': {
                'objectType': 'AssessmentItem',
                'metadata': {
                  'category': this.sessionContext.questionType === 'curiosity' ? 'CuriosityQuestion' :
                    this.sessionContext.questionType.toUpperCase(),
                    'editorState': {
                      'question': this.question,
                      'solutions': [
                        {
                          'id': this.solutionUUID,
                          'value': this.editorState.solutions
                        }
                      ]
                    },
                    'body': this.body,
                    "responseDeclaration": {
                      "responseValue": {
                        "cardinality": "single",
                        "type": "string",
                        "correct_response": {
                          "value": this.solution
                        }
                      }
                    },
                  'learningOutcome': this.questionMetaForm.value.learningOutcome ? [this.questionMetaForm.value.learningOutcome] : [],
                  'bloomsLevel': [this.questionMetaForm.value.bloomsLevel],
                  // 'qlevel': this.questionMetaForm.value.qlevel,
                  // 'maxScore': Number(this.questionMetaForm.value.maxScore),
                  'status': 'Draft',
                  'name': this.sessionContext.questionType + '_' + this.sessionContext.framework,
                  'type': 'reference',
                  'code': UUID.UUID(),
                  'template_id': 'NA',
                  'media': this.mediaArr
                }
              }
            }
          }
        };
        if (this.sessionContext.currentRole === 'CONTRIBUTOR') {
          const authorName = (this.authorName.nativeElement.value === '') ? this.userName : this.authorName.nativeElement.value;
          option.data.request.assessment_item.metadata['author'] = authorName;
        }
        if (optionalParams) {
          _.forEach(optionalParams, (param) => {
            option.data.request.assessment_item.metadata[param.key] = param.value;
            if (param.key === 'status') {
              this.updateStatus = param.value;
            }
          });
        }
        this.actionService.patch(option).pipe(catchError(err => {
          const errInfo = { errorMsg: 'Question updation failed' };
          return throwError(this.cbseService.apiErrorHandling(err, errInfo));
        })).subscribe((apiRes) => {
          if (this.updateStatus === 'Live') {
            this.toasterService.success('Question Accepted');
          } else if (this.updateStatus === 'Reject') {
            this.toasterService.success('Question Rejected');
          }
          this.questionStatus.emit({ 'status': 'success', 'type': this.updateStatus, 'identifier': this.questionMetaData.data.identifier });
        });
      });
  }

  editorDataHandler(event, type) {
    if (type === 'question') {
      this.question = event.body;
    } else {
      this.editorState.solutions = event.body;
    }
    if (event.mediaobj) {
      const media = event.mediaobj;
      const value = _.find(this.mediaArr, ob => {
        return ob.id === media.id;
      });
      if (value === undefined) {
        this.mediaArr.push(event.mediaobj);
      }
    }
  }

  getConvertedLatex(body) {
    const getLatex = (encodedMath) => {
      return this.http.get('https://www.wiris.net/demo/editor/mathml2latex?mml=' + encodedMath, {
        responseType: 'text'
      });
    };
    let latexBody;
    const isMathML = body.match(/((<math("[^"]*"|[^\/">])*)(.*?)<\/math>)/gi);
    if (isMathML && isMathML.length > 0) {
      latexBody = isMathML.map(math => {
        const encodedMath = encodeURIComponent(math);
        return getLatex(encodedMath);
      });
    }
    if (latexBody) {
      return forkJoin(latexBody).pipe(
        map((res) => {
          _.forEach(res, (latex, i) => {
            body = latex.includes('Error') ? body : body.replace(isMathML[i], '<span class="mathText">' + latex + '</span>');
          });
          return body;
        })
      );
    } else {
      return of(body);
    }
  }

  getConvertedSVG(body) {
    const getLatex = (encodedMath) => {
      return this.http.get('https://www.wiris.net/demo/editor/render?mml=' + encodedMath + '&backgroundColor=%23fff&format=svg', {
        responseType: 'text'
      });
    };
    let latexBody;
    const isMathML = body.match(/((<math("[^"]*"|[^\/">])*)(.*?)<\/math>)/gi);
    if (isMathML && isMathML.length > 0) {
      latexBody = isMathML.map(math => {
        const encodedMath = encodeURIComponent(math);
        return getLatex(encodedMath);
      });
    }
    if (latexBody) {
      return forkJoin(latexBody).pipe(
        map((res) => {
          _.forEach(res, (latex, i) => {
            body = latex.includes('Error') ? body : body.replace(isMathML[i], latex);
          });
          return body;
        })
      );
    } else {
      return of(body);
    }
  }


  private refreshEditor() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
}
