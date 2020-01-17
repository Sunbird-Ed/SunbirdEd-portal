import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPreviewComponent } from './question-preview.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Response } from './question-preview.component.spec.data';

describe('QuestionPreviewComponent', () => {
  let component: QuestionPreviewComponent;
  let fixture: ComponentFixture<QuestionPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionPreviewComponent ],
      imports: [PlayerHelperModule, SharedModule.forRoot(), TelemetryModule.forRoot(), RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPreviewComponent);
    component = fixture.componentInstance;
    component.sessionContext = Response.sessionContext;
    // component.questionMetaData = Response.questionMetaData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
