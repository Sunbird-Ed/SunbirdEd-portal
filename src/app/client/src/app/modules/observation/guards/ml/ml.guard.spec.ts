import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  ConfigService,
  ResourceService,
  ToasterService,
} from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { MlGuard } from './ml.guard';
import {
  of as observableOf,
  throwError as observableThrowError,
  Observable,
  of,
  throwError,
} from 'rxjs';

describe('MlGuard', () => {
  let baseHref, guard;
  let toastService, userService;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceBundle = {
    messages: {
      stmsg: {
        m0145: 'update your role to adminstrator',
      },
    },
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MlGuard,
        HttpClient,
        ConfigService,
        CacheService,
        ToasterService,
        UserService,
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: resourceBundle },
        { provide: APP_BASE_HREF, useValue: baseHref },
      ],
      imports: [HttpClientTestingModule],
    });
  });

  beforeEach(() => {
    guard = TestBed.get(MlGuard);
    userService = TestBed.get(UserService);
    toastService = TestBed.get(ToasterService);
  });

  it('should call the canActivate', inject([MlGuard], (guard: MlGuard) => {
    const res = guard.canActivate(null, null);
    expect(guard).toBeTruthy();
  }));

  it('should run #getProfileData() for adminstrator', async (done) => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: 'deo',
          type: 'administrator',
        },
      },
    });
    spyOn(guard, 'canActivate').and.callThrough();
    const value = await guard.canActivate();
    setTimeout(() => {
      expect(guard.canActivate).toHaveBeenCalled();
      expect(value).toEqual(true);
      done();
    });
  });

  it('should run #getProfileData() for leader', async (done) => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: 'deo',
          type: 'leader',
        },
      },
    });
    spyOn(guard, 'canActivate').and.callThrough();
    const value = await guard.canActivate();
    setTimeout(() => {
      expect(guard.canActivate).toHaveBeenCalled();
      expect(value).toEqual(true);
      done();
    });
  });

  it('should run #getProfileData() for teacher', async (done) => {
    userService.userData$ = observableOf({
      userProfile: {
        profileUserType: {
          subType: null,
          type: 'teacher',
        },
      },
    });
    spyOn(guard, 'canActivate').and.callThrough();
    const value = await guard.canActivate();
    setTimeout(() => {
      expect(guard.canActivate).toHaveBeenCalled();
      expect(value).toEqual(true);
      done();
    });
  });

  it('it should capture any error in canActivate', async (done) => {
    userService.userData$ = observableThrowError({});
    spyOn(guard, 'canActivate').and.callThrough();
    const value = await guard.canActivate();
    setTimeout(() => {
      expect(guard.canActivate).toHaveBeenCalled();
      expect(value).toEqual(false);
      done();
    });
  });
});
