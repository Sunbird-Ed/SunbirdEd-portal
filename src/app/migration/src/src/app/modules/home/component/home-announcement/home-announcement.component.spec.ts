import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SharedModule, ResourceService, ConfigService } from '@sunbird/shared';
import { HomeAnnouncementComponent } from './home-announcement.component';
import { AnnouncementService } from '@sunbird/core';
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
      imports: [SharedModule, HttpClientTestingModule, RouterTestingModule],
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
  it('should call getInboxList function of announcement service', inject([AnnouncementService],
    (announcementService: AnnouncementService) => {
      const mockRes = testData.successData;
      spyOn(announcementService, 'getInboxData').and.callFake(() => Observable.of(mockRes));
      component.populateHomeInboxData(2, 1);
      expect(component.announcementlist).toBeDefined();
      expect(component.showLoader).toBe(false);
    }));
  it('should throw error', inject([AnnouncementService],
    (announcementService: AnnouncementService) => {
      spyOn(announcementService, 'getInboxData').and.callFake(() => Observable.throw({}));
      component.populateHomeInboxData(2, 1);
      fixture.detectChanges();
      expect(component.showLoader).toBe(false);
    }));
});
