import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { mockRes } from './create-org-type.component.spec.data';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

import { CreateOrgTypeComponent, OrgTypeService, IorgTypeData } from '@sunbird/org-management';
import { LearnerService } from '@sunbird/core';

import {
  SharedModule, ResourceService, PaginationService, ToasterService, ServerResponse, RouterNavigationService
} from '@sunbird/shared';


describe('CreateOrgTypeComponent', () => {
  let component: CreateOrgTypeComponent;
  let fixture: ComponentFixture<CreateOrgTypeComponent>;
  const fakeActivatedRoute = { 'url': Observable.from([]) };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateOrgTypeComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule,
        SuiModule, RouterTestingModule, ReactiveFormsModule, FormsModule,
        SharedModule],
      providers: [HttpClientModule, OrgTypeService,
        PaginationService, ToasterService, ResourceService, LearnerService, RouterNavigationService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: RouterOutlet, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrgTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call add api and get success response', inject([OrgTypeService, RouterNavigationService],
    (orgTypeService, routerNavigationService) => {
      const resourceService = TestBed.get(ResourceService);
      resourceService.messages = mockRes.resourceBundle.messages;
      spyOn(routerNavigationService, 'navigateToParentUrl').and.returnValue(undefined);
      spyOn(orgTypeService, 'addOrgType').and.callFake(() => Observable.of(mockRes.orgTypeAddSuccess));
      component.addOrgType();
      orgTypeService.addOrgType('test').subscribe(
        addResponse => {
          expect(mockRes.orgTypeAddSuccess.params.status).toBe('success');
        }
      );
      fixture.detectChanges();
      expect(component.createForm).toBe(true);
    }));

    it('should call update api and get success response', inject([OrgTypeService, RouterNavigationService],
      (orgTypeService, routerNavigationService) => {
        const resourceService = TestBed.get(ResourceService);
        component.orgName = new FormControl('test');
        resourceService.messages = mockRes.resourceBundle.messages;
        spyOn(routerNavigationService, 'navigateToParentUrl').and.returnValue(undefined);
        spyOn(orgTypeService, 'updateOrgType').and.callFake(() => Observable.of(mockRes.orgTypeUpdateSuccess));
        component.updateOrgType();
        orgTypeService.updateOrgType({ 'id': '1', 'name': 'test' }).subscribe(
          addResponse => {
            expect(mockRes.orgTypeAddSuccess.params.status).toBe('success');
          }
        );
        fixture.detectChanges();
      }));
  });
