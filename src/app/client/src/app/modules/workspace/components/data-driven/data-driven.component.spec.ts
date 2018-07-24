
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataDrivenComponent } from './data-driven.component';
import { DefaultTemplateComponent } from '../content-creation-default-template/content-creation-default-template.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { ActivatedRoute, Router } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { EditorService } from './../../services';
import { ResourceService, SharedModule, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { FrameworkService, FormService, ContentService, UserService, CoreModule } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { mockFrameworkData } from './data-driven.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';

describe('DataDrivenComponent', () => {
  let componentParent: DataDrivenComponent;
  let fixtureParent: ComponentFixture<DataDrivenComponent>;
  let componentChild: DefaultTemplateComponent;
  let fixtureChild: ComponentFixture<DefaultTemplateComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceBundle = {
    'messages': {
      'emsg': {
        'm0005': 'api failed, please try again'
      },
      'stmsg': {
        'm0018': 'We are fetching content...',
        'm0008': 'no-results',
        'm0033': 'You dont have any content'
      },
      'fmsg': {
        'm0078': 'Creating content failed. Please login again to create content.',
        'm0010': 'Creating collection failed. Please login again to create collection.'
      }
    }
  };
  const fakeActivatedRoute = {
    'url': observableOf([{ 'path': 'textbook' }]),
    snapshot: {
      params: [
        {
          pageNumber: '1',
        }
      ],
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-content-draft', subtype: 'scroll', type: 'list',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SuiModule, SharedModule.forRoot(), CoreModule.forRoot(),
        TelemetryModule.forRoot()],
      declarations: [DataDrivenComponent, DefaultTemplateComponent],
      providers: [FrameworkService, FormService, UserService, ContentService,
        CacheService, EditorService, NavigationHelperService, ToasterService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixtureParent = TestBed.createComponent(DataDrivenComponent);
    componentParent = fixtureParent.componentInstance;
    fixtureChild = TestBed.createComponent(DefaultTemplateComponent);
    componentChild = fixtureChild.componentInstance;
    fixtureParent.detectChanges();
  });

  it('should create', () => {
    expect(componentParent).toBeTruthy();
  });
  it('should fetch framework details', () => {
    const service = TestBed.get(FrameworkService);
    const cacheService = TestBed.get(CacheService);
    const contentService = TestBed.get(ContentService);
    const formService = TestBed.get(FormService);
    const formServiceInputParams = {
            formType: 'textbook',
            formAction: 'textbook',
            contentType: 'textbook',
            framework: 'textbook'
    };
    service._frameWorkData$ = mockFrameworkData.success;
    service._frameworkData$.next({
      err: null, framework: mockFrameworkData.success.framework,
      frameworkdata: mockFrameworkData.success.frameworkdata
    });
    componentParent.isCachedDataExists = true;
    componentParent.formFieldProperties = mockFrameworkData.formSuccess.fields;
    componentParent.fetchFrameworkMetaData();
    formService.getFormConfig(formServiceInputParams);
  });
  it('should throw error', () => {
    const service = TestBed.get(FrameworkService);
    const cacheService = TestBed.get(CacheService);
    const contentService = TestBed.get(ContentService);
    service._frameWorkData$ = mockFrameworkData.frameworkError;
    service._frameworkData$.next({
      err: mockFrameworkData.frameworkError.err,
      framework: mockFrameworkData.frameworkError.framework, frameworkdata: mockFrameworkData.frameworkError.frameworkdata
    });
    componentParent.formFieldProperties = mockFrameworkData.formSuccess.fields;
    componentParent.fetchFrameworkMetaData();
  });
  it('should router to collection editer ', () => {
    const state = 'draft';
    const type = 'TextBook';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'textbook';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    spyOn(componentParent, 'createContent').and.callThrough();
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(observableOf(mockFrameworkData.createCollectionData));
    componentParent.createContent();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/workspace/content/edit/collection', 'do_2124708548063559681134', 'TextBook', 'draft', componentParent.framework]);
  });
  it('should not router to collection editer ', () => {
    const state = 'draft';
    const type = 'TextBook';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'studymaterial';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    spyOn(componentParent, 'createContent').and.callThrough();
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(observableOf(mockFrameworkData.createCollectionData));
    componentParent.createContent();
    expect(router.navigate).not.toHaveBeenCalledWith(
      ['/workspace/content/edit/collection', 'do_2124708548063559681134', 'TextBook', 'draft', componentParent.framework]);
  });
  it('should router to contentEditor editer ', () => {
    const state = 'draft';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'studymaterial';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    spyOn(componentParent, 'createContent').and.callThrough();
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(observableOf(mockFrameworkData.createCollectionData));
    componentParent.createContent();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/workspace/content/edit/content/', 'do_2124708548063559681134', 'draft', componentParent.framework]);
  });
  it('should not router to contentEditor editer ', () => {
    const state = 'draft';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'textbook';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    spyOn(componentParent, 'createContent').and.callThrough();
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(observableOf(mockFrameworkData.createCollectionData));
    componentParent.createContent();
    expect(router.navigate).not.toHaveBeenCalledWith(
      ['/workspace/content/edit/content/', 'do_2124708548063559681134', 'draft', componentParent.framework]);
  });
  it('should call getFormConfig', () => {
    componentParent.formFieldProperties = mockFrameworkData.formSuccess;
    componentParent.categoryMasterList = mockFrameworkData.frameworkSuccess;
    spyOn(componentParent, 'getFormConfig').and.callThrough();
    componentParent.getFormConfig();
    expect(componentParent.getFormConfig).toHaveBeenCalled();
  });
  it('should call getFormConfig api', () => {
    const formService = TestBed.get(FormService);
    componentParent.formFieldProperties = mockFrameworkData.formSuccess;
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(mockFrameworkData.formSuccess));
    spyOn(componentParent, 'getFormConfig').and.callThrough();
    componentParent.getFormConfig();
    expect(componentParent.getFormConfig).toHaveBeenCalled();
  });
  it('test to navigate back to content create page if previous url is not from content create page', () => {
    const router = TestBed.get(Router);
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'getPreviousUrl').and.returnValue(mockFrameworkData.redirectUrlTrueCase);
    componentParent.checkForPreviousRouteForRedirect();
    expect(router.navigate).toHaveBeenCalledWith(['/workspace/content/create']);
  });
  it('test to not to navigate to content create page if previous url is from content create page', () => {
    const router = TestBed.get(Router);
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'getPreviousUrl').and.returnValue(mockFrameworkData.redirectUrlFalseCase);
    spyOn(componentParent, 'redirect');
    componentParent.checkForPreviousRouteForRedirect();
    expect(componentParent.redirect).not.toHaveBeenCalled();
  });

  it('test to navigate to create ', () => {
    const router = TestBed.get(Router);
    spyOn(componentParent , 'goToCreate').and.callThrough();
    componentParent.goToCreate();
    expect(router.navigate).toHaveBeenCalledWith(['/workspace/content/create']);
  });

  it('should thow  editor service api error when contentType is studymaterial  ', () => {
    const state = 'draft';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'studymaterial';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    spyOn(componentParent, 'createContent').and.callThrough();
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    componentParent.createContent();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0078);
  });

  it('should thow  editor service api error when contentType is not studymaterial  ', () => {
    const state = 'draft';
    const type = 'TextBook';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'textbook';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    spyOn(componentParent, 'createContent').and.callThrough();
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    componentParent.createContent();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0010);
  });
});
