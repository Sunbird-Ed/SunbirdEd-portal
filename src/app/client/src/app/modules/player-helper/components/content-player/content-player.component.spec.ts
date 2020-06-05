import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPlayerComponent } from './content-player.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { playerData } from './content-player.component.spec.data';
import { Subject } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';

describe('ContentPlayerComponent', () => {
  let component: ContentPlayerComponent;
  let fixture: ComponentFixture<ContentPlayerComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentPlayerComponent],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
      providers: [
       ToasterService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlayerComponent);
    component = fixture.componentInstance;
    const componentInstances = fixture.debugElement.componentInstance;
    componentInstances.playerConfig = playerData.configDetails;
    component.contentProgressEvents$ = new Subject();
    component.contentIframe = { nativeElement: {src: '', onload: () => {}} };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should define player config details', () => {
    expect(component.playerConfig).toBeTruthy();
  });

  it('should call onAssessmentEvents', () => {
    spyOn(component.assessmentEvents, 'emit');
    component.onAssessmentEvents({});
    expect(component.assessmentEvents.emit).toHaveBeenCalled();
  });

  it('should call onAssessmentEvents', () => {
    spyOn(component.questionScoreSubmitEvents, 'emit');
    component.onQuestionScoreSubmitEvents({});
    expect(component.questionScoreSubmitEvents.emit).toHaveBeenCalled();
  });
});
