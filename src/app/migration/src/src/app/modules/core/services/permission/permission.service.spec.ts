import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { PermissionService } from './permission.service';
import { LearnerService, UserService } from '@sunbird/core';
describe('PermissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PermissionService, ConfigService, HttpClient, LearnerService, UserService]
    });
  });

  it('should be created', inject([PermissionService], (service: PermissionService) => {
    expect(service).toBeTruthy();
  }));
});
