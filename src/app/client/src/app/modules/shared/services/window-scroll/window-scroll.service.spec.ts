import { TestBed, inject } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { WindowScrollService } from './window-scroll.service';

describe('WindowScrollService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowScrollService]
    });
  });

  xit('should be created', inject([WindowScrollService], (service: WindowScrollService) => {
    expect(service).toBeTruthy();
  }));
});
