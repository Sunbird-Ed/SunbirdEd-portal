import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { McqForm } from './../../class/McqForm';
import { ConfigService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-mcq-creation',
  templateUrl: './mcq-creation.component.html',
  styleUrls: ['./mcq-creation.component.css']
})
export class McqCreationComponent implements OnInit {

  @Input() selectedAttributes: any;
  @Input() questionMetaData: any;
  @Output() questionStatus = new EventEmitter<any>();
  showTemplatePopup = false;
  templateDetails: any = {};
  initEditor = false;
  mcqForm: McqForm;
  constructor(public configService: ConfigService) {
  }
  initForm() {
    this.mcqForm = new McqForm('', [], '1', '1');
  }
  ngOnInit() {
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
      this.initForm();
    } else {
      this.questionStatus.emit({ type: 'close' });
    }
  }
  createQuestion() {
    console.log(this.mcqForm);
    this.getHtml();
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
    const mcqHtml = mcqBody.replace('{templateClass}', templateClass)
    .replace('{question}', this.mcqForm.question).replace('{optionList}', optionsBody);
    const responseDeclaration = {
      responseValue: {
        cardinality: 'single',
        type: '',
        'correct_response': {
          value: this.mcqForm.answer
        }
      }
    };
    // make create api call
  }
}
