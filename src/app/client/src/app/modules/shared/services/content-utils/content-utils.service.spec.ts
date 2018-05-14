import { TestBed, inject } from '@angular/core/testing';

import { ContentUtilsService } from './content-utils.service';

describe('ContentUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentUtilsService]
    });
  });

  it('should be created', inject([ContentUtilsService], (service: ContentUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
