import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { CoreModule, UserService } from '@sunbird/core';
import { ProfileService, ProfileVisibilityComponent } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SuiModule } from 'ng2-semantic-ui';
import { mockProfileVisibilityData } from './profile-visibility.component.spec.data';
import { Observable } from 'rxjs/Observable';
describe('ProfileVisibilityComponent', () => {
  let component: ProfileVisibilityComponent;
  let fixture: ComponentFixture<ProfileVisibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SuiModule, SharedModule, CoreModule],
      declarations: [ ProfileVisibilityComponent ],
      providers: [ ResourceService, ProfileService, UserService ]
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
  it('should call updateProfileFieldVisibility and update flag', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = mockProfileVisibilityData.resourceBundle.messages;
    const profileService = TestBed.get(ProfileService);
    const value = 'private';
    component.loader = false;
    spyOn(profileService, 'updateProfileFieldVisibility').and.returnValue(Observable.of(mockProfileVisibilityData.success));
    component.setProfileFieldLabel(value);
    expect(component.visibility).toBeDefined();
  });
  it('should call not updateProfileFieldVisibility and update flag', () => {
    const profileService = TestBed.get(ProfileService);
    const value = '';
    spyOn(profileService, 'updateProfileFieldVisibility').and.returnValue(Observable.throw(mockProfileVisibilityData.Error));
    component.setProfileFieldLabel(value);
    expect(component.visibility).not.toBeDefined();
  });
});
