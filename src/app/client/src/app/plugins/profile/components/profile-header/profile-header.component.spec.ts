
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { CoreModule, UserService } from '@sunbird/core';
import { ProfileService, ProfileHeaderComponent } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockProfileHeaderData } from './profile-header.component.spec.data';

describe('ProfileHeaderComponent', () => {
  let component: ProfileHeaderComponent;
  let fixture: ComponentFixture<ProfileHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, CoreModule.forRoot(), SharedModule.forRoot()],
      declarations: [ProfileHeaderComponent],
      providers: [ProfileService, UserService, ResourceService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should call user service', () => {
    const userService = TestBed.get(UserService);
    component.admin = ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION'];
    userService._userData$.next({ err: null, userProfile: mockProfileHeaderData.userMockData });
  });
  it('should call user service', () => {
    const img = [{
      'name': 'abvd.png',
      'size': 200000
    }];
    const profileService = TestBed.get(ProfileService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockProfileHeaderData.resourceBundle.messages;
    const formData = mockProfileHeaderData.profileResult;
    spyOn(profileService, 'updateAvatar').and.callFake(() => observableOf(formData));
    spyOn(component, 'updateAvatar').and.callThrough();
    component.updateAvatar(img);
    expect(component.updateAvatar).toHaveBeenCalled();
  });
  it('should not call user service as the image size is more', () => {
    const img = [{
      'name': 'abvd.png',
      'size': 40000000
    }];
    const profileService = TestBed.get(ProfileService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockProfileHeaderData.resourceBundle.messages;
    const formData = mockProfileHeaderData.profileResult;
    spyOn(profileService, 'updateAvatar').and.callFake(() => observableOf(formData));
    spyOn(component, 'updateAvatar').and.callThrough();
    component.updateAvatar(img);
    expect(profileService.updateAvatar).not.toHaveBeenCalled();
  });
  it('should call user service as the file format is invalid', () => {
    const img = [{
      'name': 'abvd.csv',
      'size': 200000
    }];
    const profileService = TestBed.get(ProfileService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockProfileHeaderData.resourceBundle.messages;
    const formData = mockProfileHeaderData.profileErr;
    spyOn(profileService, 'updateAvatar').and.callFake(() => observableThrowError(formData));
    spyOn(component, 'updateAvatar').and.callThrough();
    component.updateAvatar(img);
    expect(profileService.updateAvatar).not.toHaveBeenCalled();
  });
});
