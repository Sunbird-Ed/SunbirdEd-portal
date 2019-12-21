import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCreationHeaderComponent } from './question-creation-header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Response } from './question-creation-header.spec.data';

describe('QuestionCreationHeaderComponent', () => {
  let component: QuestionCreationHeaderComponent;
  let fixture: ComponentFixture<QuestionCreationHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionCreationHeaderComponent],
      imports: [HttpClientTestingModule, CoreModule, TelemetryModule.forRoot(), SharedModule.forRoot(), SuiModule, RouterTestingModule,
        ReactiveFormsModule, FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCreationHeaderComponent);
    component = fixture.componentInstance;
    component.role = Response.role;
    component.questionMetaData = Response.questionMetaData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
