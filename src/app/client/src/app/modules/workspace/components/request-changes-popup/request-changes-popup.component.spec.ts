
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
import { RequestChangesPopupComponent } from './request-changes-popup.component';

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
      }
    }
  };

  const fakeActivatedRoute = {
    parent: { params: observableOf({ contentId: 'do_112485749070602240134' }) },
    snapshot: { parent: { url: [{ path: 'do_112485749070602240134', }], } }
  };

  const successResponse = {
    'id': 'api.content.reject', 'ver': '1.0', 'ts': '2018-05-14T08:30:01.363Z',
    'params': {
      'resmsgid': 'fe806e30-5750-11e8-97d3-b1c7504700f9',
      'msgid': 'fe5d2ec0-5750-11e8-844d-dbd17f3aacde', 'status': 'successful',
      'err': null, 'errmsg': null
    }, 'responseCode': 'OK', 'result': {
      'node_id': 'do_112503338431881216165',
      'versionKey': '1526286601303'
    }
  };

  const errorResponse = {
    'id': 'api.content.reject', 'ver': '1.0', 'ts': '2018-05-14T07:15:55.458Z',
    'params': {
      'resmsgid': 'a4892a20-5746-11e8-97d3-b1c7504700f9',
      'msgid': null, 'status': 'failed', 'err': 'ERR_RELATION_GET_PROPERTY',
      'errmsg': '[Ljava.lang.String; cannot be cast to java.lang.String'
    },
    'responseCode': 'SERVER_ERROR', 'result': {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SuiModule, SharedModule.forRoot(), CoreModule.forRoot()],
      declarations: [RequestChangesPopupComponent],
      providers: [ToasterService, NavigationHelperService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestChangesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    const contentService = TestBed.get(ContentService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = resourceBundle.messages;
    spyOn(contentService, 'post').and.callFake(() => observableThrowError(errorResponse));
    spyOn(toasterService, 'error').and.callThrough();
    fixture.detectChanges();
    component.submitRequestChanges();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0020);
  });
});
