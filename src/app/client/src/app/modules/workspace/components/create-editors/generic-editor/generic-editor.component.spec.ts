
import { async, ComponentFixture, TestBed, inject, tick } from '@angular/core/testing';
import { GenericEditorComponent } from './generic-editor.component';
import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Injectable } from '@angular/core';
import * as  iziModal from 'izimodal/js/iziModal';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile } from '@sunbird/shared';
import { ContentService, UserService, LearnerService } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomWindow } from './../../../interfaces/custom.window';
import { EditorService } from '@sunbird/workspace';
import { Observable } from 'rxjs/Observable';
import { mockRes } from './generic-editor.component.spec.data';

describe('GenericEditorComponent', () => {
  let component: GenericEditorComponent;
  let fixture: ComponentFixture<GenericEditorComponent>;


  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericEditorComponent ],
      imports: [HttpClientTestingModule, Ng2IziToastModule, RouterTestingModule],
    providers: [
      EditorService, UserService, LearnerService, ContentService,
      ResourceService, ToasterService, ConfigService,
      { provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'contentId': 'do_21247940906829414411032'
       }]) }  }
    ],
    schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericEditorComponent);
    component = fixture.componentInstance;
  });

  it('should call userservice, call open editor', inject([EditorService, UserService, Router, ToasterService,
    ResourceService], (editorService, userService, router, toasterService, resourceService) => {
    userService._userData$.next({ err: null, userProfile: mockRes.userMockData });
    fixture.detectChanges();

    spyOn(editorService, 'getById').and.returnValue(Observable.of(mockRes.successResult));
    expect(component.openGenericEditor).toBeDefined();
    component.openGenericEditor();
  }));

   it('test to navigate to create content', inject([Router], (router) => () => {
    component.closeModal();
    setTimeout(function () {
      component.navigateToCreate();
    }, 1000);

    expect(component.navigateToCreate).not.toHaveBeenCalled();
    jasmine.clock().tick(1001);
    expect(component.navigateToCreate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['workspace/content']);
  }));
});
