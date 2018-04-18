import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService, CoreModule, BadgesService } from '@sunbird/core';
import { ProfileBadgeComponent } from './profile-badge.component';
import { mockRes } from './profile-badge.component.spec.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, DateFormatPipe } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as moment from 'moment';

describe('DateFormatPipe', () => {
  describe('#transform', () => {
    it('should take default format for date', () => {
      const pipe = new DateFormatPipe();
      const date = new Date();
      const result = pipe.transform(date, '');
      const ans = moment(date).format('Do MMMM YYYY');
      expect(result).toBe(ans);
    });
    it('test for given format for date', () => {
      const pipe = new DateFormatPipe();
      const date = new Date();
      const result = pipe.transform(date, 'MMMM YYYY Do');
      const ans = moment(date).format('MMMM YYYY Do');
      expect(result).toBe(ans);
    });
    it('if date is blank', () => {
      const pipe = new DateFormatPipe();
      const result = pipe.transform('', 'Do MMMM YYYY');
      expect(result).toBe('Invalid date');
    });
  });
});

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
