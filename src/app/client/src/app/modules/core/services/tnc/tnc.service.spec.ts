import { TestBed } from '@angular/core/testing';

import { TncService } from './tnc.service';

describe('TncService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TncService = TestBed.get(TncService);
    expect(service).toBeTruthy();
  });
});
