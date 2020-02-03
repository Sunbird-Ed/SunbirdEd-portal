import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { QuestionCreationComponent } from './question-creation.component';
import {SanitizeHtmlPipe} from '../../../cbse-program/pipe/sanitize-html.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { ConfigService, ResourceService, ToasterService, BrowserCacheTtlService, UtilService, NavigationHelperService} from '@sunbird/shared';
import { PublicDataService, UserService, ActionService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import {RouterModule} from '@angular/router';
import { of } from 'rxjs';
import { inputData } from './question-creation.component.spec.data';
import * as _ from 'lodash-es';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const fakeActivatedRoute = {
    data: of({
      config: {
        question_categories: [
          'vsa',
          'sa',
          'la',
          'mcq'
        ]
      }
    }),
    snapshot: {
      root: { firstChild: { data: { telemetry: { env: 'env' } } } },
      data: {
        telemetry: { env: 'env' }
      }
    }
  };

  const UserServiceStub = {
    userid: '874ed8a5-782e-4f6c-8f36-e0288455901e',
    userProfile: {
      firstName: 'Content',
      lastName: 'creator'
    }
  };

describe('QuestionCreationComponent', () => {
  let component: QuestionCreationComponent;
  let fixture: ComponentFixture<QuestionCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionCreationComponent, SanitizeHtmlPipe ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule, ReactiveFormsModule,  RouterModule.forRoot([]), HttpClientTestingModule],
      // tslint:disable-next-line:max-line-length
      providers: [ConfigService, UtilService, NavigationHelperService, TelemetryService, ResourceService, ToasterService, CacheService, BrowserCacheTtlService,
        // tslint:disable-next-line:max-line-length
        {provide: ActivatedRoute, useValue: fakeActivatedRoute}, PublicDataService, ActionService, { provide: UserService, useValue: UserServiceStub }
      ]
    })
    .compileComponents().then(() => {
        fixture = TestBed.createComponent(QuestionCreationComponent);
        component = fixture.componentInstance;
        component.questionMetaData =  inputData.questionMetaData;
        component.role =  inputData.role;
        component.sessionContext =  inputData.sessionContext;
        component.telemetryEventsInput =  inputData.telemetryEventsInput;
        component.componentConfiguration =  _.get(component.sessionContext, 'practiceSetConfig');
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should store config data After component loaded ', () => {
    component.ngOnChanges();
  });

  it('Should call initialize method After component loaded ', () => {
    component.ngOnInit();
  });

  it('Should generate impression telemetry event After component loaded', () => {
    component.ngAfterViewInit();
  });

  it('Should init dropdown box After component loaded ', () => {
    component.ngAfterViewChecked();
  });

  it('Should not set solution data if data not exist in the question', () => {
    delete component.questionMetaData.data.editorState.solutions;
    component.initialize();
    expect(component.editorState.solutions).toEqual('');
    expect(component.selectedSolutionType).toEqual('');
  });

  it('Should return username', () => {
    const username = component.setUserName();
    expect(username).toEqual('Content creator');
  });

  it('Should set question data', () => {
    const event = {
        body: '<p>Question</p>'
    };
    const type = 'question';
    component.editorDataHandler(event, type);
    expect(component.editorState.question).toEqual('<p>Question</p>');
  });

  it('Should set answer data', () => {
    const event = {
        body: '<p>Answer</p>'
    };
    const type = 'answer';
    component.editorDataHandler(event, type);
    expect(component.editorState.answer).toEqual('<p>Answer</p>');
  });

  it('Should set solution data', () => {
    const event = {
        body: '<p>Solution</p>'
    };
    const type = 'solution';
    component.editorDataHandler(event, type);
    expect(component.editorState.solutions).toEqual('<p>Solution</p>');
  });

  it('Should set media data', () => {
    const event = {
        body: '<p>Solution</p>',
        mediaobj: {
            id: 'do_11277235094210150419',
            type: 'image',
            src: '/assets/public/content/do_11277235094210150419/artifact/screenshot-2019-05-29-at-12.36.58-pm_1559124871228.png',
            baseUrl: 'https://programs.diksha.gov.in'
        }
    };
    const type = 'solution';
    component.editorDataHandler(event, type);
    expect(_.isEmpty(component.mediaArr)).toBeFalsy();
  });

  xit('Should not set media data if media data already exist', () => {
    const event = {
        body: '<p>Solution</p>',
        mediaobj: {
            id: 'do_112772350942101504112',
            type: 'image',
            src: '/assets/public/content/do_11277235094210150419/artifact/screenshot-2019-05-29-at-12.36.58-pm_1559124871228.png',
            baseUrl: 'https://programs.diksha.gov.in'
        }
    };
    const type = 'solution';
    component.editorDataHandler(event, type);
    event.mediaobj = {
        id: 'do_11277235094210150418',
        type: 'image',
        src: '/assets/public/content/do_11277235094210150419/artifact/screenshot-2019-05-29-at-12.36.58-pm_1559124871228.png',
        baseUrl: 'https://programs.diksha.gov.in'
    };
    expect(component.mediaArr.length).toEqual(2);
  });

  it('Should open solution as html if solution type is html', () => {
    component.selectSolutionType('Text+Image');
    expect(component.selectedSolutionType).toEqual('html');
    expect(component.showSolutionDropDown).toBeFalsy();
  });

  it('Should open solution as video if solution type is video', () => {
    component.selectSolutionType('video');
    expect(component.selectedSolutionType).toEqual('video');
    expect(component.videoShow).toBeTruthy();
  });


  it('Should remove solution if deleteSolution method called', () => {
    component.deleteSolution();
    expect(component.showSolutionDropDown).toBeTruthy();
    expect(component.selectedSolutionType).toEqual('');
    expect(component.editorState.solutions).toEqual('');
  });

  it('Should set video data to media if video selected from solution', () => {
    const videoObj = {
        name : 'The kids video',
        identifier: 'do_112772350942101504112',
        type: 'image',
        downloadUrl: '/assets/public/content/do_11277235094210150419/artifact/screenshot-2019-05-29-at-12.36.58-pm_1559124871228.png',
        thumbnail: 'https://programs.diksha.gov.in'
    };
    component.videoDataOutput(videoObj);
    expect(component.videoShow).toBeFalsy();
    expect(component.editorState.solutions).toEqual(videoObj.identifier);
    expect(component.mediaArr.length).toEqual(1);
    expect(component.showSolutionDropDown).toBeFalsy();
  });


  it('Should get converted latex', () => {
    // tslint:disable-next-line:max-line-length
    const body = `&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mn>1</mn><mfenced><mn>2</mn></mfenced></msqrt></math></p>`;
    const convertedBody = `<p>&nbsp;<span class="mathText">\sqrt{1\left(2\right)}</span></p>`;
    component.getConvertedLatex(body).subscribe((res) => {
        expect(res).toEqual(convertedBody);
    });
  });

  it('Should not get converted latex', () => {
    // tslint:disable-next-line:max-line-length
    const body = `<p>Question is very good</p>`;
    component.getConvertedLatex(body).subscribe((res) => {
        expect(res).toEqual(body);
    });
  });


  it('Should reject question', () => {
    component.editorState.question = '<p>Question</p>';
    component.editorState.answer = '<p>Anwser</p>';
    component.mediaArr = [];
    component.manageFormConfiguration();
    // component.requestChanges();
    component.handleReviewrStatus({ 'status' : 'Draft', 'rejectComment':  'Bad question'});
  });

  it('Should show preview of resource', () => {
    component.sessionContext.resourceStatus = 'Review';
    component.buttonTypeHandler('preview');
    expect(component.updateStatus).toEqual('preview');
    expect(component.showPreview).toBeTruthy();
  });

  it('Should show question edit mode if preview is selected', () => {
    component.manageFormConfiguration();
    component.buttonTypeHandler('edit');
    expect(component.showPreview).toBeFalsy();
  });

  it('Should update question', () => {
    component.manageFormConfiguration();
    component.editorState.question = '<p>Question</p>';
    component.editorState.answer = '<p>Anwser</p>';
    component.mediaArr = [];
    component.buttonTypeHandler('save');
  });

  it('Should update question along with solution', () => {
    component.manageFormConfiguration();
    component.editorState.question = '<p>Question</p>';
    component.editorState.answer = '<p>Anwser</p>';
    component.mediaArr = [];
    component.selectedSolutionType = 'html';
    component.buttonTypeHandler('save');
  });

  it('Should not update question if question and answer empty', () => {
    component.manageFormConfiguration();
    component.editorState.question = '';
    component.editorState.answer = '';
    component.mediaArr = [];
    component.buttonTypeHandler('save');
    expect(component.showFormError).toBeTruthy();
    expect(component.showPreview).toBeFalsy();
    expect(component.questionMetaForm.valid).toBeTruthy();
  });
  it('Should not update question if question form not valid', () => {
    component.manageFormConfiguration();
    component.questionMetaForm.controls['license'].setValue('');
    component.editorState.question = '<p>Question</p>';
    component.editorState.answer = '<p>Anwser</p>';
    component.mediaArr = [];
    component.buttonTypeHandler('save');
    expect(component.showFormError).toBeTruthy();
    expect(component.showPreview).toBeFalsy();
    expect(component.questionMetaForm.valid).toBeFalsy();
  });

  it('Should update question before preview of resource', () => {
    component.manageFormConfiguration();
    component.sessionContext.resourceStatus = 'Draft';
    component.editorState.question = '<p>Question</p>';
    component.editorState.answer = '<p>Anwser</p>';
    component.mediaArr = [];
    expect(component.questionMetaForm.valid).toBeTruthy();
    component.buttonTypeHandler('preview');
    expect(component.updateStatus).toEqual('preview');
  });

});
