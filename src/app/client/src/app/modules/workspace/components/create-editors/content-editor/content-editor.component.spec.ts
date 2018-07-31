
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject, tick } from '@angular/core/testing';
import { ContentEditorComponent } from './content-editor.component';
import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Injectable } from '@angular/core';
import * as  iziModal from 'izimodal/js/iziModal';
import {NavigationHelperService, ResourceService, ConfigService, ToasterService, ServerResponse,
   IUserData, IUserProfile, BrowserCacheTtlService } from '@sunbird/shared';
import { EditorService } from '@sunbird/workspace';
import { ContentService, UserService, LearnerService, TenantService, CoreModule } from '@sunbird/core';
import { mockRes } from './content-editor.component.spec.data';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkSpaceService } from '../../../services';

describe('ContentEditorComponent', () => {
  let component: ContentEditorComponent;
  let fixture: ComponentFixture<ContentEditorComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentEditorComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule, CoreModule.forRoot()],
      providers: [
        EditorService, UserService, ContentService, BrowserCacheTtlService,
        ResourceService, ToasterService, ConfigService, LearnerService,
        NavigationHelperService, WorkSpaceService,
        { provide: Router, useClass: RouterStub },
        {
          provide: ActivatedRoute, useValue: {
            'params': observableOf({
              'contentId': 'do_21247940906829414411032',
              'state': 'draft'
            })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEditorComponent);
    component = fixture.componentInstance;
  });

  it('should call userservice, call open editor', inject([EditorService, UserService, Router, ToasterService,
    ResourceService, TenantService], (editorService, userService, router, toasterService, resourceService, tenantService) => {
      userService._userData$.next({ err: null, userProfile: mockRes.userMockData });
      tenantService._tenantData$.next({ err: null, tenantData: mockRes.tenantMockData.result });
      component.tenantService.tenantData = mockRes.tenantMockData.result;
      component.tenantService.tenantData.logo = mockRes.tenantMockData.result.logo;
      fixture.detectChanges();
      spyOn(editorService, 'getById').and.returnValue(observableOf(mockRes.successResult));
      component.getContentData();
      const rspData = mockRes.successResult.result.content;
      component.checkContentAccess(rspData, mockRes.validateModal);
      component.openContentEditor();
    }));

  it('should call contenteditor with error data', inject([EditorService, UserService, Router, ToasterService, ResourceService],
    (editorService, userService, router, toasterService, resourceService) => {
      resourceService.messages = mockRes.resourceBundle.messages;
      userService._userData$.next({ err: null, userProfile: mockRes.userMockData });
      fixture.detectChanges();
      spyOn(editorService, 'getById').and.returnValue(observableOf(mockRes.errorResult));
      spyOn(toasterService, 'error').and.callThrough();
      component.getContentData();
      const rspData = mockRes.errorResult.result.content;
      component.checkContentAccess(rspData, mockRes.validateModal);
      expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0004);
    }));


  it('test to navigate to drafts', inject([Router], (router) => () => {
    component.closeModal();
    setTimeout(() => {
      component.navigateToWorkSpace();
    }, 1000);

    expect(component.navigateToWorkSpace).not.toHaveBeenCalled();
    jasmine.clock().tick(1001);
    expect(component.navigateToWorkSpace).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['workspace/content/draft/1']);
  }));
  it('should listen to the browser back button event', () => {
    spyOn(sessionStorage, 'setItem').and.callThrough();
    component.ngOnInit();
    expect(window.location.hash).toEqual('#no');
  });
});
