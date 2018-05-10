import { TestBed, inject } from '@angular/core/testing';

import { CopyContentService } from './copy-content.service';

describe('CopyContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CopyContentService]
    });
  });

  it('should be created', inject([CopyContentService], (service: CopyContentService) => {
    expect(service).toBeTruthy();
  }));
});
