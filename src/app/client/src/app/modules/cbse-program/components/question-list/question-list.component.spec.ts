import {
  chapterListComponentInput, role, sessionContext, responseSample,
  fetchedQueCount, chapterlistSample, textbookMeta, routerQuestionCategorySample
} from '../chapter-list/chapter-list.component.spec.data';
 // import { AppLoaderComponent } from '../../../shared/components/app-loader/app-loader.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { AppLoaderComponent } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { QuestionCreationComponent } from '../question-creation/question-creation.component';
import { QuestionCreationHeaderComponent } from '../question-creation-header/question-creation-header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, UserService, PublicDataService, ActionService, ContentService  } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { McqCreationComponent } from '../mcq-creation/mcq-creation.component';
import { By } from '@angular/platform-browser';
import { QuestionListComponent } from './question-list.component';
import { CkeditorToolComponent } from '../ckeditor-tool/ckeditor-tool.component';
import * as editorConfig from '../../../shared/services/config/editor.config.json';
import { DebugElement, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SanitizeHtmlPipe } from '../../../cbse-program/pipe/sanitize-html.pipe';
import { /*SuiModule, SuiTabsModule,*/ SuiSelect } from 'ng2-semantic-ui/dist';
import { ConfigService, ServerResponse, ToasterService, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
describe('QuestionListComponent', () => {
  let component: QuestionListComponent;
  let fixture: ComponentFixture<QuestionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionListComponent, QuestionCreationHeaderComponent,
      McqCreationComponent, QuestionCreationComponent, SanitizeHtmlPipe],
      imports: [SuiModule, FormsModule, CoreModule, TelemetryModule, ReactiveFormsModule, FormsModule],
      schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ConfigService, TelemetryService, BrowserCacheTtlService, CollectionHierarchyService],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.componentInstance;
    component.sessionContext = sessionContext;

    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
