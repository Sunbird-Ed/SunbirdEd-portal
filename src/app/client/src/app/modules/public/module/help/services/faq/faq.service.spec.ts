import { TestBed } from '@angular/core/testing';

import { FaqService } from './faq.service';

describe('FaqService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FaqService = TestBed.get(FaqService);
    expect(service).toBeTruthy();
  });
});
