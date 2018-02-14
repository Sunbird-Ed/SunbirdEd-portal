import { TestBed, inject } from '@angular/core/testing';

import { FrameworkApiService } from './framework-api.service';

describe('FrameworkApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrameworkApiService]
    });
  });

  it('should be created', inject([FrameworkApiService], (service: FrameworkApiService) => {
    expect(service).toBeTruthy();
  }));
});
