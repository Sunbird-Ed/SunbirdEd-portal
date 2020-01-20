import { Component, OnInit, Output, Input, EventEmitter, OnChanges, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { McqForm } from './../../class/McqForm';
import { ConfigService, IUserData, IUserProfile, ToasterService } from '@sunbird/shared';
import { UserService, ActionService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CbseProgramService } from '../../services';
import { Validators, FormGroup, FormArray, FormBuilder, NgForm } from '@angular/forms';
import { mcqTemplateConfig } from '../mcq-template-selection/mcq-template-data';

@Component({
  selector: 'app-mcq-creation',
  templateUrl: './mcq-creation.component.html',
  styleUrls: ['./mcq-creation.component.scss']
})
export class McqCreationComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() sessionContext: any;
  @Input() questionMetaData: any;
  @Output() questionStatus = new EventEmitter<any>();
  @Output() questionFormChangeStatus = new EventEmitter<any>();
  @Input() questionSelectionStatus: any;
  @Input() role: any;
  @ViewChild('author_names') authorName;
  @ViewChild('reuestChangeForm') ReuestChangeForm: NgForm;
  public userProfile: IUserProfile;
  public showPreview = false;
  public setCharacterLimit = 160;
  public setImageLimit = 1;
  public refresh = true;
  public mediaArr = [];
  public rejectComment: string;
  public userName: any;
  public formConfiguration: any;
  public textFields: Array<any>;
  public selectionFields: Array<any>;
  public multiSelectionFields: Array<any>;
  showTemplatePopup = false;
  showForm = false;
  templateDetails: any = {};
  initEditor = false;
  mcqForm: McqForm;
  body: any;
  optionBody: any = [];
  isEditorThrowingError: boolean;
  showFormError = false;
  isReadOnlyMode = false;
  learningOutcomeOptions = [];
  updateStatus = 'update';
  questionRejected = false;

  questionMetaForm: FormGroup;
  selectOutcomeOption = {};
  textInputArr: FormArray;
  selectionArr: FormArray;
  multiSelectionArr: FormArray;
  disableFormField: boolean;
  showRequestChangesPopup = false;
  commentCharLimit = 1000;
  componentConfiguration: any;
  videoShow: boolean;
  selectedSolutionType: string;
  selectedSolutionTypeIndex: string;
  showSolutionDropDown = true;
  videoSolutionName: string;
  videoSolutionData: any;
  solutionUUID: string;
  videoThumbnail: string;
  solutionTypes: any = [{
    'type': 'html',
    'value': 'Text+Image'
  },
  {
    'type': 'video',
    'value': 'video'
  }];
  solutionValue: string;

  constructor(public configService: ConfigService, private http: HttpClient,
    private userService: UserService, public actionService: ActionService,
    public toasterService: ToasterService, private cdr: ChangeDetectorRef, private cbseService: CbseProgramService,
    private formBuilder: FormBuilder,
    public telemetryService: TelemetryService) {
  }

  initForm() {
    if (this.questionMetaData && this.questionMetaData.data) {
      const { responseDeclaration, templateId } = this.questionMetaData.data;
      const numberOfOptions = _.get(this.sessionContext.practiceSetConfig.config, 'No of options');
      const options = _.map(this.questionMetaData.data.editorState.options, option => ({ body: option.value.body }));
      const question = this.questionMetaData.data.editorState.question;
      this.mcqForm = new McqForm({
        question, options, answer: _.get(responseDeclaration, 'responseValue.correct_response.value')
      }, { templateId, numberOfOptions });

      if (!_.isEmpty(this.questionMetaData.data.editorState.solutions)) {
        this.solutionValue = this.questionMetaData.data.editorState.solutions[0].value;
        this.selectedSolutionType = this.questionMetaData.data.editorState.solutions[0].type;
        this.solutionUUID = this.questionMetaData.data.editorState.solutions[0].id;
        this.showSolutionDropDown = false;

        if (this.selectedSolutionType === 'video') {
          const index = _.findIndex(this.questionMetaData.data.media, (o) => {
             return o.type === 'video';
          });
          this.videoSolutionName = this.questionMetaData.data.media[index].name;
          this.videoThumbnail = this.questionMetaData.data.media[index].thumbnail;
        }

      }
      if (this.questionMetaData.data.media) {
        this.mediaArr = this.questionMetaData.data.media;
      }

    } else {
      this.mcqForm = new McqForm({ question: '', options: [] }, {});
    }
    this.showForm = true;
  }

  ngOnInit() {
    this.userName = this.setUserName();
    this.solutionUUID = UUID.UUID();
    this.isReadOnlyMode = this.sessionContext.isReadOnlyMode;
  }

  ngAfterViewInit() {
    if (this.isReadOnlyMode) {
      const windowData: any = window;
      const el = document.getElementsByClassName('ckeditor-tool__solution__body');
      for (let i = 0; i < el.length; i++) {
        windowData.com.wiris.js.JsPluginViewer.parseElement(el[i], true, () => {});
      }
    }
  }

  ngOnChanges() {
    this.componentConfiguration = _.get(this.sessionContext, 'practiceSetConfig');
    this.rejectComment = '';
    if (this.questionMetaData && this.questionMetaData.data && this.questionMetaData.data.rejectComment) {
      this.rejectComment = this.questionMetaData.data.rejectComment;
    }
    if (this.questionMetaData && this.questionMetaData.data.templateId === 'NA') {
      this.showTemplatePopup = true;
    } else {
      this.initForm();
      this.manageFormConfiguration();
    }
  }

  handleTemplateSelection(event) {
    this.showTemplatePopup = false;
    if (event.type === 'submit') {
      this.questionMetaData.data.templateId = event.template.templateClass;
      this.initForm();
      this.manageFormConfiguration();
    } else {
      this.questionStatus.emit({ type: 'close' });
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
  videoDataOutput(event) {
    this.videoShow = false;
    this.videoSolutionData = event;
    this.videoSolutionName = event.name;
    this.solutionValue = event.identifier;
    this.videoThumbnail = event.thumbnail;
    const videoMedia: any = {};
    videoMedia.id = event.identifier;
    videoMedia.src = event.downloadUrl;
    videoMedia.type = 'video';
    videoMedia.assetId = event.identifier;
    videoMedia.name = event.name;
    videoMedia.thumbnail = this.videoThumbnail;
    this.mediaArr.push(videoMedia);
    this.showSolutionDropDown = false;
  }
  selectSolutionType(data: any) {
    const index = _.findIndex(this.solutionTypes, (sol: any) => {
      return sol.value === data;
    });
    this.selectedSolutionType = this.solutionTypes[index].type;
    if (this.selectedSolutionType === 'video') {
      const showVideo = true;
      this.videoShow = showVideo;
    } else {
      this.showSolutionDropDown = false;
    }
  }
  deleteSolution() {
    this.showSolutionDropDown = true;
    this.selectedSolutionType = '';
    this.solutionValue = '';
  }

  handleReviewrStatus(event) {
    this.updateQuestion([{ key: 'status', value: event.status }, { key: 'rejectComment', value: event.rejectComment }]);
  }
  handleSubmit(formControl) {
    const optionValid = _.find(this.mcqForm.options, option =>
      (option.body === undefined || option.body === '' || option.length > this.setCharacterLimit));
    if (formControl.invalid || optionValid || !this.mcqForm.answer || [undefined, ''].includes(this.mcqForm.question)) {
      this.showFormError = true;
      this.showPreview = false;
      this.markFormGroupTouched(this.questionMetaForm);
      return;
    } else {
      if (this.questionMetaData.mode !== 'create') {
        this.updateQuestion();
      }
    }
  }
  handleEditorError(event) {
    this.isEditorThrowingError = event;
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

  /**
   * @param optionalParams  {Array of Objects }  -Key and Value to add in metadata
   */
  updateQuestion(optionalParams?: Array<{}>) {
    forkJoin([this.getConvertedLatex(this.mcqForm.question), ...this.mcqForm.options.map(option => this.getConvertedLatex(option.body))])
      .subscribe((res) => {
        this.body = res[0]; // question with latex
        this.optionBody = res.slice(1).map((option, i) => { // options with latex
          return { body: res[i + 1] };
        });
        const questionData = this.getHtml(this.body, this.optionBody);
        const correct_answer = this.mcqForm.answer;
        const options = _.map(this.mcqForm.options, (opt, key) => {
          if (Number(correct_answer) === key) {
            return { 'answer': true, value: { 'type': 'text', 'body': opt.body } };
          } else {
            return { 'answer': false, value: { 'type': 'text', 'body': opt.body } };
          }
        });

        let metadata = {
          'code': UUID.UUID(),
          'category': this.sessionContext.questionType.toUpperCase(),
          'templateId': this.mcqForm.templateId,
          'name': this.sessionContext.questionType + '_' + this.sessionContext.framework,
          'body': questionData.body,
          'editorState' : {
            'question': this.mcqForm.question,
            'options': options
          },
          'options': options,
          'responseDeclaration': questionData.responseDeclaration,
          // 'qlevel': this.mcqForm.difficultyLevel,
          'maxScore': 1, // Number(this.mcqForm.maxScore),
          'status': 'Draft',
          'media': this.mediaArr,
          'type': 'mcq',
        };

        let solutionObj: any;
        if (!_.isUndefined(this.selectedSolutionType) && !_.isEmpty(this.selectedSolutionType)) {
          solutionObj = {};
          solutionObj.id = this.solutionUUID;
          solutionObj.type = this.selectedSolutionType;
          solutionObj.value = this.solutionValue;
          metadata.editorState['solutions'] = [solutionObj];
          metadata['solutions'] = [solutionObj];
        }

        const formValues = {};
        _.map(this.questionMetaForm.value, (value, key) => { _.map(value, (obj) => { _.assign(formValues, obj); }); });
        // tslint:disable-next-line:max-line-length
        metadata = _.pickBy(_.assign(metadata, formValues), _.identity);

        const req = {
          url: this.configService.urlConFig.URLS.ASSESSMENT.UPDATE + '/' + this.questionMetaData.data.identifier,
          data: {
            'request': {
              'assessment_item': {
                'objectType': 'AssessmentItem',
                'metadata': metadata
              }
            }
          }
        };

        if (optionalParams) {
          _.forEach(optionalParams, (param) => {
            req.data.request.assessment_item.metadata[param.key] = param.value;
            if (param.key === 'status') {
              this.updateStatus = param.value;
            }
            if (param.key === 'rejectComment' && param.value !== '') {
              this.questionRejected = true;
            }
          });
        } else {
          req.data.request.assessment_item.metadata['rejectComment'] = '';
        }

        if (_.isUndefined(this.solutionValue) || _.isEmpty(this.solutionValue)) {
          req.data.request.assessment_item.metadata['solutions'] = '';
        }

        this.actionService.patch(req).pipe(catchError(err => {
          const errInfo = { errorMsg: 'MCQ Question updation failed' };
          return throwError(this.cbseService.apiErrorHandling(err, errInfo));
        })).subscribe((apiRes) => {
          if (this.updateStatus === 'Live') {
            this.toasterService.success('Question Accepted');
          } else if (this.updateStatus === 'Draft' && this.questionRejected) {
            this.toasterService.success('Question Rejected');
          }
          this.questionStatus.emit({ 'status': 'success', 'type': this.updateStatus, 'identifier': apiRes.result.node_id });
        });
      });
  }

  getHtml(question, options) {
    const { mcqBody, optionTemplate } = mcqTemplateConfig;
    const optionsBody = _.map(options, data => optionTemplate.replace('{option}', data.body)) // passion option which has latex
      .map((data, index) => data.replace('{value}', index)).join('');
    const questionBody = mcqBody.replace('{templateClass}', this.mcqForm.templateId)
      .replace('{question}', question).replace('{optionList}', optionsBody); // passion question which has latex
    const responseDeclaration = {
      responseValue: {
        cardinality: 'single',
        type: 'integer',
        'correct_response': {
          value: this.mcqForm.answer
        }
      }
    };
    return {
      body: questionBody,
      responseDeclaration: responseDeclaration,
    };
  }

  getMedia(media) {
    if (media) {
      const value = _.find(this.mediaArr, ob => {
        return ob.id === media.id;
      });
      if (value === undefined) {
        this.mediaArr.push(media);
      }
    }
  }
  private refreshEditor() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
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
      this.formConfiguration = this.componentConfiguration.config.formConfiguration;
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
      this.onFormValueChange();
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

  requestChanges() {
    if (this.ReuestChangeForm.value.rejectComment) {
      this.handleReviewrStatus({ 'status' : 'Draft', 'rejectComment':  this.ReuestChangeForm.value.rejectComment});
      this.showRequestChangesPopup = false;
      this.ReuestChangeForm.reset();
    }
  }

  onFormValueChange(isQuestionChanged?: boolean) {
    if (isQuestionChanged) {
      this.questionFormChangeStatus.emit({'status': false});
      return false;
    }

    this.questionMetaForm.valueChanges.subscribe(() => {
      this.questionFormChangeStatus.emit({'status': false});
    });
  }

}
