import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray  } from '@angular/forms';
import { McqForm } from './../../class/McqForm';
@Component({
  selector: 'app-mcq-creation',
  templateUrl: './mcq-creation.component.html',
  styleUrls: ['./mcq-creation.component.css']
})
export class McqCreationComponent implements OnInit, AfterViewInit {

  @Input() selectedAttributes: any;
  @Input() questionMetaData: any;
  @Output() questionStatus = new EventEmitter<any>();
  showTemplatePopup = false;
  templateDetails = {};
  question_editor;
  initEditor = false;
  isQuestionFocused = true;
  showImagePicker = false;
  mcqForm: McqForm;
  constructor(private fb: FormBuilder) {
    this.initForm();
  }
  initForm() {
    this.mcqForm = new McqForm('', [], '1', '1');
    console.log('mcqForm', this.mcqForm);
  }
  ngOnInit() {
    console.log(this.questionMetaData);
    if (this.questionMetaData.mode === 'create') {
      this.showTemplatePopup = true;
    } else {
      setTimeout(() => this.initializeEditors(), 50);
    }
  }
  ngAfterViewInit() {

  }
  initializeEditors() {

  }
  handleTemplateSelection(event) {
    console.log(event);
    if (event.type = 'submit') {
      this.templateDetails = event.template;
      setTimeout(() => this.initializeEditors(), 50);
    } else {
      this.questionStatus.emit({ type: 'close' });
    }
    this.showTemplatePopup = false;
  }
  createQuestion() {
    console.log(this.mcqForm);
  }
}
