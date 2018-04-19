import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { CoreModule, UserService } from '@sunbird/core';
import { ProfileService, ProfileHeaderComponent } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockProfileHeaderData } from './profile-header.component.spec.data';
import { Observable } from 'rxjs/Observable';
describe('ProfileHeaderComponent', () => {
  let component: ProfileHeaderComponent;
  let fixture: ComponentFixture<ProfileHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, CoreModule, SharedModule],
      declarations: [ProfileHeaderComponent],
      providers: [ProfileService, UserService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call user service', () => {
    const userService = TestBed.get(UserService);
    component.admin = ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION'];
    userService._userData$.next({ err: null, userProfile: mockProfileHeaderData.userMockData });
  });
  it('should call user service. Img size is more', () => {
    const img = {
      'name': 'abvd.png',
      'size': 200000
    };
    const profileService = TestBed.get(ProfileService);
    const formData = mockProfileHeaderData.profileResult;
    spyOn(profileService, 'updateAvatar').and.callFake(() => Observable.of(formData));
    spyOn(component, 'updateAvatar').and.callThrough();
    component.updateAvatar(img);
    expect(component.updateAvatar).toHaveBeenCalled();
  });
  it('should not call user service', () => {
    const img = [{
      'name': 'abvd.png',
      'size': 40000000
    }];
    const profileService = TestBed.get(ProfileService);
    const formData = mockProfileHeaderData.profileResult;
    spyOn(profileService, 'updateAvatar').and.callFake(() => Observable.of(formData));
    spyOn(component, 'updateAvatar').and.callThrough();
    component.updateAvatar(img);
    expect(profileService.updateAvatar).not.toHaveBeenCalled();
  });
  it('should not call user service', () => {
    const img = [{
      'name': 'abvd.png',
      'size': 200000
    }];
    const profileService = TestBed.get(ProfileService);
    const formData = mockProfileHeaderData.profileErr;
    spyOn(profileService, 'updateAvatar').and.callFake(() => Observable.throw(formData));
    spyOn(component, 'updateAvatar').and.callThrough();
    component.updateAvatar(img);
    expect(profileService.updateAvatar).toHaveBeenCalled();
  });
});
