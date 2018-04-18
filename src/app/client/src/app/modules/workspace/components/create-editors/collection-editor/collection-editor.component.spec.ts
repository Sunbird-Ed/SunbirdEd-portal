import { Observable } from 'rxjs/Observable';
import { async, ComponentFixture, TestBed, inject, tick} from '@angular/core/testing';
import { CollectionEditorComponent } from './collection-editor.component';
import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Injectable } from '@angular/core';

import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile } from '@sunbird/shared';
import { EditorService } from '@sunbird/workspace';
import { ContentService, UserService, LearnerService } from '@sunbird/core';
import { mockRes } from './collection-editor.component.spec.data';

import { Router, ActivatedRoute } from '@angular/router';
import { CustomWindow } from './../../../interfaces/custom.window';

describe('CollectionEditorComponent', () => {
  let component: CollectionEditorComponent;
  let fixture: ComponentFixture<CollectionEditorComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionEditorComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule],
      providers: [
        EditorService, UserService, ContentService,
        ResourceService, ToasterService, ConfigService, LearnerService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'contentId': 'do_21247940906829414411032',
        'type': 'collection', 'state': 'state', 'framework': 'framework' }]) }  }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionEditorComponent);
    component = fixture.componentInstance;


  });

  it('should call userservice, call open editor', inject([EditorService, UserService, Router, ToasterService,
    ResourceService], (editorService, userService, router, toasterService, resourceService) => {
    userService._userData$.next({ err: null, userProfile: mockRes.userMockData });
    fixture.detectChanges();


    spyOn(editorService, 'getById').and.returnValue(Observable.of(mockRes.successResult));
    component.openCollectionEditor();

    const rspData = mockRes.successResult.result.content;
    component.validateRequest(rspData, mockRes.validateModal);

    const status = 'draft';
    component.updateModeAndStatus('draft');
    component.updateModeAndStatus('live');
    component.updateModeAndStatus('flagged');


    component.getTreeNodes('Course');
    expect( component.getTreeNodes).not.toBeUndefined();
  }));


  it('should call collectioneditor with error data', inject([EditorService, UserService, Router, ToasterService, ResourceService],
    (editorService, userService, router, toasterService, resourceService) => {

      resourceService.messages = mockRes.resourceBundle.messages;

      userService._userData$.next({ err: null, userProfile: mockRes.userMockData });

      fixture.detectChanges();
      spyOn(editorService, 'getById').and.returnValue(Observable.of(mockRes.errorResult));
      spyOn(toasterService, 'error').and.callThrough();
      component.openCollectionEditor();
      const rspData = mockRes.errorResult.result.content;
      component.validateRequest(rspData, mockRes.validateModal);
      expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0004);

    }));

    it('test to navigate to drafts', inject([Router], (router) => () => {
      component.closeModal();
      setTimeout(function () {
        component.navigateToDraft();
      }, 1000);

      expect(component.navigateToDraft).not.toHaveBeenCalled();
      jasmine.clock().tick(1001);
      expect(component.navigateToDraft).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['workspace/content/draft/1']);
    }));
});
