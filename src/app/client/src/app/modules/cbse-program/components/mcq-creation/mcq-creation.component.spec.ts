import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { McqCreationComponent } from './mcq-creation.component';
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
import { inputData } from './mcq-creation.component.spec.data';
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
describe('McqCreationComponent', () => {
  let component: McqCreationComponent;
  let fixture: ComponentFixture<McqCreationComponent>;
  // tslint:disable-next-line:prefer-const
  let debugElement: DebugElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McqCreationComponent, SanitizeHtmlPipe ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule, ReactiveFormsModule,  RouterModule.forRoot([]), HttpClientTestingModule],
      // tslint:disable-next-line:max-line-length
      providers: [ConfigService, UtilService, NavigationHelperService, TelemetryService, ResourceService, ToasterService, CacheService, BrowserCacheTtlService,
        // tslint:disable-next-line:max-line-length
        {provide: ActivatedRoute, useValue: fakeActivatedRoute}, PublicDataService, ActionService, { provide: UserService, useValue: UserServiceStub }
      ]
    })
    .compileComponents();
  }));
  beforeEach(async () => {
    const localiInputData  = inputData;
    fixture = TestBed.createComponent(McqCreationComponent);
    component = fixture.componentInstance;
    component.questionMetaData =  localiInputData.questionMetaData;
    component.role =  localiInputData.role;
    component.sessionContext =  localiInputData.sessionContext;
    component.telemetryEventsInput =  localiInputData.telemetryEventsInput;
    component.componentConfiguration =  _.get(component.sessionContext, 'practiceSetConfig');
    // fixture.detectChanges();
  });
  it('should create', async() => {
    expect(component).toBeTruthy();
  });
  it('Should set rejectComment if available in question meta data ', async() => {
    component.questionMetaData.data.rejectComment = 'Reject comment';
  });
  it('After component loaded should store config data', async() => {
    component.ngOnChanges();
  });
  it('After component loaded should call initialize method', async() => {
    component.ngOnInit();
  });
  it('After component loaded should init dropdown and generate impression telemetry event', async() => {
    component.ngAfterViewInit();
  });

  it('Should initiate forms if mcq template id is already set in question meta data', async() => {
    component.questionMetaData.data.templateId = 'mcq-vertical';
    component.ngOnChanges();
  });

  it('After component loaded it should ask to select mcq template', async() => {
    const event = { 'type': 'submit', 'template': {'templateClass': 'mcq-vertical'}};
    component.handleTemplateSelection(event);
    expect(component.questionMetaData.data.templateId).toEqual('mcq-vertical');
  });

  it('Should return username', async() => {
    const username = component.setUserName();
    expect(username).toEqual('Content creator');
  });

  it('should not execute saveContent if Mandatory Form-fields are empty', async() => {
      component.initForm();
      component.manageFormConfiguration();
      expect(component.handleSubmit(component.questionMetaForm)).toBeFalsy();
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
    component.solutionValue = event.body;
    component.getMedia(event.mediaobj);
    expect(_.isEmpty(component.mediaArr)).toBeFalsy();
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
    expect(component.solutionValue).toEqual('');
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
    expect(component.solutionValue).toEqual(videoObj.identifier);
    expect(component.mediaArr.length).toEqual(1);
    expect(component.showSolutionDropDown).toBeFalsy();
  });
  it('Should reject question', () => {
    component.initForm();
    component.manageFormConfiguration();
    component.mcqForm.question = 'Question';
    component.mcqForm.options[0].body = 'option 1';
    component.mcqForm.options[1].body = 'option 2';
    component.mediaArr = [];
    component.handleReviewrStatus({ 'status' : 'Draft', 'rejectComment':  'Bad question'});
    expect(component.showSolutionDropDown).toBeFalsy();
  });

  it('Should show preview of resource', () => {
    component.sessionContext.resourceStatus = 'Review';
    component.buttonTypeHandler('preview');
    expect(component.updateStatus).toEqual('preview');
    expect(component.showPreview).toBeTruthy();
  });

  it('Should show question edit mode if preview is selected', () => {
    component.initForm();
    component.manageFormConfiguration();
    component.buttonTypeHandler('edit');
    expect(component.showPreview).toBeFalsy();
  });

  it('Should handle submit function with out any validation error', () => {
    component.initForm();
    component.manageFormConfiguration();
    component.mcqForm.question = '<p>Question</p>';
    component.mcqForm.options[0].body = '<p>Anwser 1</p>';
    component.mcqForm.options[1].body = '<p>Anwser 2</p>';
    component.mcqForm.options[2].body = '<p>Anwser 3</p>';
    component.mcqForm.options[3].body = '<p>Anwser 4</p>';
    component.mcqForm.answer = '0';
    component.questionMetaData.mode = 'edit';
    component.mediaArr = [];
    component.handleSubmit(component.questionMetaForm);
  });

  it('Should update question', () => {
    component.initForm();
    component.manageFormConfiguration();
    component.mcqForm.question = '<p>Question</p>';
    component.mcqForm.options[0].body = '<p>Anwser 1</p>';
    component.mcqForm.options[1].body = '<p>Anwser 2</p>';
    component.mediaArr = [];
    component.buttonTypeHandler('save');
  });

  it('Should update question along with solution', () => {
    component.initForm();
    component.manageFormConfiguration();
    component.mcqForm.question = '<p>Question</p>';
    component.mcqForm.options[0].body = '<p>Anwser 1</p>';
    component.mcqForm.options[1].body = '<p>Anwser 2</p>';
    component.mediaArr = [];
    component.selectedSolutionType = 'html';
    component.buttonTypeHandler('save');
  });

  it('Should not update question if question and answer empty', () => {
    component.initForm();
    component.manageFormConfiguration();
    component.mcqForm.question = '';
    component.mcqForm.options[0].body = '';
    component.mcqForm.options[1].body = '';
    component.mediaArr = [];
    component.buttonTypeHandler('save');
    expect(component.showFormError).toBeTruthy();
    expect(component.showPreview).toBeFalsy();
    expect(component.questionMetaForm.valid).toBeTruthy();
  });


  it('Should not update question if question form not valid', () => {
    component.initForm();
    component.manageFormConfiguration();
    component.questionMetaForm.controls['license'].setValue('');
    component.mcqForm.question = '<p>Question</p>';
    component.mcqForm.options[0].body = '<p>Anwser 1</p>';
    component.mcqForm.options[1].body = '<p>Anwser 2</p>';
    component.mediaArr = [];
    component.buttonTypeHandler('save');
    expect(component.showFormError).toBeTruthy();
    expect(component.showPreview).toBeFalsy();
    expect(component.questionMetaForm.valid).toBeFalsy();
  });

  it('Should update question before preview of resource', () => {
    component.initForm();
    component.manageFormConfiguration();
    component.sessionContext.resourceStatus = 'Draft';
    component.mcqForm.question = '<p>Question</p>';
    component.mcqForm.options[0].body = '<p>Anwser 1</p>';
    component.mcqForm.options[1].body = '<p>Anwser 2</p>';
    component.mediaArr = [];
    expect(component.questionMetaForm.valid).toBeTruthy();
    component.buttonTypeHandler('preview');
    expect(component.updateStatus).toEqual('preview');
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
    expect(component.solutionValue).toEqual(videoObj.identifier);
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

  it('Should initialie empty mcq question and options if question meta data not available', async() => {
    delete component.questionMetaData.data;
    component.initForm();
    expect(component.mcqForm.question).toBe('');
  });
});
