// Import NG core testing module(s)
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// Import modules
import { SharedModule, ResourceService, ConfigService } from '@sunbird/shared';
import { HomeAnnouncementComponent } from './home-announcement.component';
// Import services
import { AnnouncementService } from '@sunbird/core';

// Test data
import * as mockData from './home-announcement.component.spec.data';
const testData = mockData.mockRes;

describe('HomeAnnouncementComponent', () => {
  let component: HomeAnnouncementComponent;
  let fixture: ComponentFixture<HomeAnnouncementComponent>;
  const fakeActivatedRoute = { 'params': Observable.from([{ 'pageNumber': 1 }]) };
    class RouterStub {
        navigate = jasmine.createSpy('navigate');
    }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, HttpClientModule, RouterTestingModule],
      declarations: [HomeAnnouncementComponent],
      providers: [ResourceService, AnnouncementService, ConfigService,
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // When announcement api's return success response
  it('should call getInboxList function of announcement service', inject([AnnouncementService],
    (announcementService: AnnouncementService) => {

      const mockRes = testData.successData;
      spyOn(announcementService, 'getInboxData').and.callFake(() => Observable.of(mockRes));
      component.getInbox(2, 1);
      expect(component.showdiv).toBe(true);
      expect(component.listData).toBeDefined();
      expect(component.showLoader).toBe(false);
    }));

  // When announcement api's failed response
  it('should throw error', inject([AnnouncementService],
    (announcementService: AnnouncementService) => {
      spyOn(announcementService, 'getInboxData').and.callFake(() => Observable.throw({}));
      component.getInbox(2, 1);
      fixture.detectChanges();
      expect(component.showLoader).toBe(false);
    }));
});
