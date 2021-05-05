import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentChapterlistComponent } from './content-chapterlist.component';
import {
   ToasterService, SharedModule
} from '@sunbird/shared';
import * as _ from 'lodash-es';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';

describe('ContentPlayerComponent', () => {
  let component: ContentChapterlistComponent;
  let fixture: ComponentFixture<ContentChapterlistComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentChapterlistComponent],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
      providers: [
       ToasterService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentChapterlistComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
