
import { of as observableOf, throwError } from 'rxjs';
import { async, ComponentFixture, TestBed, inject, tick } from '@angular/core/testing';
import { ContentEditorComponent } from './content-editor.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavigationHelperService, ResourceService, ConfigService, ToasterService, BrowserCacheTtlService } from '@sunbird/shared';
import { EditorService } from '@sunbird/workspace';
import { ContentService, UserService, LearnerService, TenantService, CoreModule } from '@sunbird/core';
import { mockRes } from './content-editor.component.spec.data';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkSpaceService } from '../../../services';
import { TelemetryModule } from '@sunbird/telemetry';

const mockResourceService = { messages: { emsg: { m0004: '1000' } } };
const mockActivatedRoute = {
  snapshot: {
    params: {
      'contentId': 'do_21247940906829414411032', 'state': 'upForReview', 'framework': 'framework', 'contentStatus': 'Review'
    }
  }
};
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
class NavigationHelperServiceStub {
  public navigateToWorkSpace() {}
}
const mockUserService = { userProfile: { userId: '68777b59-b28b-4aee-88d6-50d46e4c35090'} };
describe('ContentEditorComponent', () => {
  let component: ContentEditorComponent;
  let fixture: ComponentFixture<ContentEditorComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentEditorComponent],
      imports: [HttpClientTestingModule, CoreModule, TelemetryModule.forRoot()],
      providers: [
        EditorService, UserService, ContentService, BrowserCacheTtlService,
        ResourceService, ToasterService, ConfigService, LearnerService,
        WorkSpaceService,
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
    fixture = TestBed.createComponent(ContentEditorComponent);
    component = fixture.componentInstance;
  });

  it('should fetch tenant and content details and set logo and collection details if success',
  inject([EditorService, ToasterService, TenantService, WorkSpaceService],
    (editorService, toasterService, tenantService, workspaceService) => {
      tenantService._tenantData$.next({ err: null, tenantData: mockRes.tenantMockData });
      spyOn(editorService, 'getContent').and.returnValue(observableOf(mockRes.successResult));
      spyOn(workspaceService, 'toggleWarning').and.callFake(() => { });
      spyOn(jQuery.fn, 'iziModal').and.callFake(() => { });
      spyOn(toasterService, 'error').and.callFake(() => {});
      spyOn(editorService, 'getOwnershipType').and.returnValue(observableOf(['CreatedBy', 'CreatedFor']));
      component.ngOnInit();
      expect(component.logo).toBeDefined();
      expect(component.contentDetails).toBeDefined();
      expect(component.showLoader).toBeFalsy();
      expect(jQuery.fn.iziModal).toHaveBeenCalled();
      expect(window.config).toBeDefined();
      expect(window.context).toBeDefined();
      expect(window.context.ownershipType).toEqual(['CreatedBy', 'CreatedFor']);
    }));

  it('should throw error if getting collection details fails',
  inject([EditorService, UserService, Router, ToasterService, ResourceService, TenantService],
    (editorService, userService, router, toasterService, resourceService, tenantService) => {
      tenantService._tenantData$.next({ err: null, tenantData: mockRes.tenantMockData });
      spyOn(editorService, 'getContent').and.returnValue(throwError(mockRes.successResult));
      spyOn(toasterService, 'error').and.callFake(() => {});
      component.ngOnInit();
      expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0004);
    }));

  it('should navigate to draft', inject([ NavigationHelperService], ( navigationHelperService) => () => {
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
});
