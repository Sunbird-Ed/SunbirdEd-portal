import { TestBed } from '@angular/core/testing';

import { OfflineCardService } from './offline-card.service';

describe('OfflineCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfflineCardService = TestBed.get(OfflineCardService);
    expect(service).toBeTruthy();
  });
});
