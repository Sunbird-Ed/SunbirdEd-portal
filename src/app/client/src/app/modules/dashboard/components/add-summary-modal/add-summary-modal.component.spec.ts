import { SharedModule } from '@sunbird/shared';
import { ISummaryObject } from './../../interfaces';
import { ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { AddSummaryModalComponent } from './add-summary-modal.component';
import { inputProp } from './add-summary-modal.component.spec.data';

describe('AddSummaryModalComponent', () => {
  let component: AddSummaryModalComponent;
  let fixture: ComponentFixture<AddSummaryModalComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSummaryModalComponent],
      imports: [SuiModule, ReactiveFormsModule, SharedModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSummaryModalComponent);
    component = fixture.componentInstance;
    component.input = inputProp as ISummaryObject;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should run ngOnInit()', async () => {
    spyOn<any>(component, 'initForm');
    component.ngOnInit();
    expect(component['initForm']).toHaveBeenCalled();
  });


  it('should run ngOnDestroy()', async () => {
    spyOn(component, 'closeModal');
    component.ngOnDestroy();
    expect(component.closeModal).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalledTimes(1);
  });


  it('should run handleSubmitButton()', () => {
    spyOn(component.submitButtonEvent, 'emit');
    component.ngOnInit();
    component.summaryFormGroup.setValue({
      summary: '<p>testing</p>'
    });
    component.handleSubmitButton();
    expect(component.submitButtonEvent.emit).toHaveBeenCalled();
    expect(component.submitButtonEvent.emit).toHaveBeenCalledWith({
      summary: '<p>testing</p>',
      type: 'report'
    });
  });


  it('should run initForm()', async () => {
    spyOn<any>(component, 'initForm').and.callThrough();
    component.ngOnInit();
    expect(component['initForm']).toHaveBeenCalled();
    expect(component.summaryFormGroup).toBeDefined();
  });


  it('should run resetForm()', async () => {
    component.ngOnInit();
    spyOn(component.summaryFormGroup, 'reset');
    component.editorInstance = component.editorInstance || { setData: () => { } };
    spyOn(component.editorInstance, 'setData');
    component.resetForm();
    expect(component.summaryFormGroup.reset).toHaveBeenCalled();
    expect(component.editorInstance.setData).toHaveBeenCalled();
  });

  it('should run closeModal()', async () => {
    spyOn(component.closeModalEvent, 'emit');
    component.closeModal();
    expect(component.closeModalEvent.emit).toHaveBeenCalled();
    expect(component.closeModalEvent.emit).toHaveBeenCalledTimes(1);
  });

});
