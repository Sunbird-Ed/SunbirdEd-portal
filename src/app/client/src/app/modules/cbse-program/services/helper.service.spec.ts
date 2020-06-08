import { TestBed } from '@angular/core/testing';

import { HelperService } from './helper.service';
import { configureTestSuite } from '@sunbird/test-util';

describe('HelperService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: HelperService = TestBed.get(HelperService);
    expect(service).toBeTruthy();
  });
});
