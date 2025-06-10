import { TestBed } from '@angular/core/testing';

import { ProgressPlayerService } from './progress-player.service';

describe('ProgressPlayerService', () => {
  let service: ProgressPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
