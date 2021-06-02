import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import * as ClassicEditor from '@project-sunbird/ckeditor-build-classic';
import { ISummaryObject } from '../../interfaces';

@Component({
  selector: 'app-add-summary-modal',
  templateUrl: './add-summary-modal.component.html',
  styleUrls: ['./add-summary-modal.component.scss']
})
export class AddSummaryModalComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() submitButtonEvent = new EventEmitter();
  @Input() input: ISummaryObject;
  @Output() closeModalEvent = new EventEmitter();
  @ViewChild('modal', {static: false}) modal;
  @ViewChild('editor', {static: false}) public editorRef: ElementRef;
  public editorInstance: any;

  private toolbarItems = ['undo', 'redo', 'bold', 'italic', 'blockQuote', 'heading', 'link', 'numberedList', 'bulletedList', 'fontFamily',
    'fontSize', 'fontColor', 'fontBackgroundColor', 'underline', 'subscript', 'superscript', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells'];

  public summaryFormGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    ClassicEditor.create(this.editorRef.nativeElement, {
      toolbar: this.toolbarItems
    })
      .then(editor => {
        this.editorInstance = editor;
        if (this.input.summary) {
          const editorDataInput = this.input.summary
            .replace(/(<img("[^"]*"|[^\/">])*)>/gi, '$1/>')
            .replace(/(<br("[^"]*"|[^\/">])*)>/gi, '$1/>');
          this.editorInstance.setData(editorDataInput);
        }
        editor.model.document.on('change', (eventInfo, batch) => {
          this.summaryFormGroup.controls.summary.setValue(editor.getData());
        });
      })
      .catch(err => { console.error(err); });
  }

  ngOnDestroy() {
    this.closeModal();
  }

  public handleSubmitButton(): void {
    if (this.summaryFormGroup.valid) {
      this.submitButtonEvent.emit({
        summary: this.summaryFormGroup.get('summary').value,
        type: this.input.type,
        ...(this.input.type === 'chart' && { index: this.input.index, chartId: this.input.chartId })
      });
    }
  }

  private initForm(): void {
    this.summaryFormGroup = this.fb.group({
      summary: ['', Validators.required]
    });
  }

  public resetForm(): void {
    this.summaryFormGroup.reset();
    this.editorInstance.setData('');
  }

  public closeModal(): void {
    if (this.modal) {
      this.modal.deny();
    }
    this.closeModalEvent.emit(true);
  }
}
