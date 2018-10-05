import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { ContentService, CoreModule } from '@sunbird/core';
import { SharedModule, ResourceService, ConfigService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { RequestChangesPopupComponent } from './request-changes-popup.component';
import { WorkSpaceService } from './../../services';
import { mockRes } from './request-change-pop.component.spec.data';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
describe('RequestChangesPopupComponent', () => {
  let component: RequestChangesPopupComponent;
  let fixture: ComponentFixture<RequestChangesPopupComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const resourceBundle = {
    'messages': {
      'smsg': {
        'm0005': 'Content rejected successfully...'
      },
      'fmsg': {
        'm0020': 'Rejecting content failed, please try again later...'
      },
      'emsg': {
        'm0005': 'Something went wrong please try again later'
      },
    },
    'frmelmnts': {
      'btn': {
        'checkListPublish': 'Publish',
        'checklistCancel': 'Cancel'
      }
    }
  };

  const fakeActivatedRoute = {
    parent: { params: observableOf({ contentId: 'do_112485749070602240134' }) },
    snapshot: { parent: { url: [{ path: 'do_112485749070602240134', }], } }
  };

  const successResponse = {
    'id': 'api.content.reject',
    'ver': '1.0',
    'ts': '2018-08-14T06:50:02.128Z',
    'params': {
      'resmsgid': '44aed100-9f8e-11e8-a42e-8d80f5a79851',
      'msgid': '4490c1b0-9f8e-11e8-98b7-6dc4760abe27',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'node_id': 'do_112563553517920256119',
      'versionKey': '1534229402086'
    }
  };

  const errorResponse = {
    'id': 'api.content.reject',
    'ver': '1.0',
    'ts': '2018-08-14T06:46:37.977Z',
    'params': {
      'resmsgid': 'caffd890-9f8d-11e8-a42e-8d80f5a79851',
      'msgid': null,
      'status': 'failed',
      'err': 'ERR_TOKEN_FIELD_MISSING',
      'errmsg': 'Required field token is missing'
    },
    'responseCode': 'UNAUTHORIZED_ACCESS',
    'result': {}
  };
  const navigationHelperServiceStub = {
    getPreviousUrl: () => ({})
};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SharedModule.forRoot(), CoreModule.forRoot()],
      declarations: [RequestChangesPopupComponent],
      providers: [ToasterService, NavigationHelperService, WorkSpaceService, SuiModalService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle },
        { provide: NavigationHelperService, useValue: navigationHelperServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestChangesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should initialize the component expected calls for getCheckListConfig  ', () => {
    const workspaceservice = TestBed.get(WorkSpaceService);
    component.contentId = fakeActivatedRoute.parent.params['contentId'];
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    const navigationHelperService: NavigationHelperService = fixture.debugElement.injector.get(NavigationHelperService);
    spyOn(workspaceservice, 'getFormData').and.callFake(() => observableOf(mockRes.requestChangesChecklist));
    spyOn(component, 'getCheckListConfig').and.callThrough();
    component.getCheckListConfig();
    component.ngOnInit();
    expect(component.getCheckListConfig).toHaveBeenCalledWith();
    expect(component.showModal).toBeTruthy();
    expect(component.showloader).toBeFalsy();
    expect(component.rejectCheckListData).toBeDefined();
  });

  it('should enable the showWrongCheckList expected calls for getCheckListConfig  ', () => {
    const workspaceservice = TestBed.get(WorkSpaceService);
    component.contentId = fakeActivatedRoute.parent.params['contentId'];
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    const navigationHelperService: NavigationHelperService = fixture.debugElement.injector.get(NavigationHelperService);
    spyOn(workspaceservice, 'getFormData').and.callFake(() => observableOf(mockRes.requestChangesChecklistWrongConfig));
    spyOn(component, 'getCheckListConfig').and.callThrough();
    component.getCheckListConfig();
    component.ngOnInit();
    expect(component.getCheckListConfig).toHaveBeenCalledWith();
    expect(component.showModal).toBeTruthy();
    expect(component.showloader).toBeFalsy();
    expect(component.showDefaultConfig).toBeTruthy();
    expect(component.rejectCheckListData).toBeDefined();
  });
  it('should call closeModalAfterError and makes expected calls', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    toasterService.error(resourceBundle.messages.emsg);
    fixture.detectChanges();
    component.closeModalAfterError();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg);
    expect(component.showloader).toBeFalsy();
    expect(component.showModal).toBeFalsy();
  });
  it('reasons defaults to: []', () => {
    expect(component.reasons).toEqual([]);
  });
  it('isDisabled defaults to: true', () => {
    expect(component.isDisabled).toEqual(true);
  });
  it('showDefaultConfig defaults to: false', () => {
    expect(component.showDefaultConfig).toEqual(false);
  });

  it('showloader defaults to: true', () => {
    expect(component.showloader).toEqual(true);
  });

  it('showModal defaults to: false', () => {
    expect(component.showModal).toEqual(false);
  });
  it('should validate modal when it validation passes', () => {
    component.reasons = ['Others'];
    component.comment = 'Test';
    component.validateModal();
    expect(component.isDisabled).toBe(false);
  });

  it('should validate modal when it validation fails', () => {
    component.validateModal();
    expect(component.isDisabled).toBe(true);
  });
  it('should call reject api and get success', () => {
    component.showModal = true;
    component.closeUrl =  {url: '/workspace/content/upForReview/content/do_11256352025089638413'};
    const contentService = TestBed.get(ContentService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = resourceBundle.messages;
    spyOn(contentService, 'post').and.callFake(() => observableOf(successResponse));
    spyOn(toasterService, 'success').and.callThrough();
    fixture.detectChanges();
    component.submitRequestChanges();
    expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0005);
  });
  it('should call reject api and get error', () => {
    component.showModal = true;
    const contentService = TestBed.get(ContentService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = resourceBundle.messages;
    spyOn(contentService, 'post').and.callFake(() => observableThrowError(errorResponse));
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'redirect').and.callThrough();
    fixture.detectChanges();
    component.submitRequestChanges();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0020);
    expect(component.redirect).toHaveBeenCalled();
  });
  it('should  call createCheckedArray and add new item to reason array ', () => {
    component.createCheckedArray('Has Sexual content, Nudity or Vulgarity');
    expect(component.reasons.length).toEqual(1);
    expect(component.isDisabled).toBe(true);
  });
  it('should call createCheckedArray and remove item which exits in reason array ', () => {
    component.reasons = ['Has Sexual content, Nudity or Vulgarity'];
    component.createCheckedArray('Has Sexual content, Nudity or Vulgarity');
    expect(component.reasons.length).toEqual(0);
    expect(component.isDisabled).toBe(true);
  });
});
