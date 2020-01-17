import { UserService } from '@sunbird/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA   } from '@angular/core';
import { QuestionCreationComponent
 } from './question-creation.component';
import { QuestionCreationHeaderComponent } from '../question-creation-header/question-creation-header.component';
import { CkeditorToolComponent } from '../ckeditor-tool/ckeditor-tool.component';
import { QuestionPreviewComponent } from '../question-preview/question-preview.component';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { TelemetryModule } from '@sunbird/telemetry';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {RouterModule} from '@angular/router';
import { ConfigService, ResourceService, ToasterService, BrowserCacheTtlService} from '@sunbird/shared';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import {
  role, sessionContext, responseSample, fetchedQueCount, chapterlistSample, textbookMeta, routerQuestionCategorySample
} from '../chapter-list/chapter-list.component.spec.data';
import {SanitizeHtmlPipe} from '../../../cbse-program/pipe/sanitize-html.pipe';

describe('QuestionCreationComponent', () => {
   let component: QuestionCreationComponent;
   let fixture: ComponentFixture<QuestionCreationComponent>;
 beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ QuestionCreationComponent, QuestionCreationHeaderComponent,
        CkeditorToolComponent, QuestionPreviewComponent, SanitizeHtmlPipe],
      imports: [TelemetryModule.forRoot(), SuiModule,
                FormsModule, ReactiveFormsModule,
                InfiniteScrollModule, RouterModule.forRoot([])],
      providers: [ConfigService, ResourceService, ToasterService, HttpClient, HttpHandler, CacheService, BrowserCacheTtlService]
})
    .compileComponents();
  }));
     beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCreationComponent);
    component = fixture.componentInstance;
    component.sessionContext = sessionContext;
    component.role = role;

    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('check the session context is not null', () => {
    // component.sessionContext = sessionContext;
    // fixture.detectChanges();
    // expect(component.sessionContext).not.toBe(null);
  });

});

