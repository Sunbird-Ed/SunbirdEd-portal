import { TestBed, inject } from '@angular/core/testing';

import { InViewWrapperService } from './in-view-wrapper.service';

describe('InViewWrapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InViewWrapperService]
    });
  });

  it('should be created', inject([InViewWrapperService], (service: InViewWrapperService) => {
    expect(service).toBeTruthy();
  }));
});
