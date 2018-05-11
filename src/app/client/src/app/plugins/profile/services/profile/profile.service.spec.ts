import { TestBed, inject } from '@angular/core/testing';
import { ProfileService } from '@sunbird/profile';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
describe('ProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule],
      providers: [ProfileService]
    });
  });

  it('should be created', inject([ProfileService], (service: ProfileService) => {
    expect(service).toBeTruthy();
  }));
});
