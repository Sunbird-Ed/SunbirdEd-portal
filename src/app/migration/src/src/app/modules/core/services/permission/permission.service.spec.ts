import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { PermissionService } from './permission.service';
import { LearnerService, UserService } from '@sunbird/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
describe('PermissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule],
      providers: [ResourceService, ToasterService, PermissionService, ConfigService, HttpClient, LearnerService, UserService]
    });
  });

  it('should be created', inject([PermissionService], (service: PermissionService) => {
    expect(service).toBeTruthy();
  }));
});
