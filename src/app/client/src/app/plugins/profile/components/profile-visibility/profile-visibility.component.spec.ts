
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { CoreModule, UserService, LearnerService } from '@sunbird/core';
import { ProfileService, ProfileVisibilityComponent } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SuiModule } from 'ng2-semantic-ui';
import { mockProfileVisibilityData } from './profile-visibility.component.spec.data';

describe('ProfileVisibilityComponent', () => {
  let component: ProfileVisibilityComponent;
  let fixture: ComponentFixture<ProfileVisibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SuiModule, SharedModule.forRoot(), CoreModule.forRoot()],
      declarations: [ProfileVisibilityComponent],
      providers: [ResourceService, ProfileService, UserService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call user service', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = mockProfileVisibilityData.userMockData;
    userService._userData$.next({ err: null, userProfile: mockProfileVisibilityData.userMockData });
  });
  it('should call updateProfileFieldVisibility and update flag and return success response', () => {
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = mockProfileVisibilityData.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    const value = 'private';
    spyOn(profileService, 'updateProfileFieldVisibility').and.returnValue(observableOf(mockProfileVisibilityData.success));
    spyOn(toasterService, 'success').and.callThrough();
    component.setProfileFieldLabel(value);
    expect(component.visibility).toBeDefined();
    expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0040);
  });
  it('should call updateProfileFieldVisibility method and return error response', () => {
    const resourceService = TestBed.get(ResourceService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = mockProfileVisibilityData.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    const value = [];
    spyOn(profileService, 'updateProfileFieldVisibility').and.returnValue(observableThrowError(mockProfileVisibilityData.Error));
    spyOn(learnerService, 'post').and.callFake(() => observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.setProfileFieldLabel(value);
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0048);
  });
});
