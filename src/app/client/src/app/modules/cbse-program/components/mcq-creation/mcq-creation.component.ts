import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { McqForm } from './../../class/McqForm';
import {  ConfigService, IUserData, IUserProfile, ToasterService  } from '@sunbird/shared';
import { UserService, ActionService } from '@sunbird/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-mcq-creation',
  templateUrl: './mcq-creation.component.html',
  styleUrls: ['./mcq-creation.component.css']
})
export class McqCreationComponent implements OnInit {
  public userProfile: IUserProfile;
  @Input() selectedAttributes: any;
  @Input() questionMetaData: any;
  @Output() questionStatus = new EventEmitter<any>();
  showTemplatePopup = false;
  templateDetails: any = {};
  initEditor = false;
  mcqForm: McqForm;
  questionBody;
  showFormError = false;
  learningOutcomeOptions = ['remember', 'understand', 'apply', 'analyse', 'evaluate', 'create'];
  bloomsLevelOptions = ['remember', 'understand', 'apply', 'analyse', 'evaluate', 'create'];
  private toasterService: ToasterService;
  constructor(
    public configService: ConfigService,
    private userService: UserService,
    public actionService: ActionService,
    toasterService: ToasterService,
    ) {
      this.userService = userService;
      this.toasterService = toasterService;
  }
  initForm() {
    this.mcqForm = new McqForm('', [], '1', '1', undefined, undefined, undefined, undefined);
  }
  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    if (this.questionMetaData.mode === 'create') {
      this.showTemplatePopup = true;
    } else {
      this.initForm();
    }
  }
  handleTemplateSelection(event) {
    console.log(event);
    if (event.type === 'submit') {
      this.templateDetails = event.template;
      this.showTemplatePopup = false;
      console.log('templateDetails ', this.templateDetails);
      this.initForm();
    } else {
      this.questionStatus.emit({ type: 'close' });
    }
  }
  createQuestion($event, formControl) {
    console.log(this.mcqForm, formControl);
    if (formControl.invalid) {
      this.showFormError = true;
      return;
    }
    this.getHtml();
    const req = {
      url: this.configService.urlConFig.URLS.ASSESSMENT.CREATE,
      data: {
        'request': {
          'assessment_item': {
            'objectType': 'AssessmentItem',
            'metadata': {
              'createdBy': this.userProfile.userId,
              'code': this.selectedAttributes.questionType,
              'type': this.selectedAttributes.questionType,
              'category': this.selectedAttributes.questionType.toUpperCase(),
              'itemType': 'UNIT',
              'version': 3,
              'name': this.selectedAttributes.questionType + '_' + this.selectedAttributes.framework,
              'body': this.questionBody,
              'question': this.mcqForm.question,
              'options': this.mcqForm.options,
              'learningOutcome': [],
              'bloomsLevel': [],
              'qlevel': 'Easy',
              'max_score': 2,
              'template_id': this.templateDetails.templateClass,
              'framework': this.selectedAttributes.framework,
              'board': this.selectedAttributes.board,
              'medium': this.selectedAttributes.medium,
              'gradeLevel': [
                this.selectedAttributes.gradeLevel
              ],
              'subject': this.selectedAttributes.subject,
              'topic': [this.selectedAttributes.topic],
              'status': 'Draft'
            }
          }
        }
      }
    };
    console.log('req ', req.data);
    // this.actionService.post(req).subscribe((res) => {
    //   if (res.responseCode !== 'OK') {
    //     console.log('Please try again');
    //     this.questionStatus.emit({'status': 'failed'});
    //   } else {
    //     this.questionStatus.emit({'status': 'success', 'identifier': res.result.node_id});
    //     // this.question_editor.destroy();
    //     // this.answer_editor.destroy();
    //   }
    // }, error => {
    //   this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Question creation failed');
    // });
  }

  getHtml() {
    const { mcqBody, optionTemplate } = this.configService.editorConfig.QUESTION_EDITOR;
    const optionsBody = _.map(this.mcqForm.options, data => optionTemplate.replace('{option}', data.body)).join('');
    let templateClass;
    if (this.questionMetaData.mode === 'create') {
      templateClass =  this.templateDetails.templateClass;
    } else {
      templateClass = this.questionMetaData.templateClass; // TODO: need to be verified
    }
    this.questionBody = mcqBody.replace('{templateClass}', templateClass)
    .replace('{question}', this.mcqForm.question).replace('{optionList}', optionsBody);
    const responseDeclaration = {
      responseValue: {
        cardinality: 'single',
        type: 'integer',
        'correct_response': {
          value: this.mcqForm.answer
        }
      }
    };
    console.log('mcqHtml ', this.questionBody);
    console.log('responseDeclaration ', responseDeclaration);
    // make create api call
  }
}
