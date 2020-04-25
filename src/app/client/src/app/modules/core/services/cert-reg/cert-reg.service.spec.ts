import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';

import { CertRegService } from './cert-reg.service';
import {of as observableOf,  Observable } from 'rxjs';

describe('CertRegService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
      providers: [CertRegService, ConfigService, HttpClient]
  }));

  it('should be created', () => {
    const service: CertRegService = TestBed.get(CertRegService);
    expect(service).toBeTruthy();
  });

  it('should fetch all certificates', () => {
    const certRegService: CertRegService = TestBed.get(CertRegService);
    spyOn(certRegService, 'post').and.returnValue(observableOf({}));
    const params = {
      'request': {
        '_source': ['data.badge.issuer.name', 'pdfUrl', 'data.issuedOn', 'data.badge.name'],
        'query': {
          'bool': {
            'must': [{ 'match_phrase': { 'recipient.id': '123456' } },
            { 'match_phrase': { 'related.type': 'quiz' } }]
          }
        }
      }
    };
    certRegService.fetchCertificates('123456', 'quiz');
    const options = { url: 'v1/certs/search', data: params };
    expect(certRegService.post).toHaveBeenCalledWith(options);
  });
});
