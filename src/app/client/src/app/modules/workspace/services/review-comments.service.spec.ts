import { TestBed, inject } from '@angular/core/testing';

import { ReviewCommentsService } from './review-comments.service';

describe('ReviewCommentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewCommentsService]
    });
  });

  it('should be created', inject([ReviewCommentsService], (service: ReviewCommentsService) => {
    expect(service).toBeTruthy();
  }));
});
