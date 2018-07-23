
import {throwError as observableThrowError, of as observableOf,  Observable ,  BehaviorSubject } from 'rxjs';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { mockRes } from './create-org-type.component.spec.data';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CreateOrgTypeComponent, OrgTypeService, IorgTypeData } from '@sunbird/org-management';
import { LearnerService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import {
  SharedModule, ResourceService, PaginationService, ToasterService, ServerResponse, RouterNavigationService
} from '@sunbird/shared';

describe('CreateOrgTypeComponent', () => {
  let component: CreateOrgTypeComponent;
  let fixture: ComponentFixture<CreateOrgTypeComponent>;

  class ActivatedRouteStub {
    url = observableOf([{ path: 'update' }]);
    snapshot = {
      params: { orgId: '01250975059541196818' },
      data: {
        telemetry: {
          env: 'org-management', pageid: 'create-organization-type', type: 'create'
        }
      }
    };
    public changeUrl(params) {
      this.url = observableOf([{ path: params }]);
    }
  }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateOrgTypeComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule,
        SuiModule, RouterTestingModule, ReactiveFormsModule, FormsModule,
        SharedModule.forRoot(), TelemetryModule.forRoot()],
      providers: [HttpClientModule, OrgTypeService,
        PaginationService, ToasterService, ResourceService, LearnerService, RouterNavigationService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: RouterOutlet, useClass: ActivatedRouteStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrgTypeComponent);
    component = fixture.componentInstance;
  });

  it('should call add api and get success response', inject([OrgTypeService, RouterNavigationService, ToasterService],
    (orgTypeService, routerNavigationService, toasterService) => {
      const resourceService = TestBed.get(ResourceService);
      resourceService.messages = mockRes.resourceBundle.messages;
      spyOn(routerNavigationService, 'navigateToParentUrl').and.returnValue(undefined);
      spyOn(orgTypeService, 'addOrgType').and.callFake(() => observableOf(mockRes.orgTypeAddSuccess));
      spyOn(toasterService, 'success').and.callThrough();
      component.addOrgType();
      fixture.detectChanges();
      expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0035);
    }));

  it('should call add api and get error response', inject([OrgTypeService, RouterNavigationService, ToasterService],
    (orgTypeService, routerNavigationService, toasterService) => {
      const resourceService = TestBed.get(ResourceService);
      resourceService.messages = mockRes.resourceBundle.messages;
      spyOn(routerNavigationService, 'navigateToParentUrl').and.returnValue(undefined);
      spyOn(orgTypeService, 'addOrgType').and.callFake(() => observableThrowError(mockRes.orgTypeAddError));
      spyOn(toasterService, 'error').and.callThrough();
      component.addOrgType();
      fixture.detectChanges();
      expect(toasterService.error).toHaveBeenCalledWith(mockRes.orgTypeAddError.error.params.errmsg);
    }));

  it('should call update api and get success response', inject([OrgTypeService, RouterNavigationService, ToasterService],
    (orgTypeService, routerNavigationService, toasterService) => {
      const resourceService = TestBed.get(ResourceService);
      component.orgName = new FormControl('test');
      resourceService.messages = mockRes.resourceBundle.messages;
      spyOn(routerNavigationService, 'navigateToParentUrl').and.returnValue(undefined);
      spyOn(orgTypeService, 'updateOrgType').and.callFake(() => observableOf(mockRes.orgTypeUpdateSuccess));
      spyOn(toasterService, 'success').and.callThrough();
      component.updateOrgType();
      fixture.detectChanges();
      expect(toasterService.success).toHaveBeenCalledWith(component.orgName.value + ' ' + resourceService.messages.smsg.m0037);
    }));

  it('should call update api and get error response', inject([OrgTypeService, RouterNavigationService, ToasterService],
    (orgTypeService, routerNavigationService, toasterService) => {
      const resourceService = TestBed.get(ResourceService);
      component.orgName = new FormControl('test');
      resourceService.messages = mockRes.resourceBundle.messages;
      spyOn(routerNavigationService, 'navigateToParentUrl').and.returnValue(undefined);
      spyOn(orgTypeService, 'updateOrgType').and.callFake(() => observableThrowError(mockRes.orgTypeUpdateError));
      spyOn(toasterService, 'error').and.callThrough();
      component.updateOrgType();
      fixture.detectChanges();
      expect(toasterService.error).toHaveBeenCalledWith(mockRes.orgTypeUpdateError.error.params.errmsg);
    }));

  it('When page is update', inject([OrgTypeService],
    (orgTypeService) => {
      orgTypeService._orgTypeData$.next({ err: null, orgTypeData: mockRes.getOrgType });
      fixture.detectChanges();
      expect(component.pageId).toEqual('update-organization-type');
    }));

  it('When page is create', inject([OrgTypeService],
    (orgTypeService) => {
      const activatedRouteStub = TestBed.get(ActivatedRoute);
      activatedRouteStub.changeUrl('create');
      fixture.detectChanges();
      expect(component.createForm).toEqual(true);
      expect(component.pageUri).toEqual('orgType/create');
      expect(component.pageId).toEqual('create-organization-type');
    }));

    it('should unsubscribe from all observable subscriptions', () => {
      component.addOrgType();
      component.updateOrgType();
      component.ngOnInit();
      spyOn(component.unsubscribe$, 'complete');
      component.ngOnDestroy();
      expect(component.unsubscribe$.complete).toHaveBeenCalled();
    });
});
