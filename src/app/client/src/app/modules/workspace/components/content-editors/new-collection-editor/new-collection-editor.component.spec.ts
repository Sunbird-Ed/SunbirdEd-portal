import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService, NavigationHelperService, ToasterService, ResourceService, BrowserCacheTtlService, LayoutService } from '@sunbird/shared';
import { UserService, PublicDataService, ContentService, FrameworkService, CoreModule } from '@sunbird/core';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of as observableOf, throwError } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';
import { WorkSpaceService, EditorService } from '../../../services';
import { NewCollectionEditorComponent } from './new-collection-editor.component';
import { mockRes } from './new-collection-editor.component.spec.data';
document.body.innerHTML = document.body.innerHTML +
  '<input id="deviceId" value="1234gdjhgasd7687"'
  + ' type="hidden" />' + '<input id="buildNumber" value="3.7.0.fa504a4"'
  + ' type="hidden" />';

const mockResourceService = { messages: {
  emsg: {
    m0015: '1000',
    m0004: 'Cannot preview now. Try again later',
    m0013: 'You dont have permission to edit this content'}
  }
};
const mockActivatedRoute = {
  snapshot: {
    params: {
      'contentId': 'do_21247940906829414411032', 'state': 'allcontent', 'framework': 'framework'
    }
  }
};
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
class NavigationHelperServiceStub { navigateToWorkSpace() { } }
const mockUserService = {
  userOrgDetails$: observableOf({}),
  userProfile: {
    id: '68777b59-b28b-4aee-88d6-50d46e4c35090',
    firstName: 'N11',
    userId: '68777b59-b28b-4aee-88d6-50d46e4c35090',
    rootOrgAdmin: true
  },
  channel: 'sunbird'
};

const mockFrameworkService = {
  _channelData: {
    questionPrimaryCategories: ['Multiple Choice Question', 'Subjective Question']
  },
  getDefaultLicense : () => {}
};

describe('NewCollectionEditorComponent', () => {
  let component: NewCollectionEditorComponent;
  let fixture: ComponentFixture<NewCollectionEditorComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewCollectionEditorComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, CoreModule, TelemetryModule.forRoot()],
      providers: [
        UserService, PublicDataService, ContentService, { provide: FrameworkService, useValue: mockFrameworkService },
        ResourceService, ToasterService, ConfigService, LayoutService, TelemetryService,
        BrowserCacheTtlService, WorkSpaceService, EditorService,
        { provide: NavigationHelperService, useClass: NavigationHelperServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: mockResourceService },
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCollectionEditorComponent);
    component = fixture.componentInstance;
    component.editorConfig = mockRes.editorConfig;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getFrameWorkDetails() workSpaceService.getCategoryDefinition and call setEditorConfig',
    inject([EditorService, WorkSpaceService], (editorService, workSpaceService) => {
      component.collectionDetails = {
        mimeType: 'application/vnd.ekstep.content-collection',
        primaryCategory: 'Course'
      };
      spyOn(workSpaceService, 'getCategoryDefinition').and.returnValue(observableOf(mockRes.categoryRead));
      spyOn(component, 'setEditorConfig').and.callFake(() => { });
      component.getFrameWorkDetails();
      expect(component.hierarchyConfig).toBeDefined();
      expect(component.showQuestionEditor).toBeFalsy();
      expect(component.setEditorConfig).toHaveBeenCalled();
  }));

  it('should throw error if getting collection details fails',
    inject([EditorService], (editorService) => {
      component['routeParams'] = {type: 'Course'};
      spyOn(editorService, 'getContent').and.returnValue(throwError({}));
      spyOn(component, 'getFrameWorkDetails').and.callFake(() => { });
      component.ngOnInit();
      expect(component.collectionDetails).toBeUndefined();
      expect(component.showQuestionEditor).toBeFalsy();
      expect(component.getFrameWorkDetails).not.toHaveBeenCalled();
  }));

  it('#getCollectionDetails() should call editorService.getContent when type is course',
  inject([EditorService],
    (editorService) => {
      component['routeParams'] = {type: 'Course'};
      spyOn(editorService, 'getContent').and.returnValue(observableOf(mockRes.getContentSucessRes));
      spyOn(component, 'getCollectionDetails').and.callThrough();
      component.getCollectionDetails();
      expect(editorService.getContent).toHaveBeenCalled();
  }));

  it('#getCollectionDetails() should call workspaceService.getQuestion when type is QuestionSet',
  inject([WorkSpaceService],
    (workspaceService) => {
      component['routeParams'] = {type: 'QuestionSet'};
      spyOn(workspaceService, 'getQuestion').and.returnValue(observableOf(mockRes.questionsetSuccessResult));
      spyOn(component, 'getCollectionDetails').and.callThrough();
      component.getCollectionDetails();
      expect(workspaceService.getQuestion).toHaveBeenCalled();
  }));

  it('should fetch collection details and set collection details if success',
  inject([EditorService],
    (editorService) => {
      spyOn(editorService, 'getContent').and.returnValue(observableOf(mockRes.successResult));
      spyOn(editorService, 'getOwnershipType').and.returnValue(observableOf(['CreatedBy', 'CreatedFor']));
      component.ngOnInit();
      expect(component['routeParams']).toBeDefined();
      expect(component.collectionDetails).toBeDefined();
  }));

  it('should navigate to draft', inject([Router, NavigationHelperService], (router, navigationHelperService) => () => {
    component['routeParams'] = {state: 'xyz'};
    spyOn(navigationHelperService, 'navigateToWorkSpace').and.callFake(() => { });
    component.redirectToWorkSpace();
    // expect(component.redirectToWorkSpace).toHaveBeenCalled();
    expect(navigationHelperService.navigateToWorkSpace).toHaveBeenCalledWith('workspace/content/draft/1');
  }));

  it('should throw error if dont have permission to edit this content',
  inject([EditorService, UserService, Router, ToasterService, ResourceService],
    (editorService, userService, router, toasterService, resourceService) => {
      spyOn(editorService, 'getContent').and.returnValue(throwError('NO_PERMISSION'));
      spyOn(toasterService, 'error').and.callFake(() => {});
      component.ngOnInit();
      expect(component['routeParams']).toBeDefined();
      expect(toasterService.error).toHaveBeenCalled();
  }));

  it('should fetch framework details if api return data',
    inject([WorkSpaceService], (workSpaceService) => {
      component.collectionDetails = mockRes.successResult.result.content;
      component.editorConfig = mockRes.editorConfig;
      spyOn(workSpaceService, 'getCategoryDefinition').and.returnValue(observableOf(mockRes.frameworkSuccessResult));
      spyOn(component, 'setEditorConfig').and.callFake(() => { });
      spyOn(component, 'getPrimaryCategoryData').and.callFake(() => { });
      component.getFrameWorkDetails();
      expect(component.setEditorConfig).toHaveBeenCalled();
      expect(component.getPrimaryCategoryData).toHaveBeenCalled();
      expect(component.showLoader).toBeFalsy();
  }));

  it('should throw error if getting framework details fails',
    inject([WorkSpaceService, ToasterService], (workSpaceService, toasterService) => {
      component.collectionDetails = mockRes.successResult.result.content;
      spyOn(workSpaceService, 'getCategoryDefinition').and.returnValue(throwError({}));
      spyOn(toasterService, 'error').and.callThrough();
      component.getFrameWorkDetails();
      expect(toasterService.error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0015);
  }));

  it('#switchLayout() should switch theme if layoutType is #joy',
    inject([LayoutService], ( layoutService ) => {
      spyOn(layoutService, 'initiateSwitchLayout').and.callThrough();
      component.layoutType = 'joy';
      component.switchLayout();
      expect(layoutService.initiateSwitchLayout).toHaveBeenCalled();
  }));

  it('#switchLayout() should not switch theme if layoutType is not #joy',
    inject([LayoutService], ( layoutService ) => {
      spyOn(layoutService, 'initiateSwitchLayout').and.callThrough();
      component.layoutType = '';
      component.switchLayout();
      expect(layoutService.initiateSwitchLayout).not.toHaveBeenCalled();
  }));

  it('#getPrimaryCategoryData() should return valid Categories', () => {
    let result = component.getPrimaryCategoryData({ Question: [] });
    expect(result).toEqual({ Question: ['Multiple Choice Question', 'Subjective Question'] });
    result = component.getPrimaryCategoryData({ Content: [] });
    expect(result).toEqual({ Content: [] });
    result = component.getPrimaryCategoryData({ Collection: [] });
    expect(result).toEqual({ Collection: [] });
    result = component.getPrimaryCategoryData({ QuestionSet: [] });
    expect(result).toEqual({ QuestionSet: [] });
  });

  it('#editorEventListener() should call #redirectToWorkSpace method', () => {
    spyOn(component, 'redirectToWorkSpace').and.callFake(() => { });
    component['routeParams'] = {
      contentStatus: 'Published'};
    component.editorEventListener({});
    expect(component.redirectToWorkSpace).toHaveBeenCalled();
  });

  it('#editorEventListener() should call #retireLock method', () => {
    spyOn(component, 'retireLock').and.callFake(() => { });
    component['routeParams'] = {
      contentStatus: 'Draft'};
    component.editorEventListener({});
    expect(component.retireLock).toHaveBeenCalled();
  });

  it('#setEditorConfig() should set editor config',
  inject([FrameworkService], (frameworkService) => {
    spyOn(frameworkService, 'getDefaultLicense').and.callFake( () => {});
    component.collectionDetails = mockRes.successResult.result.content;
    component.showQuestionEditor = true;
    component.ngOnInit();
    expect(component['routeParams']).toBeDefined();
    component.setEditorConfig();
    expect(frameworkService.getDefaultLicense).toHaveBeenCalled();
    expect(Object.keys(component.editorConfig)).toEqual(['context', 'config']);
  }));

  it('#redirectToWorkSpace() should redirect to workspace with valid #URL',
  inject([NavigationHelperService], (navigationHelperService) => {
    spyOn(navigationHelperService, 'navigateToWorkSpace').and.callFake(() => { });
    component.ngOnInit();
    expect(component['routeParams']).toBeDefined();
    component.redirectToWorkSpace();
    expect(navigationHelperService.navigateToWorkSpace).toHaveBeenCalledWith('/workspace/content/allcontent/1');
    const activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.snapshot.params = {state: 'collaborating-on'};
    component.ngOnInit();
    expect(component['routeParams']).toBeDefined();
    component.redirectToWorkSpace();
    expect(navigationHelperService.navigateToWorkSpace).toHaveBeenCalledWith('/workspace/content/collaborating-on/1');
    activatedRoute.snapshot.params = {state: 'upForReview'};
    component.ngOnInit();
    expect(component['routeParams']).toBeDefined();
    component.redirectToWorkSpace();
    expect(navigationHelperService.navigateToWorkSpace).toHaveBeenCalledWith('/workspace/content/upForReview/1');
    activatedRoute.snapshot.params = {state: ''};
    component.ngOnInit();
    expect(component['routeParams']).toBeDefined();
    component.redirectToWorkSpace();
    expect(navigationHelperService.navigateToWorkSpace).toHaveBeenCalledWith('/workspace/content/draft/1');
  }));

  it('#getDetails() should call lockContent method if lockInfo is empty',
  inject([EditorService], (editorService) => {
    component['queryParams'] = {};
    component['routeParams'] = {
      contentId: 'do_12345',
      type: 'course',
      framework: undefined,
      state: 'draft',
      contentStatus: 'draft'
    };
    spyOn(editorService, 'getContent').and.returnValue(observableOf(mockRes.successResult));
    spyOn(editorService, 'getOwnershipType').and.returnValue(observableOf(['CreatedBy', 'CreatedFor']));
    spyOn(component, 'lockContent').and.callFake(() => { });
    component.getDetails();
    expect(editorService.getOwnershipType).toHaveBeenCalled();
    expect(component.lockContent).toHaveBeenCalled();
  }));

  it('#getDetails() should not call lockContent method if lockInfo is not empty',
  inject([EditorService], (editorService) => {
    component['queryParams'] = {lockKey: '59bee37d-1ace-4d2d-92d7-f0c49148dc0d',
    expiresAt: '2021-07-01T12:03:45.375Z',
    expiresIn: 60};
    component['routeParams'] = {
      contentId: 'do_12345',
      type: 'course',
      framework: undefined
    };
    spyOn(editorService, 'getContent').and.returnValue(observableOf(mockRes.successResult));
    spyOn(editorService, 'getOwnershipType').and.returnValue(observableOf(['CreatedBy', 'CreatedFor']));
    spyOn(component, 'lockContent').and.callFake(() => { });
    component.getDetails();
    expect(editorService.getOwnershipType).toHaveBeenCalled();
    expect(component.lockContent).not.toHaveBeenCalled();
  }));

  it('#lockContent() should call worspaceService.lockContent',
  inject([WorkSpaceService], (workSpaceService) => {
    component['routeParams'] = {
      contentId: 'do_12345',
      type: 'course',
      framework: undefined
    };
    component.editorConfig = mockRes.editorConfig;
    spyOn(component, 'redirectToWorkSpace').and.returnValue(observableOf({}));
    spyOn(workSpaceService, 'lockContent').and.returnValue(observableOf({}));
    component.lockContent();
    expect(workSpaceService.lockContent).toHaveBeenCalled();
  }));

  it('#retireLock() should call #redirectToWorkSpace() method if success',
  inject([WorkSpaceService], (workSpaceService) => {
    component['routeParams'] = {contentId: 'do_12345'};
    component.editorConfig = mockRes.editorConfig;
    spyOn(workSpaceService, 'retireLock').and.returnValue(observableOf({}));
    spyOn(component, 'redirectToWorkSpace').and.callThrough();
    component.retireLock();
    expect(workSpaceService.retireLock).toHaveBeenCalled();
    expect(component.redirectToWorkSpace).toHaveBeenCalled();
  }));

  it('#retireLock() should call worspaceService.retireLock method if success',
  inject([WorkSpaceService], (workSpaceService) => {
    component['routeParams'] = {contentId: 'do_12345'};
    component.editorConfig = mockRes.editorConfig;
    spyOn(workSpaceService, 'retireLock').and.returnValue(throwError({}));
    spyOn(component, 'redirectToWorkSpace').and.callThrough();
    component.retireLock();
    expect(workSpaceService.retireLock).toHaveBeenCalled();
    expect(component.redirectToWorkSpace).toHaveBeenCalled();
  }));

  it('#validateRequest() should return false', () => {
    component.collectionDetails = {status: 'Draft',
    createdBy: '68777b59-b28b-4aee-88d6-50d46e4c350956',
    mimeType: 'application/vnd.sunbird.questionset'};
    component['routeParams'] = {state: 'allcontent'};
    spyOn(component, 'validateRequest').and.callThrough();
    const validation = component.validateRequest();
    expect(validation).toBeFalsy();
  });

  it('#ngOnInit() should call the methods on success', () => {
    component.collectionDetails = {mimeType : 'application/vnd.sunbird.questionset'};
    spyOn(component, 'getDetails').and.returnValue(observableOf(mockRes.getDetailsReturnData));
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'switchLayout').and.callFake(() => { });
    spyOn(component, 'getFrameWorkDetails').and.callFake(() => { });
    spyOn(component, 'loadScripts').and.callFake(() => { });
    component.ngOnInit();
    expect(component.switchLayout).toHaveBeenCalled();
    expect(component.showLoader).toBeTruthy();
    expect(component.showQuestionEditor).toBeTruthy();
    expect(component.getFrameWorkDetails).toHaveBeenCalled();
    expect(component.loadScripts).toHaveBeenCalled();
  });

  it('#ngOnInit() should call  redirectToWorkSpace methods on NO_PERMISSION error', () => {
    component.collectionDetails = {mimeType : 'application/vnd.sunbird.questionset'};
    spyOn(component, 'getDetails').and.returnValue(throwError('NO_PERMISSION'));
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'redirectToWorkSpace').and.callFake(() => { });
    component.ngOnInit();
    expect(component.redirectToWorkSpace).toHaveBeenCalled();
  });

  it('#ngOnInit() should call retireLock when get api error', () => {
    component.collectionDetails = {mimeType : 'application/vnd.sunbird.questionset'};
    spyOn(component, 'getDetails').and.returnValue(throwError(mockRes.lockError));
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'retireLock').and.callFake(() => { });
    component.ngOnInit();
    expect(component.retireLock).toHaveBeenCalled();
  });

  it('#ngOnInit() should call redirectToWorkSpace when get error', () => {
    component.collectionDetails = {mimeType : 'application/vnd.sunbird.questionset'};
    spyOn(component, 'getDetails').and.returnValue(throwError({}));
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'redirectToWorkSpace').and.callFake(() => { });
    component.ngOnInit();
    expect(component.redirectToWorkSpace).toHaveBeenCalled();
  });

  it('Should generate interact telemetry event', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact').and.callThrough();
    component.collectionDetails = mockRes.successResult.result.content;
    component['generateInteractEvent']({});
    expect(telemetryService.interact).toHaveBeenCalled();
  });

  it('Should disable browser back button', fakeAsync(() => {
    const workSpaceService = TestBed.get(WorkSpaceService);
    spyOn(workSpaceService, 'browserBackEvent').and.returnValue(observableOf({}));
    spyOn(workSpaceService, 'newtoggleWarning').and.callThrough();
    spyOn(component, 'generateInteractEvent').and.callThrough();
    component.collectionDetails = mockRes.successResult.result.content;
    component['routeParams'] = {type: 'Course'};
    component['disableBrowserBackButton']();
    expect(workSpaceService.newtoggleWarning).toHaveBeenCalledWith('Course');
    workSpaceService.browserBackEvent.emit();
    tick(1000);
    expect(component.generateInteractEvent).toHaveBeenCalled();
  }));

});
