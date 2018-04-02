import { UserService } from './../../../../core/services/user/user.service';

import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as testData from './create-collection.component.spec.data';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { CreateCollectionComponent } from './create-collection.component';


import { collectionDataInterface } from './../../../interfaces/collection.data.interface';

import { FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { ResourceService, ConfigService, ToasterService, ServerResponse } from '@sunbird/shared';

import { Router } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { EditorService } from './../../../services/editors/editor.service';
import { LearnerService } from './../../../../core/services/learner/learner.service';
import { ContentService } from '@sunbird/core';

import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from 'constants';

describe('CreateCollectionComponent', () => {
  let component: CreateCollectionComponent;
  let fixture: ComponentFixture<CreateCollectionComponent>;


  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCollectionComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule,
        SuiModule, FormsModule],
      providers: [HttpClientModule, EditorService, UserService, LearnerService, ContentService,
        ResourceService, ToasterService, ConfigService, HttpClient,
        { provide: Router, useClass: RouterStub }

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should call savemeta method', inject([EditorService, UserService], (editorService, userService) => {

    const collection = { name: 'firstname', desc: 'short_Desc' };
    userService._userData$.next({ err: null, userProfile: testData.mockRes.userMockData});


    component.saveMetaData(collection);
    this.requestBody = testData.mockRes.requestBody;
    component.createCollection(this.requestBody);
    fixture.detectChanges();

  }));


  it('should call createCollection method', inject([EditorService, UserService, Router], (editorService, userService, router) => {
    spyOn(editorService, 'create').and.callFake(() => Observable.of(testData.mockRes.createCollectionData));
    component.createCollection(testData.mockRes.requestBody);
    fixture.detectChanges();
    expect(component.isCollectionCreated).toBeTruthy();
    expect(component.contentId).toEqual('do_2124708548063559681134');
    expect(component.contentId).toBeDefined();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/workspace/content/edit/collection', 'do_2124708548063559681134', 'CollectionEditor', '', 'frmwork']);
  }));


  it('should call create api and get error response', inject([EditorService, ToasterService, ResourceService,
    HttpClient],
    (editorService, toasterService, resourceService, http, route) => {
      resourceService.messages = testData.mockRes.resourceBundle.messages;
        spyOn(toasterService, 'error').and.callThrough();
        spyOn(editorService, 'create').and.callFake(() => Observable.throw(testData.mockRes.errResponseData));

        component.createCollection(testData.mockRes.errBody);

        expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);

    }));


  it('test routing', inject([ Router], (router) => {
    component.goToCreate();
    expect(router.navigate).toHaveBeenCalledWith(['/workspace/content/create']);
  }));

});



