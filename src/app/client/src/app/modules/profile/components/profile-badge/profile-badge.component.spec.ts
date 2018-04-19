import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService, CoreModule, BadgesService } from '@sunbird/core';
import { ProfileBadgeComponent } from './profile-badge.component';
import { mockRes } from './profile-badge.component.spec.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

describe('ProfileBadgeComponent', () => {
  let component: ProfileBadgeComponent;
  let fixture: ComponentFixture<ProfileBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, CoreModule],
      declarations: [ProfileBadgeComponent],
      providers: [UserService, BadgesService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBadgeComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    const userService = TestBed.get(UserService);
    const badgeService = TestBed.get(BadgesService);
    userService._userProfile = mockRes.data.userProfile;
    userService._userData$.next({ err: null, userProfile: mockRes.data.userProfile });
    spyOn(badgeService, 'getAllBadgeList').and.callFake(() => Observable.of(mockRes.badgeList));
    component.ngOnInit();
  });
});
