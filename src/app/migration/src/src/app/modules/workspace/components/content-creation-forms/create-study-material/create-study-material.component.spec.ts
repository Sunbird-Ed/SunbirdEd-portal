import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ReactiveFormsModule } from '@angular/forms';

import { SuiModule } from 'ng2-semantic-ui';
import { CreateStudyMaterialComponent } from './create-study-material.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';

import { ResourceService, ConfigService, ToasterService, ServerResponse } from '@sunbird/shared';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EditorService } from '@sunbird/workspace';
import { ContentService, UserService, LearnerService } from '@sunbird/core';



describe('CreateStudyMaterialComponent', () => {
  let component: CreateStudyMaterialComponent;
  let fixture: ComponentFixture<CreateStudyMaterialComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStudyMaterialComponent ],
      imports: [HttpClientTestingModule, Ng2IziToastModule,
        SuiModule, ReactiveFormsModule],
      providers: [EditorService, UserService, ContentService,
        ResourceService, ToasterService, ConfigService, LearnerService,
        { provide: Router, useClass: RouterStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStudyMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('test routing', inject([Router], (router) => {
    component.goToCreate();
    expect(router.navigate).toHaveBeenCalledWith(['/workspace/content/create']);
  }));
});
