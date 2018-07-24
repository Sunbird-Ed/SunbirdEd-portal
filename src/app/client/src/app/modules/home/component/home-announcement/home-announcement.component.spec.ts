
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SharedModule, ResourceService, ConfigService } from '@sunbird/shared';
import { HomeAnnouncementComponent } from './home-announcement.component';
import { AnnouncementService } from '@sunbird/core';
import { NgInviewModule } from 'angular-inport';
import { HomeAnnouncementService } from './../../service/index';
import * as mockData from './home-announcement.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
const testData = mockData.mockRes;
describe('HomeAnnouncementComponent', () => {
  let component: HomeAnnouncementComponent;
  let fixture: ComponentFixture<HomeAnnouncementComponent>;
  const fakeActivatedRoute = { 'params': observableOf({ 'pageNumber': 1 }) };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), HttpClientTestingModule, RouterTestingModule,
      NgInviewModule, TelemetryModule],
      declarations: [HomeAnnouncementComponent],
      providers: [ResourceService, AnnouncementService, ConfigService, CacheService, HomeAnnouncementService, CacheService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: RouterOutlet, useValue: fakeActivatedRoute }]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should call getInboxList function of announcement service', inject([HomeAnnouncementService],
    (homeAnnouncementService: HomeAnnouncementService) => {
      const mockRes = testData.successData;
      spyOn(homeAnnouncementService, 'getInboxData').and.callFake(() => observableOf(mockRes));
      component.populateHomeInboxData(2, 1);
      expect(component.announcementlist).toBeDefined();
      expect(component.showLoader).toBe(false);
    }));
  it('should throw error', inject([HomeAnnouncementService],
    (homeAnnouncementService: HomeAnnouncementService) => {
      spyOn(homeAnnouncementService, 'getInboxData').and.callFake(() => observableThrowError({}));
      component.populateHomeInboxData(2, 1);
      fixture.detectChanges();
      expect(component.showLoader).toBe(false);
    }));
   it('should emit the event', () => {
      spyOn(component.inviewEvent, 'emit');
      component.inview(testData.inviewData);
      expect(component.inviewEvent.emit).toHaveBeenCalled();
      expect(component.inviewEvent.emit).toHaveBeenCalledWith(testData.inviewData);
    });
  it('should unsubscribe from all observable subscriptions', () => {
      component.populateHomeInboxData(2, 1);
      component.readAnnouncement('1f1a50f0-e4a3-11e7-b47d-4ddf97f76f43', true);
      spyOn(component.unsubscribe, 'complete');
      component.ngOnDestroy();
      expect(component.unsubscribe.complete).toHaveBeenCalled();
    });
});
