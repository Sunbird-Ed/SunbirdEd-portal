
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataDrivenComponent } from './data-driven.component';
import { DefaultTemplateComponent } from '../content-creation-default-template/content-creation-default-template.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { EditorService, WorkSpaceService } from './../../services';
import { ResourceService, SharedModule, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { FrameworkService, FormService, ContentService, UserService, CoreModule } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { mockFrameworkData } from './data-driven.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';

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
        'm0005': 'api failed, please try again',
        'm0024' : 'Unable to get category defination details, please try again later...',
        'm0025' : 'Unable to get framework details, please try again later...'
      },
      'stmsg': {
        'm0018': 'We are fetching content...',
        'm0008': 'no-results',
        'm0033': 'You dont have any content'
      },
      'fmsg': {
        'm0078': 'Creating content failed. Please login again to create content.',
        'm0010': 'Creating collection failed. Please login again to create collection.',
        'm0102' : 'Creating QuestionSet failed. Please login again to create QuestionSet...',
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
    },
    queryParams: observableOf({
      showFrameworkSelection: 'true'
    })
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SharedModule.forRoot(), CoreModule,
        TelemetryModule.forRoot()],
      declarations: [DataDrivenComponent, DefaultTemplateComponent],
      providers: [CacheService, EditorService, WorkSpaceService, TelemetryService,
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
    const userService = TestBed.get(UserService);
    userService['userOrgDetails$'] = observableOf({});
    // navigationHelperService = TestBed.get('NavigationHelperService');
    fixtureParent.detectChanges();
  });

  it('should router to QuestionSet editor', () => {
    const router = TestBed.get(Router);
    const service = TestBed.get(FrameworkService);
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'createQuestionSet').and.returnValue(observableOf({result: {identifier: 'do_2124708548063559681134'}}));
    service._frameWorkData$ = mockFrameworkData.frameworkData;
    service._frameworkData$.next({
      err: null, framework: mockFrameworkData.success.framework,
      frameworkdata: mockFrameworkData.frameworkData
    });
    componentParent.contentType = 'questionset';
    spyOn(componentParent, 'generateQuestionSetData').and.callFake(() => {});
    componentParent.fetchFrameworkMetaData();
    expect(router.navigate).toHaveBeenCalledWith(
      ['workspace/edit/', 'QuestionSet', 'do_2124708548063559681134', 'allcontent', 'Draft']);
  });

  it('should not router to QuestionSet editor', () => {
    const router = TestBed.get(Router);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    const service = TestBed.get(FrameworkService);
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'createQuestionSet').and.returnValue(observableThrowError({}));
    service._frameWorkData$ = mockFrameworkData.frameworkData;
    service._frameworkData$.next({
      err: null, framework: mockFrameworkData.success.framework,
      frameworkdata: mockFrameworkData.frameworkData
    });
    componentParent.contentType = 'questionset';
    spyOn(componentParent, 'generateQuestionSetData').and.callFake(() => {});
    componentParent.fetchFrameworkMetaData();
    expect(router.navigate).not.toHaveBeenCalledWith(
      ['workspace/edit/', 'QuestionSet', 'do_2124708548063559681134', 'allcontent', 'Draft']);
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0102);
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
    service._frameWorkData$ = mockFrameworkData.frameworkData;
    service._frameworkData$.next({
      err: null, framework: mockFrameworkData.success.framework,
      frameworkdata: mockFrameworkData.frameworkData
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

  it('should router to collection editor ', () => {
    const state = 'draft';
    const type = 'TextBook';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    const workSpaceService = TestBed.get(WorkSpaceService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'textbook';
    componentParent.targetFramework = 'nit_k-12';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    userService._userProfile = {};
    spyOn(componentParent, 'createContent').and.callThrough();
    spyOn(workSpaceService, 'lockContent').and.returnValue(observableOf({}));
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(observableOf(mockFrameworkData.createCollectionData));
    componentParent.createContent(undefined);
    expect(router.navigate).toHaveBeenCalledWith(
      ['workspace/edit/', 'TextBook', 'do_2124708548063559681134', 'draft', 'Draft']);
  });
  it('should not router to collection editor ', () => {
    const state = 'draft';
    const type = 'TextBook';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'studymaterial';
    componentParent.targetFramework = 'nit_k-12';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    userService._userProfile = {};
    spyOn(componentParent, 'createContent').and.callThrough();
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'lockContent').and.returnValue(observableOf({}));
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(observableOf(mockFrameworkData.createCollectionData));
    componentParent.createContent(undefined);
    expect(router.navigate).not.toHaveBeenCalledWith(
      ['/workspace/content/edit/collection', 'do_2124708548063559681134', 'TextBook', 'draft', componentParent.framework]);
  });
  it('should not router to new collection editor ', () => {
    const state = 'draft';
    const type = 'Course';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'Course';
    componentParent.contentType = 'course';
    componentParent.targetFramework = 'nit_k-12';
    componentParent.primaryCategory = 'course';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    userService._userProfile = {};
    componentParent.fetchFrameworkMetaData();
    spyOn(componentParent, 'createContent').and.callThrough();
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'lockContent').and.returnValue(observableOf({}));
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(observableOf(mockFrameworkData.createCollectionData));
    componentParent.createContent(undefined);
    expect(router.navigate).toHaveBeenCalledWith(
      ['workspace/edit/', 'Course', 'do_2124708548063559681134', 'draft', 'Draft']);
  });
  it('should router to contentEditor editor ', () => {
    const state = 'draft';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'abcd', board: 'NCERT' };
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'studymaterial';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    userService._userProfile = {};
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'lockContent').and.returnValue(observableOf({}));
    spyOn(editorService, 'create').and.returnValue(observableOf(mockFrameworkData.createCollectionData));
    componentParent.createContent(undefined);
    expect(router.navigate).toHaveBeenCalledWith(
      ['/workspace/content/edit/content/', 'do_2124708548063559681134', 'draft', componentParent.framework, 'Draft']);
  });
  it('should router to contentEditor editor ', () => {
    const state = 'draft';
    const router = TestBed.get(Router);
    const userService = TestBed.get(UserService);
    const editorService = TestBed.get(EditorService);
    componentChild.formInputData = { name: 'testAssessment'};
    componentParent.formData = componentChild;
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'assessment';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    userService._userProfile = {};
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'lockContent').and.returnValue(observableOf({}));
    spyOn(editorService, 'create').and.returnValue(observableOf(mockFrameworkData.createCollectionData));
    componentParent.createContent(undefined);
    expect(router.navigate).toHaveBeenCalledWith(
      ['/workspace/content/edit/content/', 'do_2124708548063559681134', 'draft', componentParent.framework, 'Draft']);
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
    userService._userProfile = {};
    spyOn(componentParent, 'createContent').and.callThrough();
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'lockContent').and.returnValue(observableOf({}));
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.returnValue(observableOf(mockFrameworkData.createCollectionData));
    componentParent.createContent(undefined);
    expect(router.navigate).not.toHaveBeenCalledWith(
      ['/workspace/content/edit/content/', 'do_2124708548063559681134', 'draft', componentParent.framework]);
  });
  it('should call getFormConfig', () => {
    componentParent.formFieldProperties = mockFrameworkData.formSuccess;
    componentParent.categoryMasterList = mockFrameworkData.frameworkSuccess;
    const userService = TestBed.get(UserService);
    userService._userProfile = {};
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
    spyOn(componentParent, 'goToCreate').and.callThrough();
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
    userService._userProfile = {};
    spyOn(componentParent, 'createContent').and.callThrough();
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'lockContent').and.returnValue(observableOf({}));
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    componentParent.createContent(undefined);
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
    userService._userProfile = {};
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'lockContent').and.returnValue(observableOf({}));
    spyOn(componentParent, 'createContent').and.callThrough();
    componentParent.generateData(componentParent.formData.formInputData);
    spyOn(editorService, 'create').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    componentParent.createContent(undefined);
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0010);
  });

  it('When contentType is present', () => {
    expect(componentParent.name).toBe('Untitled Textbook');
    expect(componentParent.description).toBe('Enter description for TextBook');
  });

  it('should fetch frameworks from channel-read api and set for the associated popup cards based on queryParams', () => {
    const frameworkService = TestBed.get(FrameworkService);
    spyOn<any>(componentParent, 'selectFramework').and.stub();
    spyOn(frameworkService, 'getChannel').and.returnValue(observableOf(mockFrameworkData.channelData));
    componentParent.ngOnInit();
    expect(componentParent.selectFramework).toHaveBeenCalled();
    expect(componentParent.userChannelData).toBeDefined();
  });

  it('should throw error if channel read api fails', () => {
    const frameworkService = TestBed.get(FrameworkService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(frameworkService, 'getChannel').and.callFake(() => observableThrowError({}));
    componentParent.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith('api failed, please try again');
  });

  it('should fetch form config metadata if framework selection popup does not appear', () => {
    const activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.queryParams = observableOf({showFrameworkSelection: false});
    spyOn<any>(componentParent, 'fetchFrameworkMetaData').and.stub();
    componentParent.ngOnInit();
    expect(componentParent.fetchFrameworkMetaData).toHaveBeenCalled();
  });

  it('selectFramework() function should fetch categoryDefinition', () => {
    const workSpaceService = TestBed.get(WorkSpaceService);
    componentParent.selectFramework();
    componentParent.orgFWType = _.get(mockFrameworkData.successCategory, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
    expect(componentParent.orgFWType).toEqual('K-12');
  });

  it('selectFramework() function should categoryDefinition api throw error', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'getCategoryDefinition').and.returnValue(observableThrowError({}));
    componentParent.selectFramework();
    componentParent.orgFWType = _.get(mockFrameworkData.successCategory, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0024);
  });

  it('selectFramework() function should fetch categoryDefinition and getFrameworkDataByType() after success', () => {
    spyOn(componentParent, 'setTargetFramework').and.stub();
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'getCategoryDefinition').and.returnValue(observableOf(mockFrameworkData.objectCategoryDefinitionFrameworkData));
    componentParent.userChannelData = _.get(mockFrameworkData, 'userChannelData');
    componentParent.orgFWType = _.get(mockFrameworkData.successCategory, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
    spyOn(componentParent, 'getFrameworkDataByType').and.returnValue(observableOf(mockFrameworkData.frameworkSearchByType));
    componentParent.selectFramework();
    expect(componentParent.orgFWType).toContain('K-12');
    expect(componentParent.setTargetFramework).toHaveBeenCalled();
  });

  it('#selectFramework() function should have channel with empty framework', () => {
    spyOn(componentParent, 'setTargetFramework').and.stub();
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'getCategoryDefinition').and.returnValue(observableOf(mockFrameworkData.objectCategoryDefinitionFrameworkData));
    componentParent.userChannelData = _.get(mockFrameworkData, 'userChannelDataEmptyFramework');
    componentParent.orgFWType = _.get(mockFrameworkData.successCategory, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
    spyOn(componentParent, 'getFrameworkDataByType').and.returnValue(observableOf(mockFrameworkData.frameworkSearchByType));

    componentParent.selectFramework();
    expect(componentParent.orgFWType).toContain('K-12');
    expect(componentParent.setTargetFramework).toHaveBeenCalled();
  });

  it('#selectFramework() - getFrameworkDataByType() function call returns count 0', () => {
    spyOn(componentParent, 'setTargetFramework').and.stub();
    const workSpaceService = TestBed.get(WorkSpaceService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(workSpaceService, 'getCategoryDefinition').and.returnValue(observableOf(mockFrameworkData.objectCategoryDefinitionFrameworkData));
    spyOn(toasterService, 'error').and.callThrough();
    componentParent.userChannelData = _.get(mockFrameworkData, 'userChannelData');
    componentParent.orgFWType = _.get(mockFrameworkData.successCategory, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
    spyOn(componentParent, 'getFrameworkDataByType').and.returnValue(observableOf(mockFrameworkData.frameworkSearchByTypeCountZero));
    componentParent.selectFramework();
    expect(toasterService.error).toHaveBeenCalledWith('Unknown framework category Course. Please check the configuration.');
   });


   it('#selectFramework() - getFrameworkDataByType() function should throw error', () => {
    const resourceService = TestBed.get(ResourceService);
    spyOn(componentParent, 'setTargetFramework').and.stub();
    const workSpaceService = TestBed.get(WorkSpaceService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(workSpaceService, 'getCategoryDefinition').and.returnValue(observableOf(mockFrameworkData.objectCategoryDefinitionFrameworkData));
    spyOn(toasterService, 'error').and.callThrough();
    componentParent.userChannelData = _.get(mockFrameworkData, 'userChannelData');
    componentParent.orgFWType = _.get(mockFrameworkData.successCategory, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
    spyOn(componentParent, 'getFrameworkDataByType').and.returnValue(observableThrowError({}));
    componentParent.selectFramework();
    expect(toasterService.error).toHaveBeenCalledWith('Unknown framework category Course. Please check the configuration.');
   });

   it('#selectFramework() - function should fetch categoryDefinition with schema configured with framework identifiers', () => {
    spyOn(componentParent, 'setTargetFramework').and.stub();
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'getCategoryDefinition').and
    .returnValue(observableOf(mockFrameworkData.objectCategoryDefinitionSchemaFrameworkData));
    componentParent.userChannelData = _.get(mockFrameworkData, 'userChannelData');
    componentParent.orgFWType = _.get(mockFrameworkData.successCategory, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
    spyOn(componentParent, 'getFrameworkDataByType').and.returnValue(observableOf(mockFrameworkData.frameworkSearchByType));
    componentParent.selectFramework();
    expect(componentParent.setTargetFramework).toHaveBeenCalled();
  });

  it('#selectFramework() - function should categoryDefinition config and channel has same framework type', () => {
    spyOn(componentParent, 'setTargetFramework').and.stub();
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'getCategoryDefinition').and
    .returnValue(observableOf(mockFrameworkData.objectCategoryDefinitionFrameworkData));
    componentParent.userChannelData = _.get(mockFrameworkData, 'userChannelDataWithFrameworkSameAsCategoryDefinition');
    componentParent.orgFWType = _.get(mockFrameworkData.successCategory, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
    spyOn(componentParent, 'getFrameworkDataByType').and.returnValue(observableOf(mockFrameworkData.frameworkSearchByType));
    componentParent.selectFramework();
    expect(componentParent.setTargetFramework).toHaveBeenCalled();
  });

  it('#setTargetFramework() - should create content if targetFWIdentifiers is set', () => {
    spyOn(componentParent, 'createContent').and.stub();
    componentParent.setTargetFramework(
      _.get(mockFrameworkData, 'objectCategoryDefinitionFrameworkData'),
      'nit_k-12',
      ['K-12', 'TPD'],
      [
      {
          'name': 'nit_k-12',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_k-12',
          'description': 'nit_k-12 Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'K-12'
      },
      {
          'name': 'nit_tpd',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_tpd',
          'description': 'nit_tpd Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'TPD'
      }]
    );
    expect(componentParent.createContent).toHaveBeenCalledWith(undefined);
  });

  it('#setTargetFramework() - should throw error if categoryDefinition does not have targetFWType', () => {
    const emptyTargetFWType = {
      'result': {
        'objectCategoryDefinition': {
          'identifier': 'obj-cat:course_collection_01309282781705830427',
          'objectMetadata': {
            'config': {
              'frameworkMetadata': {
                'orgFWType': [
                  'K-12',
                  'TPD'
                ]
              }
            },
            'schema': {
              'properties': {}
            }
          },
          'languageCode': [],
          'name': 'Course',
          'forms': {}
        }
      }
    };
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    componentParent.orgFWType = ['K-12', 'TPD'];
    componentParent.setTargetFramework(
      emptyTargetFWType,
      undefined,
      ['K-12', 'TPD'],
      [
      {
          'name': 'nit_k-12',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_k-12',
          'description': 'nit_k-12 Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'K-12'
      },
      {
          'name': 'nit_tpd',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_tpd',
          'description': 'nit_tpd Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'TPD'
      }]
    );
    expect(toasterService.error).toHaveBeenCalledWith('Unknown framework category Course. Please check the configuration.');
  });

  it('#setTargetFramework() - should create content if targetFWIdentifiers is set but an Array', () => {
    spyOn(componentParent, 'createContent').and.stub();
    componentParent.setTargetFramework(
      _.get(mockFrameworkData, 'objectCategoryDefinitionFrameworkData'),
      ['nit_k-12'],
      ['K-12', 'TPD'],
      [
      {
          'name': 'nit_k-12',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_k-12',
          'description': 'nit_k-12 Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'K-12'
      },
      {
          'name': 'nit_tpd',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_tpd',
          'description': 'nit_tpd Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'TPD'
      }]
    );
    expect(componentParent.createContent).toHaveBeenCalledWith(undefined);
  });

  it('#setTargetFramework() - should create content if targetFWIdentifiers is not set', () => {
    spyOn(componentParent, 'createContent').and.stub();
    componentParent.setTargetFramework(
      _.get(mockFrameworkData, 'objectCategoryDefinitionFrameworkData'),
      undefined,
      ['K-12', 'TPD'],
      [
      {
          'name': 'nit_k-12',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_k-12',
          'description': 'nit_k-12 Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'K-12'
      },
      {
          'name': 'nit_tpd',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_tpd',
          'description': 'nit_tpd Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'TPD'
      }]
    );
    expect(componentParent.createContent).toHaveBeenCalledWith(undefined);
  });

  it('#setTargetFramework() - should throw config error if framework is set incorrectly', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    componentParent.setTargetFramework(
      _.get(mockFrameworkData, 'successCategory'),
      undefined,
      ['K-12', 'TPD'],
      [{
          'name': 'nit_k-12',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_k-12',
          'description': 'nit_k-12 Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'K-12'
      },
      {
          'name': 'nit_tpd',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_tpd',
          'description': 'nit_tpd Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'TPD'
      }]
    );
    expect(toasterService.error).toHaveBeenCalledWith('Unknown framework category Course. Please check the configuration.');
  });

  it('#setTargetFramework() - should make getFrameworkDataByType() api if difference exists', () => {
    spyOn(componentParent, 'createContent').and.stub();
    spyOn(componentParent, 'getFrameworkDataByType').and.returnValue(observableOf(mockFrameworkData.frameworkSearchByType));

    componentParent.setTargetFramework(
      mockFrameworkData.objectCategoryDefinitionFrameworkData,
      undefined,
      ['TPD'],
      [{
          'name': 'nit_k-12',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_k-12',
          'description': 'nit_k-12 Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'K-12'
      }]
    );
    expect(componentParent.createContent).toHaveBeenCalledWith(undefined);
  });

  it('#setTargetFramework() - should make getFrameworkDataByType() api if channelFrameworksType is empty', () => {
    spyOn(componentParent, 'createContent').and.stub();
    spyOn(componentParent, 'getFrameworkDataByType').and.returnValue(observableOf(mockFrameworkData.frameworkSearchByType));

    componentParent.setTargetFramework(
      mockFrameworkData.objectCategoryDefinitionFrameworkData,
      undefined,
      undefined,
      [{
          'name': 'nit_k-12',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_k-12',
          'description': 'nit_k-12 Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'K-12'
      }]
    );
    expect(componentParent.createContent).toHaveBeenCalledWith(undefined);
  });

  it('#setTargetFramework() - should throw error getFrameworkDataByType() api return empty Framework', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(componentParent, 'getFrameworkDataByType').and.returnValue(observableOf({'result': {}}));
    componentParent.setTargetFramework(
      mockFrameworkData.objectCategoryDefinitionFrameworkData,
      undefined,
      ['TPD'],
      [{
          'name': 'nit_k-12',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_k-12',
          'description': 'nit_k-12 Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'K-12'
      }]
    );
    expect(toasterService.error).toHaveBeenCalledWith('Unknown framework category Course. Please check the configuration.');
  });

  it('#setTargetFramework() - should getFrameworkDataByType() throw error', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(componentParent, 'getFrameworkDataByType').and.returnValue(observableThrowError({}));
    componentParent.setTargetFramework(
      mockFrameworkData.objectCategoryDefinitionFrameworkData,
      undefined,
      ['TPD'],
      [{
          'name': 'nit_k-12',
          'relation': 'hasSequenceMember',
          'identifier': 'nit_k-12',
          'description': 'nit_k-12 Framework',
          'objectType': 'Framework',
          'status': 'Live',
          'type': 'K-12'
      }]
    );
    expect(toasterService.error).toHaveBeenCalledWith('Unknown framework category Course. Please check the configuration.');
  });


  it('should create lock to the opened content and redirect to editor after logging an interact event', () => {
    const contentData = { identifier: 'do_123456' };
    spyOn(componentParent, 'logTelemetry').and.stub();
    componentParent.createLockAndNavigateToEditor(contentData);
    expect(componentParent.logTelemetry).toHaveBeenCalledWith('do_123456');
  });

  it('should nvigate to new course ditor', () => {
    const contentData = { identifier: 'do_123456' };
    componentParent.framework = 'NCERT';
    componentParent.contentType = 'course';
    spyOn(componentParent, 'createLockAndNavigateToEditor').and.stub();
    componentParent.createLockAndNavigateToEditor(contentData);
    expect(componentParent.createLockAndNavigateToEditor).toHaveBeenCalledWith(contentData);
  });

  it('should trigger interact event', () => {
    componentParent.contentType = 'Resource';
    componentParent.framework = 'NCFCOPY';
    const telemetryData = {
      context: {
        env: _.get(fakeActivatedRoute, 'snapshot.data.telemetry.env'),
        cdata: [{
          type: 'framework',
          id: componentParent.framework
        }]
      },
      edata: {
        id: 'start-creating-' + componentParent.contentType,
        type: 'click',
        pageid: _.get(fakeActivatedRoute, 'snapshot.data.telemetry.pageid')
      },
      object: {
        id: 'do_123456',
        type: componentParent.contentType,
        ver: '1.0',
        rollup: {},
      }
    };
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact').and.stub();
    componentParent.logTelemetry('do_123456');
    expect(telemetryService.interact).toHaveBeenCalledWith(telemetryData);
  });

  it('#generateQuestionSetData() should return valid metadata', () => {
    const userService = TestBed.get(UserService);
    componentParent.framework = 'NCERT';
    userService._userData$.next({ err: null, userProfile: mockFrameworkData.userMockData });
    userService._userProfile = {};
    const res = componentParent.generateQuestionSetData();
    expect(Object.keys(res)).toContain('questionset');
  });

  it('#getFrameworkDataByType() should fetch framework data by type', () => {
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.returnValue(observableOf(mockFrameworkData.frameworkDataByType));
    const frameworkReq = componentParent.getFrameworkDataByType('k-12', 'sunbird');
    frameworkReq.subscribe((response) => {
      expect(response).toEqual(mockFrameworkData.frameworkDataByType);
    });
  });

  it('should call ngOnDestroy', () => {
    componentParent.modal = {
      deny: jasmine.createSpy('deny')
    };
    componentParent.ngOnDestroy();
    expect(componentParent.modal.deny).toHaveBeenCalled();
  });
});
