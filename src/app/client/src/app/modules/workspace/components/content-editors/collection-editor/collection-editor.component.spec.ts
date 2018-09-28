
import { of as observableOf, throwError } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CollectionEditorComponent } from './collection-editor.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { TelemetryModule } from '@sunbird/telemetry';
import { NavigationHelperService, ResourceService, ConfigService, ToasterService, BrowserCacheTtlService } from '@sunbird/shared';
import { EditorService } from '@sunbird/workspace';
import { ContentService, UserService, LearnerService, CoreModule, TenantService } from '@sunbird/core';
import { mockRes } from './collection-editor.component.spec.data';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkSpaceService } from '../../../services';

const mockResourceService = { messages: { emsg: { m0004: '1000' } } };
const mockActivatedRoute = {
  snapshot: {
    params: {
      'contentId': 'do_21247940906829414411032',
      'type': 'collection', 'state': 'upForReview', 'framework': 'framework'
    }
  }
};
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
const mockUserService = { userProfile: { userId: '68777b59-b28b-4aee-88d6-50d46e4c35090'} };
describe('CollectionEditorComponent', () => {
  let component: CollectionEditorComponent;
  let fixture: ComponentFixture<CollectionEditorComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionEditorComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule, CoreModule.forRoot(), TelemetryModule.forRoot()],
      providers: [
        EditorService, UserService, ContentService,
        ResourceService, ToasterService, ConfigService, LearnerService,
        NavigationHelperService, BrowserCacheTtlService, WorkSpaceService,
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
    expect(navigationHelperService.navigateToWorkSpace).toHaveBeenCalledWith('workspace/content/draft/1');
  }));
});
