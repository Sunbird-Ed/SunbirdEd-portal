import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { ElectronService } from './electron.service';
import { configureTestSuite } from '@sunbird/test-util';

describe('LearnerService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ElectronService, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([ElectronService], (service: ElectronService) => {
    expect(service).toBeTruthy();
  }));
});
