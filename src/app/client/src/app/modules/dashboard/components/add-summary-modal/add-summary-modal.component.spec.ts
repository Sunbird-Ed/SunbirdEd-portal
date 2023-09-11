import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import * as ClassicEditor from '@project-sunbird/ckeditor-build-classic';
import { ISummaryObject } from '../../interfaces';
import { AddSummaryModalComponent } from './add-summary-modal.component'
type ClassicEditor = typeof ClassicEditor

describe("AddSummaryModalComponent", () => {
  let component: AddSummaryModalComponent;
  const mockSummaryFormGroup:  Partial<FormGroup> = {
    reset: jest.fn()
  } as any;
  const mockClassicEditor:  Partial<ClassicEditor> = {
    setData: jest.fn()
  } as any;
  const mockFormBuilder: Partial<FormBuilder> = {
    group: jest.fn() 
  };
  
  beforeAll(() => {
    component = new AddSummaryModalComponent(
      mockFormBuilder as FormBuilder
    );
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create AddSummaryModalComponent ', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit()', () => {
    jest.spyOn(mockFormBuilder, 'group')
    component.ngOnInit();
    expect(mockFormBuilder.group).toHaveBeenCalled();
  });

  it('should call resetForm()', () => {
    component.summaryFormGroup = mockSummaryFormGroup as any;
    component.editorInstance = mockClassicEditor as any;
    jest.spyOn(mockSummaryFormGroup, 'reset');
    jest.spyOn(mockClassicEditor, 'setData');
    component.resetForm();
    expect(mockSummaryFormGroup.reset).toHaveBeenCalled();
    expect(mockClassicEditor.setData).toHaveBeenCalled();
  });

  it('should call closeModal()', () => {
    jest.spyOn(component, 'closeModal');
    component.ngOnDestroy();
    expect(component.closeModal).toHaveBeenCalled();
  });
});