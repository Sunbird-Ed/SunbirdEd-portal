import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter ,
  OnChanges, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  ConfigService, ResourceService, IUserData, IUserProfile, ToasterService  } from '@sunbird/shared';
import { PublicDataService, UserService, ActionService } from '@sunbird/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
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
  @Input() tabIndex: any;
  @Input() questionMetaData: any;
  @Output() questionStatus = new EventEmitter < any > ();
  @Input() selectedAttributes: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private configService: ConfigService,
    publicDataService: PublicDataService,
    toasterService: ToasterService,
    resourceService: ResourceService,
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
  myAssets = [];
  allImages = [];
  showImagePicker: boolean;
  showImageUploadModal: boolean;
  showErrorMsg: boolean;
  errorMsg: string;
  topicName: string;
  bloomsLevelOptions = ['remember', 'understand', 'apply', 'analyse', 'evaluate', 'create'];
  ngOnInit() {
    this.initialized = true;
    this.editorConfig = { 'mode': 'create' };
    this.initializeFormFields();
    this.question = '';
    this.solution = '';
    if (this.selectedAttributes.bloomsLevel) {
      this.bloomsLevelOptions = this.selectedAttributes.bloomsLevel;
    }
    if (this.questionMetaData.data) {
        this.question = this.questionMetaData.data.body;
        this.solution = this.questionMetaData.data.solutions && this.questionMetaData.data.solutions[0];
        this.questionMetaForm.controls.learningOutcome.setValue(this.questionMetaData.data.learningOutcome[0]);
        this.questionMetaForm.controls.bloomsLevel.setValue(this.questionMetaData.data.bloomsLevel[0]);
        // this.questionMetaForm.controls.qlevel.setValue(this.questionMetaData.data.qlevel);
        // this.questionMetaForm.controls.maxScore.setValue(this.questionMetaData.data.maxScore);
        this.mediaArr = this.questionMetaData.data.media;
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
      this.solution = '';
      if (this.questionMetaData && this.questionMetaData.data) {
       this.question = this.questionMetaData.data.body;
        this.solution = this.questionMetaData.data.solutions && this.questionMetaData.data.solutions[0];
        this.questionMetaForm.controls.learningOutcome.setValue(this.questionMetaData.data.learningOutcome[0]);
        this.questionMetaForm.controls.bloomsLevel.setValue(this.questionMetaData.data.bloomsLevel[0]);
        // this.questionMetaForm.controls.qlevel.setValue(this.questionMetaData.data.qlevel);
        // this.questionMetaForm.controls.maxScore.setValue(this.questionMetaData.data.maxScore);
      } else {
        this.questionMetaForm.reset();
      }
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
    this.questionMetaForm = new FormGroup({
      learningOutcome: new FormControl('', Validators.required),
      // qlevel: new FormControl('', [Validators.required]),
      bloomsLevel: new FormControl('', [Validators.required]),
      // maxScore: new FormControl(null, [Validators.required])
    });
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
  buttonTypeHandler(event) {
    if (event === 'preview') {
      this.showPreview = true;
      this.previewData = {
        body: this.question,
        solutions: [this.solution],
        type: this.selectedAttributes.questionType
      };
    } else if (event === 'edit') {
      this.refreshEditor();
      this.showPreview = false;
    }  else {
      this.handleSubmit(this.questionMetaForm);
    }
  }
  handleSubmit(questionMetaForm) {
    if (this.questionMetaForm.valid) {
      if (this.questionMetaData.mode === 'create') {
        this.createQuestion();
      } else {
        this.updateQuestion();
      }
    } else {
      this.validateAllFormFields(this.questionMetaForm);
    }
  }
  createQuestion() {
    const req = {
        url: this.configService.urlConFig.URLS.ASSESSMENT.CREATE,
        data: {
          'request': {
            'assessment_item': {
              'objectType': 'AssessmentItem',
              'metadata': {
                'createdBy': this.userService.userid,
                'code': UUID.UUID(),
                'type': 'reference',
                'category': this.selectedAttributes.questionType.toUpperCase(),
                'itemType': 'UNIT',
                'version': 3,
                'name': this.selectedAttributes.questionType + '_' + this.selectedAttributes.framework,
                'body': this.question,
                'solutions': [this.solution],
                'learningOutcome': [this.questionMetaForm.value.learningOutcome],
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
                'qumlVersion': 0.5
              }
            }
          }
        }
      };
      this.actionService.post(req).subscribe((res) => {
        this.questionStatus.emit({'status': 'success', 'type': 'create', 'identifier': res.result.node_id});
      }, error => {
        this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Question creation failed');
      });
  }

  updateQuestion() {
    console.log(this.questionMetaData.data.identifier);
    const option = {
      url: this.configService.urlConFig.URLS.ASSESSMENT.UPDATE + '/' + this.questionMetaData.data.identifier,
      data: {
        'request': {
          'assessment_item': {
            'objectType': 'AssessmentItem',
            'metadata': {
              'body': this.question,
              'solutions': [this.solution],
              'learningOutcome': [this.questionMetaForm.value.learningOutcome],
              'bloomsLevel': [this.questionMetaForm.value.bloomsLevel],
              // 'qlevel': this.questionMetaForm.value.qlevel,
              // 'maxScore': Number(this.questionMetaForm.value.maxScore),
              'status': 'Review',
              'name': this.selectedAttributes.questionType + '_' + this.selectedAttributes.framework,
              'code': UUID.UUID(),
              'template_id': 'NA',
              'type': 'reference',
              'media': this.mediaArr
            }
          }
        }
      }
    };
    this.actionService.patch(option).subscribe((res) => {
      this.questionStatus.emit({'status': 'success', 'type': 'update', 'identifier': this.questionMetaData.data.identifier});
      console.log('Question Update', res);
    });
  }

  editorDataHandler(event, type) {
    if (type === 'question') {
      this.question = event.body;
    } else {
      this.solution = event.body;
    }
    if (event.mediaobj) {
      const media = event.mediaobj;
      const value = _.find(this.mediaArr, ob => {
        return ob.id === media.id;
      });
      if (value === undefined){
        this.mediaArr.push(event.mediaobj);
      }
    }
  }
  private refreshEditor() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
}
