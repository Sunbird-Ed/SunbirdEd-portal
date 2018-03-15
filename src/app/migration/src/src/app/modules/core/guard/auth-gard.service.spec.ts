import { TestBed, inject } from '@angular/core/testing';
import { AuthGuard } from './auth-gard.service';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';

describe('AuthGardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard]
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
