import { TestBed, inject } from '@angular/core/testing';

import { PageSectionService } from './page-section.service';

describe('PageSectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageSectionService]
    });
  });

  it('should be created', inject([PageSectionService], (service: PageSectionService) => {
    expect(service).toBeTruthy();
  }));
});
