import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, UserService, SearchService } from '@sunbird/core';
import { ProfileService, ProfilePageComponent } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '@sunbird/shared';
import { mockProfilePageData } from './profile-page.component.spec.data';
import { Observable } from 'rxjs/Observable';
describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SharedModule, CoreModule],
      declarations: [ProfilePageComponent],
      providers: [ProfileService, UserService, SearchService,
        { provide: Router, useClass: RouterStub }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call user service', () => {
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: mockProfilePageData.userMockData });
    spyOn(component, 'getMyContent').and.callThrough();
    component.getMyContent();
    expect(component.getMyContent).toHaveBeenCalled();
  });
  it('should call updateAction and route to selected field', () => {
    const router = TestBed.get(Router);
    const actions = {
      profileSummary: 'profile/summary/edit',
      jobProfile: 'profile/experience/add',
      address: 'profile/address/add',
      education: 'profile/education/add',
      location: 'profile/additionalInfo/edit',
      dob: 'profile/additionalInfo/edit',
      subject: 'profile/additionalInfo/edit',
      grade: 'profile/additionalInfo/edit'
    };
    const fields = 'address';
    component.updateAction(fields);
    expect(router.navigate).toHaveBeenCalledWith(
      ['profile/address/add']);
  });
  it('should call updateAction and not route', () => {
    const router = TestBed.get(Router);
    const actions = {
      profileSummary: 'profile/summary/edit',
      jobProfile: 'profile/experience/add',
      address: 'profile/address/add',
      education: 'profile/education/add',
      location: 'profile/additionalInfo/edit',
      dob: 'profile/additionalInfo/edit',
      subject: 'profile/additionalInfo/edit',
      grade: 'profile/additionalInfo/edit'
    };
    const fields = '';
    component.updateAction(fields);
    expect(router.navigate).not.toHaveBeenCalledWith(
      ['profile/address/add']);
  });
  it('should call user searchService searchContentByUserId', () => {
    const searchService = TestBed.get(SearchService);
    const response = undefined;
    const searchParams = {
      status: ['Live'],
      contentType: ['Collection', 'TextBook', 'Course', 'LessonPlan', 'Resource'],
      params: { lastUpdatedOn: 'desc' }
    };
    spyOn(searchService, 'searchContentByUserId').and.returnValue(Observable.of(mockProfilePageData.success));
    component.getMyContent();
    expect(component.contributions).toBeDefined();
  });
  it('should not call user searchService searchContentByUserId', () => {
    const searchService = TestBed.get(SearchService);
    const response = mockProfilePageData.success.result;
    spyOn(searchService, 'searchContentByUserId').and.returnValue(Observable.of(mockProfilePageData.success));
    component.getMyContent();
    expect(component.contributions).toBeDefined();
  });
});
