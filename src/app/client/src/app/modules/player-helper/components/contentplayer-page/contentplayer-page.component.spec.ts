import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPlayerPageComponent } from './contentplayer-page.component';
import {
  ConfigService, NavigationHelperService, PlayerConfig, ContentData, ToasterService, ResourceService,
  UtilService, SharedModule
} from '@sunbird/shared';
import { Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';

describe('ContentPlayerComponent', () => {
  let component: ContentPlayerPageComponent;
  let fixture: ComponentFixture<ContentPlayerPageComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentPlayerPageComponent],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
      providers: [
       ToasterService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlayerPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onAssessmentEvents', () => {
    spyOn(component.assessmentEvents, 'emit');
    component.onAssessmentEvents({});
    expect(component.assessmentEvents.emit).toHaveBeenCalled();
  });

  it('should call questionScoreSubmitEvents', () => {
    spyOn(component.questionScoreSubmitEvents, 'emit');
    component.onQuestionScoreSubmitEvents({});
    expect(component.questionScoreSubmitEvents.emit).toHaveBeenCalled();
  });
});
