import { TestBed, inject, async } from '@angular/core/testing';
import { AuthGuard } from './auth-gard.service';
import { RouterModule , Router, Routes, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { ConfigService, ResourceService, ToasterService } from '@sunbird/shared';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import 'rxjs/add/operator/map';
import { LearnerService, UserService, PermissionService } from '@sunbird/core';
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
      {provide: Router, useValue: router},
      {provide: RouterStateSnapshot, useValue: snapshot}, {provide: ActivatedRouteSnapshot, useValue: activeroutesnapshot}],
      imports: [ HttpClientTestingModule, Ng2IziToastModule]
    });
  });

  it('be able to hit route when user is logged in', () => {
    const authservice =  TestBed.get(AuthGuard);
    const result = authservice.canActivate(ActivatedRouteSnapshot, RouterStateSnapshot);
    expect(result).toBeTruthy();
  });
});
