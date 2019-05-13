import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { McqForm } from './../../class/McqForm';
import {  ConfigService, IUserData, IUserProfile, ToasterService  } from '@sunbird/shared';
import { UserService, ActionService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';

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
  showForm = false;
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
    if (this.questionMetaData.data) {
      const { question, responseDeclaration, template_id,
        learningOutcome, qlevel, bloomsLevel, max_score } = this.questionMetaData.data;
      const options = _.map(this.questionMetaData.data.options, option => ({body: option.value.body}));
      this.mcqForm = new McqForm(question, options, template_id, _.get(responseDeclaration, 'responseValue.correct_response.value'),
        learningOutcome[0], qlevel, bloomsLevel[0], max_score);
    } else {
      this.mcqForm = new McqForm('', [], '1', '1');
    }
    this.showForm = true;
  }
  ngOnInit() {
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
      console.log('questionMetaData ', this.questionMetaData);
    if (this.questionMetaData.mode === 'create') {
      this.showTemplatePopup = true;
    } else {
      this.initForm();
    }
  }
  handleTemplateSelection(event) {
    console.log(event);
    this.showTemplatePopup = false;
    if (event.type = 'submit') {
      this.templateDetails = event.template;
      console.log('templateDetails ', this.templateDetails);
      this.initForm();
    } else {
      this.questionStatus.emit({ type: 'close' });
    }
  }
  createQuestion() {
    console.log(this.mcqForm);
    const questionData = this.getHtml();
    const options = [];
    const correct_answer = this.mcqForm.answer;
    _.map(this.mcqForm.options, (opt, key) => {
      if (Number(correct_answer) === key) {
        options.push({'answer': true, value: {'type': 'text', 'body': opt.body}});
      } else {
        options.push({'answer': false, value: {'type': 'text', 'body': opt.body}});
      }
    });
    const req = {
      url: this.configService.urlConFig.URLS.ASSESSMENT.CREATE,
      data: {
        'request': {
          'assessment_item': {
            'objectType': 'AssessmentItem',
            'metadata': {
              'createdBy': this.userProfile.userId,
              'code': UUID.UUID(),
              'type': this.selectedAttributes.questionType,
              'category': this.selectedAttributes.questionType.toUpperCase(),
              'itemType': 'UNIT',
              'version': 3,
              'name': this.selectedAttributes.questionType + '_' + this.selectedAttributes.framework,
              'body': questionData.body,
              'responseDeclaration': questionData.responseDeclaration,
              'question': this.mcqForm.question,
              'options': options,
              'learningOutcome': [this.mcqForm.learningOutcome],
              'bloomsLevel': [this.mcqForm.bloomsLevel],
              'qlevel': this.mcqForm.difficultyLevel,
              'max_score': Number(this.mcqForm.max_score),
              'template_id': this.templateDetails.templateClass,
              'framework': this.selectedAttributes.framework,
              'board': this.selectedAttributes.board,
              'medium': this.selectedAttributes.medium,
              'gradeLevel': [
                this.selectedAttributes.gradeLevel
              ],
              'subject': this.selectedAttributes.subject,
              'topic': [this.selectedAttributes.topic],
              'status': 'Review'
            }
          }
        }
      }
    };
    console.log('req ', req.data);
    this.actionService.post(req).subscribe((res) => {
      console.log(res);
      this.questionStatus.emit({'status': 'success', 'identifier': res.result.node_id});
    }, error => {
      this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Question creation failed');
    });
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
    const questionBody = mcqBody.replace('{templateClass}', templateClass)
    .replace('{question}', this.mcqForm.question).replace('{optionList}', optionsBody);
    const responseDeclaration = {
      responseValue: {
        cardinality: 'single',
        type: 'index',
        'correct_response': {
          value: this.mcqForm.answer
        }
      }
    };
    return {
      body : questionBody,
      responseDeclaration: responseDeclaration
    };
    // make create api call
  }
}
