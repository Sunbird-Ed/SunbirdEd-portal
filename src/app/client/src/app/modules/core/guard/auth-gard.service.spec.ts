import { TestBed, inject, async } from '@angular/core/testing';
import { AuthGuard } from './auth-gard.service';
import { RouterModule, Router, Routes, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService, ResourceService, ToasterService, BrowserCacheTtlService} from '@sunbird/shared';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LearnerService, UserService, PermissionService, CoreModule } from '@sunbird/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
describe('AuthGardService', () => {
  // const  authGuard: AuthGuard;
  const router = {
    navigate: jasmine.createSpy('navigate')
  };
  const snapshot = {
    state: jasmine.createSpy('url')
  };
  const activeroutesnapshot = {
    route: jasmine.createSpy('')
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, PermissionService, ToasterService, UserService, ResourceService, ConfigService, LearnerService,
        BrowserCacheTtlService,
        { provide: Router, useValue: router },
        { provide: RouterStateSnapshot, useValue: snapshot },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              url: [
                {
                  path: 'workspace',
                }
              ],
            },
          }
        }],
      imports: [HttpClientTestingModule, Ng2IziToastModule, CoreModule.forRoot()]
    });
  });
  it('be able to hit route when user is logged in', () => {
    const authservice = TestBed.get(AuthGuard);
    const snapshotroute = {
      url: [
        {
          path: 'workspace',
        }
      ],
      data: {}
    };
    const result = authservice.canActivate(snapshotroute, RouterStateSnapshot);
    expect(result).toBeTruthy();
  });
});
