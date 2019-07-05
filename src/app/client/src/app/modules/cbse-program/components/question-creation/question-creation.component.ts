import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter ,
  OnChanges, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  ConfigService, ResourceService, IUserData, IUserProfile, ToasterService  } from '@sunbird/shared';
import { PublicDataService, UserService, ActionService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-question-creation',
  templateUrl: './question-creation.component.html',
  styleUrls: ['./question-creation.component.css']
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
  @Input() tabIndex: any;
  @Input() questionMetaData: any;
  @Output() questionStatus = new EventEmitter < any > ();
  @Input() selectedAttributes: any;
  @Input() role: any;
  @Output() statusEmitter = new EventEmitter < string > ();
  @Output() discard = new EventEmitter();
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private configService: ConfigService,
    private http: HttpClient,
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
  ngOnInit() {
    this.initialized = true;
    this.editorConfig = { 'mode': 'create' };
    this.question = '';
    this.editorState = {
      solutions: ''
    };
    if (this.selectedAttributes.bloomsLevel) {
      this.bloomsLevelOptions = this.selectedAttributes.bloomsLevel;
    }
    const topicTerm =  _.find(this.selectedAttributes.topicList, { name: this.selectedAttributes.topic });
    if (topicTerm.associations) {
      this.learningOutcomeOptions = topicTerm.associations;
    }
    this.initializeFormFields();
    if (this.questionMetaData.data) {
        this.question = this.questionMetaData.data.question;
        this.editorState.solutions = this.questionMetaData.data.editorState.solutions
               && this.questionMetaData.data.editorState.solutions[0];
        if (this.questionMetaData.data.learningOutcome) {
          this.questionMetaForm.controls.learningOutcome.setValue(this.questionMetaData.data.learningOutcome[0]);
        }
        this.questionMetaForm.controls.bloomsLevel.setValue(this.questionMetaData.data.bloomsLevel[0]);
        // this.questionMetaForm.controls.qlevel.setValue(this.questionMetaData.data.qlevel);
        // this.questionMetaForm.controls.maxScore.setValue(this.questionMetaData.data.maxScore);
        this.mediaArr = this.questionMetaData.data.media || [];
    }
    if (this.role.currentRole === 'REVIEWER' || this.role.currentRole === 'PUBLISHER') {
      this.showPreview = true;
      this.buttonTypeHandler('preview');
    }
  }

  ngAfterViewInit() {
    // this.initializeEditors();
    this.initializeDropdown();
  }
  ngOnChanges() {
    if (this.initialized) {
      if (this.questionMetaData.mode === 'edit') {
        // this.isEditorReadOnly(false);
      } else {
        // this.isEditorReadOnly(true);
      }
      this.editorConfig = { 'mode': 'create' };
      this.question = '';
      this.editorState.solutions = '';
      if (this.questionMetaData && this.questionMetaData.data) {
       this.question = this.questionMetaData.data.question;
        this.editorState.solutions = this.questionMetaData.data.solutions && this.questionMetaData.data.editorState.solutions[0];
        if (this.questionMetaData.data.learningOutcome) {
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
    } else {
      this.showPreview = false;
    }
    if (this.questionMetaData.mode === 'edit' && this.questionMetaData.data.status=== 'Reject' &&
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
    ( < any > $('.ui.checkbox')).checkbox();
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
    this.updateQuestion([{key: 'status', value: event.status}, {key: 'rejectComment', value: event.rejectComment}]);
  }
  buttonTypeHandler(event) {
    if (event === 'preview') {
      this.showPreview = true;
      forkJoin([this.getConvertedSVG(this.question), this.getConvertedSVG(this.editorState.solutions)])
        .subscribe((res) => {
          // this.body = res[0];
          // this.solution = res[1];
          this.previewData = {
            body: res[0],
            solutions: [res[1]],
            type: this.selectedAttributes.questionType
          };
        });
    } else if (event === 'edit') {
      this.refreshEditor();
      this.showPreview = false;
    } else if (event === 'discard') {
           this.discard.emit('discard');
    } else if (event === 'delete') {
      this.deleteQuestion([{key: 'status', value: 'Retired'}]);
    } else {
      this.handleSubmit(this.questionMetaForm);
    }
  }
  handleSubmit(questionMetaForm) {
    if (this.questionMetaForm.valid && this.question !== ''
    && this.editorState.solutions !== '' ) {
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
  createQuestion() {
    forkJoin([this.getConvertedLatex(this.question), this.getConvertedLatex(this.editorState.solutions)])
    .subscribe((res) => {
      this.body = res[0];
      this.solution = res[1];
      let creator = this.userService.userProfile.firstName;
      if (!_.isEmpty(this.userService.userProfile.lastName)) {
        creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
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
                'organisation': this.selectedAttributes.onBoardSchool ? [this.selectedAttributes.onBoardSchool] : [],
                'code': UUID.UUID(),
                'type': 'reference',
                'category': this.selectedAttributes.questionType.toUpperCase(),
                'itemType': 'UNIT',
                'version': 3,
                'name': this.selectedAttributes.questionType + '_' + this.selectedAttributes.framework,
                'body': this.body,
                'editorState': {
                  solutions: [this.editorState.solutions]
                },
                'question': this.question,
                'solutions': [this.solution],
                'learningOutcome': this.questionMetaForm.value.learningOutcome ? [this.questionMetaForm.value.learningOutcome] : [],
                'bloomsLevel': [this.questionMetaForm.value.bloomsLevel],
                // 'qlevel': this.questionMetaForm.value.qlevel,
                // 'maxScore': Number(this.questionMetaForm.value.maxScore),
                'templateId': 'NA',
                'programId': this.selectedAttributes.programId,
                'program': this.selectedAttributes.program,
                'channel': this.selectedAttributes.channel,
                'framework': this.selectedAttributes.framework,
                'board': this.selectedAttributes.board,
                'medium': this.selectedAttributes.medium,
                'gradeLevel': [
                  this.selectedAttributes.gradeLevel
                ],
                'subject': this.selectedAttributes.subject,
                'topic': [this.selectedAttributes.topic],
                'status': 'Review',
                'media': this.mediaArr,
                'qumlVersion': 0.5,
                'textBookUnitIdentifier':this.selectedAttributes.textBookUnitIdentifier
              }
            }
          }
        }
      };
      this.actionService.post(req).subscribe((res) => {
        this.questionStatus.emit({'status': 'success', 'type': 'create', 'identifier': res.result.node_id});
      }, error => {
        this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Question creation failed');
        const telemetryErrorData = {
          context: {
            env: 'cbse_program'
          },
          edata: {
            err: error.status.toString(),
            errtype: 'PROGRAMPORTAL',
            stacktrace: _.get(error, 'error.params.errmsg') || 'Question creation failed'
          }
        };
        this.telemetryService.error(telemetryErrorData);
      });
    });
  }
  /**
   * @param optionalParams  {Array of Objects }  -Key and Value to add in metadata
   */

  updateQuestion(optionalParams?: Array<Object>) {
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
                  'body': this.body,
                  'category': this.selectedAttributes.questionType.toUpperCase(),
                  'solutions': [this.solution],
                  'editorState': {
                    solutions: [this.editorState.solutions]
                  },
                  'question': this.question,
                  'learningOutcome': this.questionMetaForm.value.learningOutcome ? [this.questionMetaForm.value.learningOutcome] : [],
                  'bloomsLevel': [this.questionMetaForm.value.bloomsLevel],
                  // 'qlevel': this.questionMetaForm.value.qlevel,
                  // 'maxScore': Number(this.questionMetaForm.value.maxScore),
                  'status': 'Review',
                  'name': this.selectedAttributes.questionType + '_' + this.selectedAttributes.framework,
                  'type': 'reference',
                  'code': UUID.UUID(),
                  'template_id': 'NA',
                  'media': this.mediaArr
                }
              }
            }
          }
        };
        if (optionalParams) {
          _.forEach(optionalParams, (param) => {
            option.data.request.assessment_item.metadata[param.key] = param.value;
            if (param.key === 'status') {
              this.updateStatus = param.value;
            }
          });
        }
        this.actionService.patch(option).subscribe((res) => {
          if (this.updateStatus === 'Live') {
            this.toasterService.success('Question Accepted');
          } else if (this.updateStatus === 'Reject') {
            this.toasterService.success('Question Rejected');
          }
          this.questionStatus.emit({'status': 'success', 'type': this.updateStatus, 'identifier': this.questionMetaData.data.identifier});
        }, error => {
            this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Question update failed');
            const telemetryErrorData = {
              context: {
                env: 'cbse_program'
              },
              edata: {
                err: error.status.toString(),
                errtype: 'PROGRAMPORTAL',
                stacktrace: _.get(error, 'error.params.errmsg') || 'Question update failed'
              }
            };
            this.telemetryService.error(telemetryErrorData);
        });
      });
  }

  deleteQuestion(optionalParams?: Array<Object>) {
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
                  'body': this.body,
                  'category': this.selectedAttributes.questionType.toUpperCase(),
                  'solutions': [this.solution],
                  'editorState': {
                    solutions: [this.editorState.solutions]
                  },
                  'question': this.question,
                  'learningOutcome': this.questionMetaForm.value.learningOutcome ? [this.questionMetaForm.value.learningOutcome] : [],
                  'bloomsLevel': [this.questionMetaForm.value.bloomsLevel],
                  // 'qlevel': this.questionMetaForm.value.qlevel,
                  // 'maxScore': Number(this.questionMetaForm.value.maxScore),
                  'status': 'Retired',
                  'name': this.selectedAttributes.questionType + '_' + this.selectedAttributes.framework,
                  'type': 'reference',
                  'code': UUID.UUID(),
                  'template_id': 'NA',
                  'media': this.mediaArr
                }
              }
            }
          }
        };
        if (optionalParams) {
          _.forEach(optionalParams, (param) => {
            option.data.request.assessment_item.metadata[param.key] = param.value;
            if (param.key === 'status') {
              this.updateStatus = param.value;
            }
          });
        }
        this.actionService.patch(option).subscribe((res) => {
           if (this.updateStatus === 'Retired') {
            this.toasterService.success('Question Deleted Successfully');
          }
          this.questionStatus.emit({'status': 'success', 'type': this.updateStatus, 'identifier': this.questionMetaData.data.identifier});
        }, error => {
            this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Question delete/retire failed');
            const telemetryErrorData = {
              context: {
                env: 'cbse_program'
              },
              edata: {
                err: error.status.toString(),
                errtype: 'PROGRAMPORTAL',
                stacktrace: _.get(error, 'error.params.errmsg') || 'Question delete/retire failed'
              }
            };
            this.telemetryService.error(telemetryErrorData);
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
            body = latex.includes('Error') ? body : body.replace(isMathML[i], '<span class="mathText">'+latex+'</span>');
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
