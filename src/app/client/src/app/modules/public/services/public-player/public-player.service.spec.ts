import { TestBed, inject } from '@angular/core/testing';

import { PublicPlayerService } from './public-player.service';

describe('PublicPlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicPlayerService]
    });
  });

  it('should be created', inject([PublicPlayerService], (service: PublicPlayerService) => {
    expect(service).toBeTruthy();
  }));
});
