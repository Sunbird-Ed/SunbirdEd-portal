import { TestBed, inject } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService]
    });
  });

  it('should be created', inject([ConfigService], (service: ConfigService) => {
    expect(service).toBeTruthy();
  }));
});
