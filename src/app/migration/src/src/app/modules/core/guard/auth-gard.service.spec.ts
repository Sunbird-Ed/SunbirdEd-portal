import { TestBed, inject } from '@angular/core/testing';
import { AuthGuard } from './auth-gard.service';
import {Router, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { PermissionService } from './../services';
import { ConfigService, ResourceService, ToasterService, UserProfile, UserData } from '@sunbird/shared';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import 'rxjs/add/operator/map';
import { LearnerService, UserService } from '@sunbird/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
describe('AuthGardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, PermissionService, ToasterService, UserService, ResourceService, ConfigService, LearnerService],
      imports: [RouterTestingModule, HttpClientTestingModule, Ng2IziToastModule]
    });
  });

  it('should be created', inject([AuthGuard], (service: AuthGuard) => {
    expect(service).toBeTruthy();
  }));

  // it('be able to hit route when user is logged in', () => {
  //   // storageService.isLoggedIn = true;
  //   expect(AuthGuard.call);
  // });
});
