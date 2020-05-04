import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import * as ClassicEditor from '@project-sunbird/ckeditor-build-font';

interface IAddSummaryModalInput {
  title: string;
  type: 'report' | 'chart';
  index?: number;
  chartId?: string;
}

@Component({
  selector: 'app-add-summary-modal',
  templateUrl: './add-summary-modal.component.html',
  styleUrls: ['./add-summary-modal.component.scss']
})
export class AddSummaryModalComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() submitButtonEvent = new EventEmitter();
  @Input() input: IAddSummaryModalInput;
  @Output() closeModalEvent = new EventEmitter();
  @ViewChild('modal') modal;
  @ViewChild('editor') public editorRef: ElementRef;
  public editorInstance: any;

  public summaryFormGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    ClassicEditor.create(this.editorRef.nativeElement, {
      toolbar: ['heading', '|', "undo", "redo", "bold", "italic", "blockQuote", "heading", "link",
        "fontFamily", "fontSize", "fontColor", "fontBackgroundColor", "underline", "subscript", "superscript"]
    })
      .then(editor => {
        this.editorInstance = editor;
        editor.model.document.on('change', (eventInfo, batch) => {
          this.summaryFormGroup.controls.summary.setValue(editor.getData());
        });
      })
      .catch(err => console.error)
  }

  ngOnDestroy() {
    this.modal && this.modal.deny();
    this.closeModal();
  }

  public handleSubmitButton() {
    if (this.summaryFormGroup.valid) {
      this.submitButtonEvent.emit({
        summary: this.summaryFormGroup.get('summary').value,
        type: this.input.type,
        ...(this.input.type === 'chart' && { index: this.input.index, chartId: this.input.chartId })
      });
    }
  }

  private initForm() {
    this.summaryFormGroup = this.fb.group({
      summary: ['', Validators.required]
    });
  }

  public resetForm() {
    this.summaryFormGroup.reset();
  }

  public closeModal() {
    this.modal && this.modal.deny();
    this.closeModalEvent.emit(true);
  }
}
