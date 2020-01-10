import {
  Component, OnInit, AfterViewInit, Output, Input, EventEmitter,
  OnChanges, AfterViewChecked, ChangeDetectorRef, ElementRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, IUserData, IUserProfile, ToasterService } from '@sunbird/shared';
import { PublicDataService, UserService, ActionService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { Validators, FormGroup, FormControl, NgForm, FormArray, FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { map, catchError, first } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash-es';
import { CbseProgramService } from '../../services';
import { HelperService } from '../../services/helper.service';

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
  public isAssetBrowserReadOnly = false;
  public isQuestionFocused: boolean;
  public isAnswerFocused: boolean;
  public showPreview = false;
  public refresh = true;
  private prevShowPreview = true;
  public previewData: any;
  public mediaArr = [];
  public userName: any;
  public showRequestChangesPopup = false;
  public formConfiguration: any;
  public textFields: Array<any>;
  public selectionFields: Array<any>;
  public multiSelectionFields: Array<any>;
  public rejectComment: string;
  @Input() tabIndex: any;
  @Input() questionMetaData: any;
  @Input() questionSelectionStatus: any;
  @Output() questionStatus = new EventEmitter<any>();
  @Input() sessionContext: any;
  @Input() role: any;
  @ViewChild('author_names') authorName;
  @Output() statusEmitter = new EventEmitter<string>();
  @Output() questionQueueStatus = new EventEmitter<any>();
  @ViewChild('reuestChangeForm') ReuestChangeForm: NgForm;
  questionMetaForm: FormGroup;
  enableSubmitBtn = false;
  initialized = false;
  showFormError = false;
  editor: any;
  editorState: any;
  solutionUUID: string;
  myAssets = [];
  allImages = [];
  showImagePicker: boolean;
  showImageUploadModal: boolean;
  showErrorMsg: boolean;
  errorMsg: string;
  topicName: string;
  learningOutcomeOptions = [];
  licencesOptions = [];
  updateStatus = 'update';
  bloomsLevelOptions = ['remember', 'understand', 'apply', 'analyse', 'evaluate', 'create'];
  isReadOnlyMode = false;
  questionRejected = false;
  commentCharLimit = 1000;

  selectOutcomeOption = {};
  textInputArr: FormArray;
  selectionArr: FormArray;
  multiSelectionArr: FormArray;
  formValues: any;
  contentMetaData;
  disableFormField: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private configService: ConfigService,
    private http: HttpClient,
    private cbseService: CbseProgramService,
    private formBuilder: FormBuilder,
    publicDataService: PublicDataService,
    toasterService: ToasterService,
    resourceService: ResourceService, public telemetryService: TelemetryService,
    public actionService: ActionService, private cdr: ChangeDetectorRef, private helperService: HelperService
  ) {
    this.userService = userService;
    this.configService = configService;
    this.publicDataService = publicDataService;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.initialized = true;
    this.editorConfig = { 'mode': 'create' };
    this.editorState = {
      question : '',
      answer: ''
    };
    this.solutionUUID = UUID.UUID();
    this.manageFormConfiguration();
    if (this.questionMetaData && this.questionMetaData.data) {
      this.editorState.question = this.questionMetaData.data.editorState.question;
      this.editorState.answer = this.questionMetaData.data.editorState.answer;
      // tslint:disable-next-line:max-line-length
      this.solutionUUID = this.questionMetaData.data.editorState.solutions ? this.questionMetaData.data.editorState.solutions[0].id : this.solutionUUID;
      this.mediaArr = this.questionMetaData.data.media || [];
      this.rejectComment = this.questionMetaData.data.rejectComment ? this.questionMetaData.data.rejectComment : '';
    }

    this.isReadOnlyMode = this.sessionContext.isReadOnlyMode;
    this.userName = this.setUserName();
    if (this.role.currentRole === 'REVIEWER') {
      this.isReadOnlyMode = true;
    }
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
    if (this.isReadOnlyMode) {
      const windowData: any = window;
      const el = document.getElementsByClassName('ckeditor-tool__solution__body');
      for (let i = 0; i < el.length; i++) {
        windowData.com.wiris.js.JsPluginViewer.parseElement(el[i], true, () => {});
      }
    }
  }
  ngOnChanges() {
    if (this.initialized) {
      this.previewData = this.questionMetaData;
      this.editorConfig = { 'mode': 'create' };
      this.editorState = {
        question : '',
        answer: ''
      };
      this.manageFormConfiguration();
      if (this.questionMetaData && this.questionMetaData.data) {
        this.editorState.question = this.questionMetaData.data.editorState.question;
        this.editorState.answer = this.questionMetaData.data.editorState.answer;
        // tslint:disable-next-line:max-line-length
        this.solutionUUID = this.questionMetaData.data.editorState.solutions ? this.questionMetaData.data.editorState.solutions[0].id : this.solutionUUID;
        this.rejectComment = this.questionMetaData.data.rejectComment ? this.questionMetaData.data.rejectComment : '';
      } else {
        this.questionMetaForm.reset();
      }
    }
    if (this.role.currentRole === 'REVIEWER') {
      this.isReadOnlyMode = true;
    } else if ((this.sessionContext.role === 'CONTRIBUTOR') && (this.sessionContext.resourceStatus === 'Draft')) {
      this.isReadOnlyMode = false;
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
  handleQuestionSelectionStatus(event) {
    this.questionQueueStatus.emit(event);
  }
  enableSubmitButton() {
    this.questionMetaForm.valueChanges.subscribe(val => {
      this.enableSubmitBtn = (this.questionMetaForm.status === 'VALID');
    });
  }

  handleReviewrStatus(event) {
    this.updateQuestion([{ key: 'status', value: event.status }, { key: 'rejectComment', value: event.rejectComment }]);
  }
  buttonTypeHandler(event) {
    this.updateStatus = event;
    if (event === 'preview') {
      this.showPreview = true;
    } else if (event === 'edit') {
      this.refreshEditor();
      this.showPreview = false;
    } else {
      this.handleSubmit(this.questionMetaForm);
    }
  }
  handleSubmit(questionMetaForm) {
    if (this.questionMetaForm.valid && this.editorState.question !== ''
      && this.editorState.answer !== '') {
      this.showFormError = false;
      if (this.questionMetaData.mode !== 'create') {
        this.updateQuestion();
      }
    } else {
      this.showFormError = true;
      this.showPreview = false;
      this.markFormGroupTouched(this.questionMetaForm);
    }
  }

  /**
   * @param optionalParams  {Array of Objects }  -Key and Value to add in metadata
   */

  updateQuestion(optionalParams?: Array<{}>) {
    forkJoin([this.getConvertedLatex(this.editorState.question), this.getConvertedLatex(this.editorState.answer)])
      .subscribe((res) => {
        const rendererBody = res[0];
        const rendererAnswer = res[1];
        const option = {
          url: this.configService.urlConFig.URLS.ASSESSMENT.UPDATE + '/' + this.questionMetaData.data.identifier,
          data: {
            'request': {
              'assessment_item': {
                'objectType': 'AssessmentItem',
                'metadata': {
                  // tslint:disable-next-line:max-line-length
                  'category': this.sessionContext.questionType === 'curiosity' ? 'CuriosityQuestion' : this.sessionContext.questionType.toUpperCase(),
                    'editorState': {
                      'question': this.editorState.question,
                      'answer': this.editorState.answer
                    },
                    'body': rendererBody,
                    'responseDeclaration': {
                      'responseValue': {
                        'cardinality': 'single',
                        'type': 'string',
                        'correct_response': {
                          'value': rendererAnswer
                        }
                      }
                    },
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
        this.formValues = {};
        _.map(this.questionMetaForm.value, (value, key) => { _.map(value, (obj) => { _.assign(this.formValues, obj); }); });
        // tslint:disable-next-line:max-line-length
        option.data.request.assessment_item.metadata = _.pickBy(_.assign(option.data.request.assessment_item.metadata, this.formValues), _.identity);

        if (optionalParams) {
          _.forEach(optionalParams, (param) => {
            option.data.request.assessment_item.metadata[param.key] = param.value;
            if (param.key === 'status') {
              this.updateStatus = param.value;
            }
            if (param.key === 'rejectComment' && param.value !== '') {
              this.questionRejected = true;
            }
          });
        } else {
          option.data.request.assessment_item.metadata['rejectComment'] = '';
        }
        this.actionService.patch(option).pipe(catchError(err => {
          const errInfo = { errorMsg: 'Question updation failed' };
          return throwError(this.cbseService.apiErrorHandling(err, errInfo));
        })).subscribe((apiRes) => {
          if (this.updateStatus === 'Live') {
            this.toasterService.success('Question Accepted');
          } else if (this.updateStatus === 'Draft' && this.questionRejected) {
            this.toasterService.success('Question Rejected');
          }
          this.questionStatus.emit({ 'status': 'success', 'type': this.updateStatus, 'identifier': this.questionMetaData.data.identifier });
        });
      });
  }

  editorDataHandler(event, type) {
    if (type === 'question') {
      this.editorState.question = event.body;
    } else if (type === 'answer') {
      this.editorState.answer = event.body;
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

  requestChanges() {
    if (this.ReuestChangeForm.value.rejectComment) {
      this.handleReviewrStatus({ 'status' : 'Draft', 'rejectComment':  this.ReuestChangeForm.value.rejectComment});
      this.showRequestChangesPopup = false;
      this.ReuestChangeForm.reset();
    }
  }

  manageFormConfiguration() {

    this.questionMetaForm = this.formBuilder.group({
      textInputArr: this.formBuilder.array([ ]),
      selectionArr: this.formBuilder.array([ ]),
      multiSelectionArr: this.formBuilder.array([ ])
    });

    this.selectionArr = this.questionMetaForm.get('selectionArr') as FormArray;
    this.multiSelectionArr = this.questionMetaForm.get('multiSelectionArr') as FormArray;
    this.textInputArr = this.questionMetaForm.get('textInputArr') as FormArray;

    if (this.questionMetaData) {
      // tslint:disable-next-line:max-line-length
      const compConfiguration = _.get(this.sessionContext, 'compConfiguration');
      this.formConfiguration = compConfiguration.config.formConfiguration;
      this.textFields = _.filter(this.formConfiguration, {'inputType': 'text', 'visible': true});
      this.selectionFields = _.filter(this.formConfiguration, {'inputType': 'select', 'visible': true});
      this.multiSelectionFields = _.filter(this.formConfiguration, {'inputType': 'multiselect', 'visible': true});
      // tslint:disable-next-line:max-line-length
      this.disableFormField = (this.sessionContext.currentRole === 'CONTRIBUTOR' && this.sessionContext.resourceStatus === 'Draft') ? false : true ;
      const formFields = _.map(this.formConfiguration, (formData) => {
        if (!formData.defaultValue) {
          return formData.code;
        }
        this.selectOutcomeOption[formData.code] = formData.defaultValue;
      });

      this.selectOutcomeOption['license'] = this.sessionContext.licencesOptions;
      const topicTerm = _.find(this.sessionContext.topicList, { name: this.sessionContext.topic });
      if (topicTerm && topicTerm.associations) {
        this.selectOutcomeOption['learningOutcome'] = topicTerm.associations;
      }

      _.forEach(this.selectionFields, (obj) => {
        const controlName = {};
        const code = obj.code;
        const preSavedValues = {};
        // tslint:disable-next-line:max-line-length
        preSavedValues[code] = (this.questionMetaData.data && this.questionMetaData.data[code]) ? (Array.isArray(this.questionMetaData.data[code]) ? this.questionMetaData.data[code][0] : this.questionMetaData.data[code]) : '';
        // tslint:disable-next-line:max-line-length
        obj.required ? controlName[obj.code] = [preSavedValues[code], [Validators.required]] : controlName[obj.code] = preSavedValues[code];
        this.selectionArr = this.questionMetaForm.get('selectionArr') as FormArray;
        this.selectionArr.push(this.formBuilder.group(controlName));
      });

      _.forEach(this.multiSelectionFields, (obj) => {
        const controlName = {};
        const code = obj.code;
        const preSavedValues = {};
        // tslint:disable-next-line:max-line-length
        preSavedValues[code] = (this.questionMetaData.data && this.questionMetaData.data[code] && this.questionMetaData.data[code].length) ? this.questionMetaData.data[code] : [];
        // tslint:disable-next-line:max-line-length
        obj.required ? controlName[obj.code] = [preSavedValues[code], [Validators.required]] : controlName[obj.code] = [preSavedValues[code]];
        this.multiSelectionArr = this.questionMetaForm.get('multiSelectionArr') as FormArray;
        this.multiSelectionArr.push(this.formBuilder.group(controlName));
      });

      _.forEach(this.textFields, (obj) => {
        const controlName = {};
        const code = obj.code;
        const preSavedValues = {};
        preSavedValues[code] = (this.questionMetaData.data && this.questionMetaData.data[code]) ? this.questionMetaData.data[code] : '';
        // tslint:disable-next-line:max-line-length
        obj.required ? controlName[obj.code] = [{value: preSavedValues[code], disabled: this.disableFormField}, Validators.required] : controlName[obj.code] = preSavedValues[code];
        this.textInputArr = this.questionMetaForm.get('textInputArr') as FormArray;
        this.textInputArr.push(this.formBuilder.group(controlName));
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
