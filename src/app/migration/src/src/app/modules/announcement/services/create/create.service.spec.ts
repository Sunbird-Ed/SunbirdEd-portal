import { TestBed, inject } from '@angular/core/testing';

import { CreateService } from './create.service';

describe('CreateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateService]
    });
  });

  it('should be created', inject([CreateService], (service: CreateService) => {
    expect(service).toBeTruthy();
  }));
});
