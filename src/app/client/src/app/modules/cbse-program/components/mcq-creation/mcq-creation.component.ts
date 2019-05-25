import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, OnChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { McqForm } from './../../class/McqForm';
import {  ConfigService, IUserData, IUserProfile, ToasterService  } from '@sunbird/shared';
import { UserService, ActionService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-mcq-creation',
  templateUrl: './mcq-creation.component.html',
  styleUrls: ['./mcq-creation.component.css']
})
export class McqCreationComponent implements OnInit {
  @Input() selectedAttributes: any;
  @Input() questionMetaData: any;
  @Output() questionStatus = new EventEmitter<any>();
  @ViewChild('mcqFormControl') private mcqFormControl;
  showTemplatePopup = false;
  showForm = false;
  templateDetails: any = {};
  initEditor = false;
  mcqForm: McqForm;
  body: any;
  optionBody: any = [];
  isEditorThrowingError: boolean;
  showFormError = false;
  public showPreview = false;
  public previewData: any;
  public setCharacterLimit = 160;
  public setImageLimit = 1;
  public refresh = true;
  public mediaArr = [];
  learningOutcomeOptions = [];
  bloomsLevelOptions = ['remember', 'understand', 'apply', 'analyse', 'evaluate', 'create'];
  constructor( public configService: ConfigService, private http: HttpClient, private userService: UserService,
    public actionService: ActionService, public toasterService: ToasterService, private cdr: ChangeDetectorRef) {
  }
  initForm() {
    if (this.questionMetaData.data) {
      const { question, responseDeclaration, templateId, learningOutcome, bloomsLevel } = this.questionMetaData.data;
      const options = _.map(this.questionMetaData.data.options, option => ({body: option.value.body}));
      this.mcqForm = new McqForm({ question, options, answer: _.get(responseDeclaration, 'responseValue.correct_response.value'),
        learningOutcome: (learningOutcome && learningOutcome[0] ||  ''),
        bloomsLevel: bloomsLevel[0]}, {templateId});
      if (this.questionMetaData.data.media) {
        this.mediaArr = this.questionMetaData.data.media;
      }
    } else {
      this.mcqForm = new McqForm({question: '', options: []}, {});
    }
    this.showForm = true;
  }
  ngOnInit() {
    if (this.selectedAttributes.bloomsLevel) {
      this.bloomsLevelOptions = this.selectedAttributes.bloomsLevel;
    }
    const topicTerm =  _.find(this.selectedAttributes.topicList, { name: this.selectedAttributes.topic });
    if (topicTerm.associations) {
      this.learningOutcomeOptions = topicTerm.associations;
    }
    if (this.questionMetaData.mode === 'create') {
      this.showTemplatePopup = true;
    } else {
      this.initForm();
    }
  }
  handleTemplateSelection(event) {
    this.showTemplatePopup = false;
    if (event.type === 'submit') {
      this.templateDetails = event.template;
      this.initForm();
    } else {
      this.questionStatus.emit({ type: 'close' });
    }
  }
  handleSubmit(formControl) {
    const optionValid = _.find(this.mcqForm.options, option =>
      (option.body === undefined || option.body === '' || option.length > this.setCharacterLimit));
    if (formControl.invalid || optionValid || !this.mcqForm.answer || [undefined, ''].includes(this.mcqForm.question)) {
      this.showFormError = true;
      return;
    }
    if (this.questionMetaData.mode === 'create') {
      this.createQuestion();
    } else {
      this.updateQuestion();
    }
  }
  handleEditorError(event) {
    this.isEditorThrowingError = event;
  }
  buttonTypeHandler(event) {
    let optionSvgBody;
    if (event === 'preview') {
      this.showPreview = true;
      forkJoin([this.getConvertedSVG(this.mcqForm.question), ...this.mcqForm.options.map(option => this.getConvertedSVG(option.body))])
      .subscribe((res) => {
        // this.body = res[0]; // question with latex
        optionSvgBody =  res.slice(1).map((option, i) => { // options with latex
            return {body: res[i + 1]};
        });
        this.previewData = {
          data: this.getHtml(res[0], optionSvgBody),
          type: this.selectedAttributes.questionType
        };
      });
    } else if (event === 'edit') {
      this.refreshEditor();
      this.showPreview = false;
    }  else {
      this.handleSubmit(this.mcqFormControl);
    }
  }
  getConvertedLatex(body) {
    const getLatex = (encodedMath) => {
      return this.http.get('https://www.wiris.net/demo/editor/mathml2latex?mml=' + encodedMath, {
        responseType : 'text'
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
  updateQuestion() {
    forkJoin([this.getConvertedLatex(this.mcqForm.question), ...this.mcqForm.options.map(option => this.getConvertedLatex(option.body))])
      .subscribe((res) => {
        this.body = res[0]; // question with latex
        this.optionBody =  res.slice(1).map((option, i) => { // options with latex
          return {body: res[i + 1]};
      });

        const questionData = this.getHtml(this.body, this.optionBody);
        const correct_answer = this.mcqForm.answer;
        const options = _.map(this.mcqForm.options, (opt, key) => {
          if (Number(correct_answer) === key) {
            return {'answer': true, value: {'type': 'text', 'body': opt.body}};
          } else {
            return {'answer': false, value: {'type': 'text', 'body': opt.body}};
          }
        });
        const req = {
          url: this.configService.urlConFig.URLS.ASSESSMENT.UPDATE + '/' + this.questionMetaData.data.identifier,
          data: {
            'request': {
              'assessment_item': {
                'objectType': 'AssessmentItem',
                'metadata': {
                  'code': UUID.UUID(),
                  'category': this.selectedAttributes.questionType.toUpperCase(),
                  'templateId': this.questionMetaData.data.templateId,
                  'name': this.selectedAttributes.questionType + '_' + this.selectedAttributes.framework,
                  'body': questionData.body,
                  'responseDeclaration': questionData.responseDeclaration,
                  'question': this.mcqForm.question,
                  'options': options,
                  'learningOutcome': this.mcqForm.learningOutcome ? [this.mcqForm.learningOutcome] : [],
                  'bloomsLevel': [this.mcqForm.bloomsLevel],
                  // 'qlevel': this.mcqForm.difficultyLevel,
                  'maxScore': 1, // Number(this.mcqForm.maxScore),
                  'status': 'Review',
                  'media': this.mediaArr
                }
              }
            }
          }
        };
        this.actionService.patch(req).subscribe((res) => {
          this.questionStatus.emit({'status': 'success', 'type': 'update', 'identifier': res.result.node_id});
        }, error => {
          this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Question creation failed');
        });
      });
  }
  createQuestion() {
    forkJoin([this.getConvertedLatex(this.mcqForm.question), ...this.mcqForm.options.map(option => this.getConvertedLatex(option.body))])
      .subscribe((res) => {
        this.body = res[0]; // question with latex
        this.optionBody =  res.slice(1).map((option, i) => { // options with latex
          return {body: res[i + 1]};
       });
        console.log(this.mcqForm);
        const questionData = this.getHtml(this.body, this.optionBody);
        const correct_answer = this.mcqForm.answer;
        const options = _.map(this.mcqForm.options, (opt, key) => {
          if (Number(correct_answer) === key) {
            return {'answer': true, value: {'type': 'text', 'body': opt.body}};
          } else {
            return {'answer': false, value: {'type': 'text', 'body': opt.body}};
          }
        });
        const req = {
          url: this.configService.urlConFig.URLS.ASSESSMENT.CREATE,
          data: {
            'request': {
              'assessment_item': {
                'objectType': 'AssessmentItem',
                'metadata': {
                  'createdBy': this.userService.userid,
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
                  'learningOutcome': this.mcqForm.learningOutcome ? [this.mcqForm.learningOutcome] : [],
                  'bloomsLevel': [this.mcqForm.bloomsLevel],
                  // 'qlevel': this.mcqForm.difficultyLevel,
                  'maxScore': 1, // Number(this.mcqForm.maxScore),
                  'templateId': this.templateDetails.templateClass,
                  'programId': this.selectedAttributes.programId,
                  'program': this.selectedAttributes.program,
                  'channel': this.selectedAttributes.channel,
                  'framework': this.selectedAttributes.framework,
                  'board': this.selectedAttributes.board,
                  'medium': this.selectedAttributes.medium,
                  'gradeLevel': [ this.selectedAttributes.gradeLevel],
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
        console.log('req ', req.data);
        this.actionService.post(req).subscribe((res) => {
          console.log(res);
          this.questionStatus.emit({'status': 'success', 'type': 'create',  'identifier': res.result.node_id});
        }, error => {
          this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Question creation failed');
        });
      });
  }

  getHtml(question, options) {
    const { mcqBody, optionTemplate } = this.configService.editorConfig.QUESTION_EDITOR;
    const optionsBody = _.map(options, data => optionTemplate.replace('{option}', data.body)) // passion option which has latex
      .map((data, index) => data.replace('{value}', index)).join('');
    let templateClass;
    if (this.questionMetaData.mode === 'create') {
      templateClass =  this.templateDetails.templateClass;
    } else {
      templateClass = this.questionMetaData.data.templateId; // TODO: need to be verified
    }
    const questionBody = mcqBody.replace('{templateClass}', templateClass)
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
      body : questionBody,
      responseDeclaration: responseDeclaration
    };
  }

  getMedia(media) {
    if (media) {
      const value = _.find(this.mediaArr, ob => {
        return ob.id === media.id;
      });
      if (value === undefined){
        this.mediaArr.push(media);
      }
    }
  }
  private refreshEditor() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
}
