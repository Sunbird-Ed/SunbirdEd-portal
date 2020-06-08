
import { of as observableOf, throwError } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CollectionEditorComponent } from './collection-editor.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { NavigationHelperService, ResourceService, ConfigService, ToasterService, BrowserCacheTtlService } from '@sunbird/shared';
import { EditorService } from '@sunbird/workspace';
import { ContentService, UserService, LearnerService, CoreModule, TenantService, FrameworkService } from '@sunbird/core';
import { mockRes } from './collection-editor.component.spec.data';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkSpaceService } from '../../../services';
import { configureTestSuite } from '@sunbird/test-util';

document.body.innerHTML = document.body.innerHTML +
  '<input id="collectionEditorURL" value="https://dev.sunbirded.org/collection-editor/index.html"'
  + ' type="hidden" />';

const mockResourceService = { messages: { emsg: { m0004: '1000' } } };
const mockActivatedRoute = {
  snapshot: {
    params: {
      'contentId': 'do_21247940906829414411032',
      'type': 'collection', 'state': 'upForReview', 'framework': 'framework',
      'contentStatus': 'Review'
    }
  }
};
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
class NavigationHelperServiceStub {
  public navigateToWorkSpace() {}
}
const mockUserService = {
  userOrgDetails$ : observableOf({}),
  userProfile: {
  userId: '68777b59-b28b-4aee-88d6-50d46e4c35090',
  organisationIds: [],
  framework: {
    board: ['CBSE']
  }
}};
describe('CollectionEditorComponent', () => {
  let component: CollectionEditorComponent;
  let fixture: ComponentFixture<CollectionEditorComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionEditorComponent],
      imports: [HttpClientTestingModule, CoreModule, TelemetryModule.forRoot()],
      providers: [
        EditorService, UserService, ContentService,
        ResourceService, ToasterService, ConfigService, LearnerService,
        BrowserCacheTtlService, WorkSpaceService,
        {provide: NavigationHelperService, useClass: NavigationHelperServiceStub},
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
    fixture = TestBed.createComponent(CollectionEditorComponent);
    component = fixture.componentInstance;
  });

  it('should fetch tenant and collection details and set logo and collection details if success',
  inject([EditorService, ToasterService, TenantService, WorkSpaceService, FrameworkService, UserService],
    (editorService, toasterService, tenantService, workspaceService, frameworkService, userService) => {
      frameworkService._frameWorkData$ = mockRes.frameworkData;
      frameworkService._frameworkData$.next({
      err: null, frameworkdata: mockRes.frameworkData
      });
      tenantService._tenantData$.next({ err: null, tenantData: mockRes.tenantMockData });
      spyOn(editorService, 'getContent').and.returnValue(observableOf(mockRes.successResult));
      spyOn(workspaceService, 'toggleWarning').and.callFake(() => { });
      spyOn(jQuery.fn, 'iziModal').and.callFake(() => { });
      spyOn(toasterService, 'error').and.callFake(() => {});
      spyOn(editorService, 'getOwnershipType').and.returnValue(observableOf(['CreatedBy', 'CreatedFor']));
      component.ngOnInit();
      expect(component.logo).toBeDefined();
      expect(component.collectionDetails).toBeDefined();
      expect(component.showLoader).toBeFalsy();
      expect(jQuery.fn.iziModal).toHaveBeenCalled();
      expect(window.config).toBeDefined();
      expect(window.context).toBeDefined();
      expect(window.context.ownershipType).toEqual(['CreatedBy', 'CreatedFor']);
    }));

  it('should throw error if getting content details fails',
  inject([EditorService, UserService, Router, ToasterService, ResourceService, TenantService],
    (editorService, userService, router, toasterService, resourceService, tenantService) => {
      tenantService._tenantData$.next({ err: null, tenantData: mockRes.tenantMockData });
      spyOn(editorService, 'getContent').and.returnValue(throwError(mockRes.successResult));
      spyOn(toasterService, 'error').and.callFake(() => {});
      component.ngOnInit();
      expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0004);
    }));

  it('should navigate to draft', inject([Router, NavigationHelperService], (router, navigationHelperService) => () => {
    spyOn(navigationHelperService, 'navigateToWorkSpace').and.callFake(() => { });
    component.closeModal();
    expect(component.redirectToWorkSpace).toHaveBeenCalled();
    expect(navigationHelperService.navigateToWorkSpace).toHaveBeenCalledWith('workspace/content/draft/1');
  }));

  it('should call retire method', inject([Router, NavigationHelperService], (router, navigationHelperService) => () => {
    spyOn(component, 'retireLock');
    component.closeModal();
    expect(component.retireLock).toHaveBeenCalled();
  }));

  it('should set window config nodeDisplayCriteria to CourseUnit if the content type is CurriculumCourse', () => {
    component['routeParams'] = {type: 'curriculumcourse'};
    const windowConfigData = { contentType: ['CourseUnit'] };
    spyOn<any>(component, 'updateModeAndStatus').and.stub();
    component['setWindowConfig']();
    expect(window.config.nodeDisplayCriteria).toEqual(windowConfigData);
  });

  it('should pass user selected board in the context for courses', () => {
    const userService = TestBed.get(UserService);
    component['userProfile'] = userService.userProfile;
    component['routeParams'] = {type: 'course'};
    component['setWindowContext']();
    expect(window.context.board).toEqual(['CBSE']);
  });
});
