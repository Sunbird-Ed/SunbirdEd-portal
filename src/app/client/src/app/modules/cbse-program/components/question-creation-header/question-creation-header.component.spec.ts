import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionCreationHeaderComponent } from './question-creation-header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { inputData } from './question-creation-header.spec.data';
import { By } from '@angular/platform-browser';

describe('QuestionCreationHeaderComponent', () => {
  let component: QuestionCreationHeaderComponent;
  let fixture: ComponentFixture<QuestionCreationHeaderComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionCreationHeaderComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, CoreModule, TelemetryModule.forRoot(), SharedModule.forRoot(), SuiModule, RouterTestingModule,
        ReactiveFormsModule, FormsModule]
    })
    .compileComponents().then(() => {
        fixture = TestBed.createComponent(QuestionCreationHeaderComponent);
        el = fixture.debugElement.query(By.css('.message'));
        component = fixture.componentInstance;
        component.role = inputData.role;
        component.questionMetaData = inputData.questionMetaData;
        component.telemetryEventsInput = inputData.telemetryEventsInput;
        component.resourceStatus = inputData.resourceStatus;
        fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call init method', () => {
    component.ngOnInit();
  });

  it('Should default hide reviewer comments modal', () => {
    expect(component.reviewerCommentModal).toBeFalsy();
  });

  xit('Image label show when the content status is draft', () => {
    component.resourceStatus = 'Draft';
    fixture.detectChanges();
    expect(el.nativeElement).toBeTruthy();
  });

  it('Image label hidden when the content status is not draft', () => {
    component.resourceStatus = 'Review';
    fixture.detectChanges();
    expect(el).toBeNull();
  });

  it('Should show reviewer comments modal', () => {
      component.openReviewerCommentModal();
    expect(component.reviewerCommentModal).toBeTruthy();
  });

  it('Should hide reviewer comments modal', () => {
    component.closeReviewerCommentModal();
    expect(component.reviewerCommentModal).toBeFalsy();
  });

});
