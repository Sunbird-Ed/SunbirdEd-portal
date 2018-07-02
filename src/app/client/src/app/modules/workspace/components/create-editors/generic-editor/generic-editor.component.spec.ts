
import { async, ComponentFixture, TestBed, inject, tick } from '@angular/core/testing';
import { GenericEditorComponent } from './generic-editor.component';
import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Injectable } from '@angular/core';
import * as  iziModal from 'izimodal/js/iziModal';
import { NavigationHelperService, ResourceService, ConfigService, ToasterService, ServerResponse,
   IUserData, IUserProfile, BrowserCacheTtlService } from '@sunbird/shared';
import { ContentService, UserService, LearnerService, TenantService, CoreModule } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
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
      declarations: [GenericEditorComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule, RouterTestingModule, CoreModule.forRoot()],
      providers: [
        UserService, LearnerService, ContentService,
        ResourceService, ToasterService, ConfigService,
        NavigationHelperService, BrowserCacheTtlService,
        { provide: Router, useClass: RouterStub },
        {
          provide: ActivatedRoute, useValue: {
            'params': Observable.from([{
              'contentId': 'do_21247940906829414411032'
            }])
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericEditorComponent);
    component = fixture.componentInstance;
  });

  it('should call userservice, call open editor', inject([UserService, Router, ToasterService,
    ResourceService, TenantService], (userService, router, toasterService, resourceService, tenantService) => {
      userService._userData$.next({ err: null, userProfile: mockRes.userMockData });
      tenantService._tenantData$.next({ err: null, tenantData: mockRes.tenantMockData.result });
      component.tenantService.tenantData = mockRes.tenantMockData.result;
      component.tenantService.tenantData.logo = mockRes.tenantMockData.result.logo;
      fixture.detectChanges();
      expect(component.openGenericEditor).toBeDefined();
      component.openGenericEditor();
  }));

  it('test to navigate to create content', inject([Router], (router) => () => {
    component.closeModal();
    setTimeout(() => {
      component.navigateToWorkSpace();
    }, 1000);
    expect(component.navigateToWorkSpace).not.toHaveBeenCalled();
    jasmine.clock().tick(1001);
    expect(component.navigateToWorkSpace).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['workspace/content']);
  }));
});
