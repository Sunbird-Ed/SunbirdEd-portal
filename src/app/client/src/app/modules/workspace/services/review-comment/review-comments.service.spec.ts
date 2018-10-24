import { TestBed, inject } from '@angular/core/testing';

import { ReviewCommentsService } from '../review-comments.service';

xdescribe('ReviewCommentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewCommentsService]
    });
  });

  it('should be created', inject([ReviewCommentsService], (service: ReviewCommentsService) => {
    expect(service).toBeTruthy();
  }));
});
