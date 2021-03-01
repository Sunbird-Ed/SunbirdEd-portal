import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService, NavigationHelperService, ToasterService, ResourceService, BrowserCacheTtlService, LayoutService } from '@sunbird/shared';
import { UserService, PublicDataService, ContentService, FrameworkService, CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
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

const mockResourceService = { messages: { emsg: { m0015: '1000' } } };
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
class NavigationHelperServiceStub { }
const mockUserService = {
  userOrgDetails$: observableOf({}),
  userProfile: {
    userId: '68777b59-b28b-4aee-88d6-50d46e4c35090',
  },
  channel: 'sunbird'
};

const mockFrameworkService = {
  _channelData: {
    questionPrimaryCategories: ['Multiple Choice Question', 'Subjective Question']
  }
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
        ResourceService, ToasterService, ConfigService, LayoutService,
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch collection details if api return data',
    inject([EditorService], (editorService) => {
      spyOn(editorService, 'getContent').and.returnValue(observableOf(mockRes.successResult));
      spyOn(component, 'getFrameWorkDetails').and.callFake(() => { });
      component.ngOnInit();
      expect(component.collectionDetails).toBeDefined();
      expect(component.showQuestionEditor).toBeTruthy();
      expect(component.getFrameWorkDetails).toHaveBeenCalled();
    }));

  xit('should throw error if getting collection details fails',
    inject([EditorService], (editorService) => {
      spyOn(editorService, 'getContent').and.returnValue(throwError({}));
      spyOn(component, 'getFrameWorkDetails').and.callFake(() => { });
      component.ngOnInit();
      expect(component.collectionDetails).toBeUndefined();
      expect(component.showQuestionEditor).toBeFalsy();
      expect(component.getFrameWorkDetails).not.toHaveBeenCalled();
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
    component.editorEventListener({});
    expect(component.redirectToWorkSpace).toHaveBeenCalled();
  });

  xit('#redirectToWorkSpace() should redirect to workspace with valid #URL',
    inject([NavigationHelperService], (navigationHelperService) => {
      spyOn(navigationHelperService, 'navigateToWorkSpace').and.callFake(() => { });
      component.redirectToWorkSpace();
      expect(navigationHelperService.navigateToWorkSpace).toHaveBeenCalled();
      expect(navigationHelperService.navigateToWorkSpace).toHaveBeenCalledWith('/workspace/content/draft/1');
    }));

});
