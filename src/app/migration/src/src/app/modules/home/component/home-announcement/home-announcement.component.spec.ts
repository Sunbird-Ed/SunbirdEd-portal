// Import NG core testing module(s)
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// Import modules
import { SharedModule, ResourceService } from '@sunbird/shared';
import { HomeAnnouncementComponent } from './home-announcement.component';
// Import services
import { AnnouncementService } from '@sunbird/core';

// Test data
import * as mockData from './home-announcement.component.spec.data';
const testData = mockData.mockRes;

describe('HomeAnnouncementComponent', () => {
  let component: HomeAnnouncementComponent;
  let fixture: ComponentFixture<HomeAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, HttpClientModule],
      declarations: [HomeAnnouncementComponent],
      providers: [ResourceService, AnnouncementService]
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
      spyOn(announcementService, 'getInboxList').and.callFake(() => Observable.of(mockRes));
      component.getInbox();
      expect(component.showdiv).toBe(true);
      expect(component.listData).toBeDefined();
      expect(component.showLoader).toBe(false);
    }));

  // When announcement api's failed response
  it('should throw error', inject([AnnouncementService],
    (announcementService: AnnouncementService) => {
      spyOn(announcementService, 'getInboxList').and.callFake(() => Observable.throw({}));
      component.getInbox();
      fixture.detectChanges();
      expect(component.showLoader).toBe(false);
    }));
});
