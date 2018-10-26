
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
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
import { PublishedPopupComponent } from './published-popup.component';
import { WorkSpaceService } from './../../services';
import {mockRes} from './published-popup.component.spec.data';
describe('PublishedPopupComponent', () => {
  let component: PublishedPopupComponent;
  let fixture: ComponentFixture<PublishedPopupComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const resourceBundle = {
    'messages': {
      'smsg': {
        'm0004': 'Content published successfully...'
      },
      'fmsg': {
        'm0019': 'Publishing content failed, please try again later...'
      },
      'emsg': {
        'm0005': 'Something went wrong please try again later'
      }
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
    'id': 'api.content.publish', 'ver': '1.0', 'ts': '2018-05-14T10:07:40.020Z',
    'params': {
      'resmsgid': 'a2888b40-575e-11e8-9d70-1b9b59839e94', 'msgid': 'a23c18f0-575e-11e8-8c9c-158fb3302a71',
      'status': 'successful', 'err': null, 'errmsg': null
    }, 'responseCode': 'OK',
    'result': {
      'content_id': 'do_11246655157836185618',
      'publishStatus': 'Publish Operation for Content Id do_11246655157836185618 Started Successfully!'
    }
  };

  const errorResponse = {
    'id': 'api.content.publish', 'ver': '1.0', 'ts': '2018-05-14T10:12:45.139Z',
    'params': {
      'resmsgid': '58660230-575f-11e8-97d3-b1c7504700f9', 'msgid': null,
      'status': 'failed', 'err': 'ERR_CONTENT_PUBLISH_FIELDS_MISSING',
      'errmsg': 'Required fields for publish content are missing'
    }, 'responseCode': 'CLIENT_ERROR', 'result': {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SharedModule.forRoot(), CoreModule.forRoot()],
      declarations: [PublishedPopupComponent],
      providers: [ToasterService, NavigationHelperService, WorkSpaceService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize the component expected calls for getCheckListConfig  ', () => {
    const workspaceservice = TestBed.get(WorkSpaceService);
    component.contentId = fakeActivatedRoute.parent.params['contentId'];
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    const navigationHelperService: NavigationHelperService = fixture.debugElement.injector.get(NavigationHelperService);
    spyOn(workspaceservice, 'getFormData').and.callFake(() => observableOf(mockRes.publishedChecklist));
    spyOn(component, 'getCheckListConfig').and.callThrough();
    component.getCheckListConfig();
    component.ngOnInit();
    expect(component.getCheckListConfig).toHaveBeenCalledWith();
    expect(component.showModal).toBeTruthy();
    expect(component.showloader).toBeFalsy();
    expect(component.publishCheckListData).toBeDefined();
    expect(component.publishCheckListData).toBe(mockRes.publishedChecklist.result.form.data.fields[0]);
  });

  it('should validate modal when it validation passes', () => {
    component.reasons = ['Others'];
    component.inputFields = ['Others'];
    component.validateModal();
    expect(component.isDisabled).toBe(false);
  });

  it('should validate modal when it validation fails', () => {
    component.validateModal();
    expect(component.isDisabled).toBe(false);
    expect(component.showDefaultConfig).toBe(false);
  });

  it('should call reject api and get success', () => {
    component.showModal = true;
    const contentService = TestBed.get(ContentService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = resourceBundle.messages;
    spyOn(contentService, 'post').and.callFake(() => observableOf(successResponse));
    spyOn(toasterService, 'success').and.callThrough();
    fixture.detectChanges();
    component.submitPublishChanges();
    expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0004);
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
    component.submitPublishChanges();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0019);
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
    expect(component.isDisabled).toBe(false);
  });
  it('should call closeModalAfterError and makes expected calls', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    toasterService.error(resourceBundle.messages.emsg.m0005);
    fixture.detectChanges();
    component.closeModalAfterError();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
    expect(component.showloader).toBeFalsy();
    expect(component.showModal).toBeFalsy();
  });
});

