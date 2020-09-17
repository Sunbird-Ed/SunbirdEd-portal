import { TestBed } from '@angular/core/testing';

import { FaqService } from './faq.service';

xdescribe('FaqService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FaqService = TestBed.get(FaqService);
    expect(service).toBeTruthy();
  });
});
