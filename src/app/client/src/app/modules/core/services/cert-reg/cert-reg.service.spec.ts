import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';

import { CertRegService } from './cert-reg.service';

describe('CertRegService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
      providers: [CertRegService, ConfigService, HttpClient]
  }));

  it('should be created', () => {
    const service: CertRegService = TestBed.get(CertRegService);
    expect(service).toBeTruthy();
  });
});
