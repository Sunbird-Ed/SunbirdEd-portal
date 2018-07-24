
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as testData from './delete.component.spec.data';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';

// Modules
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { AnnouncementService } from '@sunbird/core';
import { SharedModule, ResourceService, ToasterService, ConfigService, RouterNavigationService } from '@sunbird/shared';
import { DeleteComponent } from './delete.component';
import { TelemetryModule } from '@sunbird/telemetry';

describe('DeleteComponent', () => {
  let component: DeleteComponent;
  let fixture: ComponentFixture<DeleteComponent>;
  const fakeActivatedRoute = {
    'params': observableOf({ 'pageNumber': 10 }),
    'parent': { 'params': observableOf({ 'pageNumber': 10 }) }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule,
        SuiModule, SharedModule.forRoot(),  TelemetryModule.forRoot()],
      providers: [HttpClientModule, AnnouncementService,
        ResourceService, ToasterService, ConfigService, HttpClient, RouterNavigationService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call delete api and get success response', inject([AnnouncementService, ActivatedRoute,
    ResourceService, ToasterService, HttpClient, RouterNavigationService],
    (announcementService, activatedRoute, resourceService, toasterService, http, routerNavigationService) => {
      spyOn(announcementService, 'deleteAnnouncement').and.callFake(() => observableOf(testData.mockRes.deleteSuccess));
      spyOn(component, 'deleteAnnouncement').and.callThrough();
      const params = { data: { 'request': { 'announcementId': 'fa355310-0b09-11e8-93d1-2970a259a0ba' } } };
      const modal = fixture.componentInstance.modal;
      spyOn(resourceService, 'getResource').and.callThrough();
      spyOn(routerNavigationService, 'navigateToParentUrl').and.returnValue(undefined);
      spyOn(toasterService, 'success').and.callThrough();
      spyOn(http, 'get').and.callFake(() => observableOf(testData.mockRes.resourceBundle));
      http.get().subscribe(
        data => {
          resourceService.messages = data.messages;
        }
      );
      component.deleteAnnouncement();
      announcementService.deleteAnnouncement(params).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.result.status).toBe('cancelled');
          expect(apiResponse.params.status).toBe('successful');
        }
      );
      fixture.detectChanges();
      expect(component.modal).toBeDefined();
    }));

  it('should call delete api and get error response', inject([AnnouncementService, ToasterService, ResourceService,
    HttpClient, RouterNavigationService],
    (announcementService, toasterService, resourceService, http, routerNavigationService) => {
      spyOn(announcementService, 'deleteAnnouncement').and.callFake(() => observableThrowError(testData.mockRes.deleteError));
      spyOn(component, 'deleteAnnouncement').and.callThrough();
      const param = { data: { 'request': { 'announcementId': '' } } };
      spyOn(resourceService, 'getResource').and.callThrough();
      spyOn(routerNavigationService, 'navigateToParentUrl').and.returnValue(undefined);
      spyOn(toasterService, 'error').and.callThrough();
      spyOn(http, 'get').and.callFake(() => observableOf(testData.mockRes.resourceBundle));
      http.get().subscribe(
        data => {
          resourceService.messages = data.messages;
        }
      );
      component.deleteAnnouncement();
      announcementService.deleteAnnouncement(param).subscribe(
        apiResponse => {
        },
        err => {
          expect(err.error.params.errmsg).toBe('Unauthorized User');
          expect(err.error.params.status).toBe('failed');
          expect(err.error.responseCode).toBe('CLIENT_ERROR');
        }
      );
    }));

  it('should call redirect', inject([RouterNavigationService], (routerNavigationService) => {
    spyOn(routerNavigationService, 'navigateToParentUrl').and.returnValue(undefined);
    component.redirect();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.pageNumber).toEqual(10);
  }));

  it('should unsubscribe from all observable subscriptions', () => {
    component.deleteAnnouncement();
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
});
