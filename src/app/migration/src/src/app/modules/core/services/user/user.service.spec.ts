import { Ng2IziToastModule } from 'ng2-izitoast';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LearnerService, UserService, PermissionService } from '@sunbird/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
describe('userService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule],
      providers: [UserService, ConfigService, LearnerService]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
