
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as testData from './details-popup.component.spec.data';
import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { TelemetryModule } from '@sunbird/telemetry';
// Modules
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';

import { AnnouncementService } from '@sunbird/core';
import { SharedModule, ResourceService, ToasterService, ConfigService, RouterNavigationService } from '@sunbird/shared';
import { DetailsPopupComponent } from './details-popup.component';

describe('DetailsPopupComponent', () => {
  let component: DetailsPopupComponent;
  let fixture: ComponentFixture<DetailsPopupComponent>;
  const fakeActivatedRoute = {
    'params': observableOf({ 'announcementId': 'fa355310-0b09-11e8-93d1-2970a259a0ba' }),
    snapshot: {
      data: {
          telemetry: {
            env: 'announcement', pageid: 'announcement-read', type: 'view', object: { type: 'announcement', ver: '1.0' }
          }
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsPopupComponent],
      imports: [HttpClientTestingModule, Ng2IziToastModule,
        SuiModule, SharedModule.forRoot(), TelemetryModule.forRoot()],
      providers: [HttpClientModule, AnnouncementService, RouterNavigationService,
        ResourceService, ToasterService, ConfigService, HttpClient,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call get announcement by id api and get success response', inject([AnnouncementService, ActivatedRoute,
    ResourceService, ToasterService, HttpClient],
    (announcementService, activatedRoute, resourceService, toasterService, http) => {
      spyOn(announcementService, 'getAnnouncementById').and.callFake(() => observableOf(testData.mockRes.getAnnByIdSuccess));
      const params = { data: { 'request': { 'announcementId': 'fa355310-0b09-11e8-93d1-2970a259a0ba' } } };
      spyOn(resourceService, 'getResource').and.callThrough();
      spyOn(toasterService, 'success').and.callThrough();
      spyOn(http, 'get').and.callFake(() => observableOf(testData.mockRes.resourceBundle));
      http.get().subscribe(
        data => {
          resourceService.messages = data.messages;
        }
      );
      component.getDetails('fa355310-0b09-11e8-93d1-2970a259a0ba');
      announcementService.getAnnouncementById(params).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
          expect(apiResponse.params.status).toBe('successful');
        }
      );
      fixture.detectChanges();
      expect(component.showLoader).toBe(false);

    }));

  it('should call announcementService and announcement details object', inject([AnnouncementService],
    (announcementService) => {
      announcementService.announcementDetailsObject = testData.mockRes.detailsObject;
      component.getDetails('92ca4110-19df-11e8-8773-d9334313c305');
      expect(component.showLoader).toBe(false);
      fixture.detectChanges();
    }));

  it('should call get announcement by id api and get error response',
    inject([AnnouncementService, ToasterService, ResourceService, HttpClient, RouterNavigationService],
      (announcementService, toasterService, resourceService, http, routerNavigationService) => {
        spyOn(announcementService, 'getAnnouncementById').and.callFake(() => observableThrowError(testData.mockRes.getAnnByIdError));
        spyOn(component, 'getDetails').and.callThrough();
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
        component.getDetails('fa355310-0b09-11e8-93d1-2970a259a0ba');
        announcementService.getAnnouncementById(param).subscribe(
          apiResponse => {
          },
          err => {
            expect(err.params.errmsg).toBe('Unauthorized User');
            expect(err.params.status).toBe('failed');
            expect(err.responseCode).toBe('CLIENT_ERROR');
          }
        );
        expect(component.showLoader).toBe(false);
      }));

      it('should unsubscribe from all observable subscriptions', () => {
        component.getDetails('92ca4110-19df-11e8-8773-d9334313c305');
        component.ngOnInit();
        spyOn(component.unsubscribe, 'complete');
        component.ngOnDestroy();
        expect(component.unsubscribe.complete).toHaveBeenCalled();
      });
});


